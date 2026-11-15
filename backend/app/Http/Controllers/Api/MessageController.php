<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Services\MarkResponder;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Conversation $conversation): JsonResponse
    {
        $messages = $conversation->messages()->get();

        return ApiResponse::ok($messages, 'Messages.', ['count' => $messages->count()]);
    }

    /**
     * One turn in, one turn back. Both are returned together so a client never has to guess when
     * Mark has answered or poll to find out.
     */
    public function store(Request $request, MarkResponder $mark): JsonResponse
    {
        $data = $request->validate([
            'conversation_id' => ['required', 'integer', 'exists:conversations,id'],
            'body' => ['required', 'string', 'max:4000'],
            'modality' => ['nullable', 'string', 'in:text,voice'],
            'mode' => ['sometimes', 'required', \App\Support\ConversationMode::RULE],
            'client_turn_id' => ['sometimes', 'required', 'uuid'],
        ]);

        $conversation = Conversation::with('skill')->findOrFail($data['conversation_id']);
        abort_if($conversation->attempt && $conversation->attempt->status !== 'active',409,'This exercise has ended.');
        // The thread's mode is the default; a request may still name one explicitly.
        if (isset($data['mode'])) \App\Support\ConversationMode::validate($data['mode'], $conversation->skill, false);
        $modality = isset($data['mode']) ? \App\Support\ConversationMode::input($data['mode']) : ($data['modality'] ?? $conversation->modality);

        // The skill's flags are the contract, so they are enforced here rather than trusted to
        // the client that drew the picker.
        if (! $conversation->skill?->accepts($modality)) {
            return ApiResponse::fail(
                "This skill does not accept {$modality}.",
                ['modality' => ["The skill \"{$conversation->skill?->key}\" does not accept {$modality}."]],
            );
        }

        // Serialize turns on the conversation, including retries whose first HTTP response was lost.
        // The reply and its input commit together; a crashed worker leaves neither half behind.
        try {
            [$sent, $reply, $opening] = \Illuminate\Support\Facades\DB::transaction(function () use ($conversation, $data, $modality, $mark) {
                $conversation = Conversation::whereKey($conversation->id)->lockForUpdate()->firstOrFail();
                $key = isset($data['client_turn_id']) ? 'turn_'.$data['client_turn_id'] : null;
                if ($key && ($sent = $conversation->messages()->where('realtime_item_id', $key)->first())) {
                    abort_unless($sent->body === $data['body'], 409, 'Turn identifier already used.');
                    $reply = $conversation->messages()->where('realtime_item_id', 'reply_'.$data['client_turn_id'])->firstOrFail();
                    return [$sent, $reply, null];
                }
                $opening = ! $conversation->messages()->exists() ? $mark->open($conversation) : null;
                $sent = Message::create([
                    'conversation_id' => $conversation->id, 'role' => Message::ROLE_USER,
                    'body' => $data['body'], 'modality' => $modality,
                    'realtime_item_id' => $key, 'sent_at' => now(),
                    'meta' => ['mode' => $data['mode'] ?? null, 'status' => 'completed'],
                ]);
                $reply = $mark->reply($conversation, $sent);
                if ($key) $reply->update(['realtime_item_id' => 'reply_'.$data['client_turn_id']]);
                $conversation->update(['last_message_at' => $reply->sent_at]);
                return [$sent, $reply, $opening];
            });

        } catch (\RuntimeException $e) {
            if ($e instanceof \Symfony\Component\HttpKernel\Exception\HttpExceptionInterface) throw $e;
            return ApiResponse::fail('AI reply unavailable. Retry this turn.', [], 503);
        }

        return ApiResponse::ok(
            ['sent' => $sent, 'reply' => $reply, 'opening' => $opening],
            'Message sent.',
            ['conversation_id' => $conversation->id],
            201,
        );
    }
}
