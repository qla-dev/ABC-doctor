<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Services\NinaResponder;
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
     * Nina has answered or poll to find out.
     */
    public function store(Request $request, NinaResponder $nina): JsonResponse
    {
        $data = $request->validate([
            'conversation_id' => ['required', 'integer', 'exists:conversations,id'],
            'body' => ['required', 'string', 'max:4000'],
            'modality' => ['nullable', 'string', 'in:text,voice'],
        ]);

        $conversation = Conversation::with('skill')->findOrFail($data['conversation_id']);
        $modality = $data['modality'] ?? 'text';

        // The skill's flags are the contract, so they are enforced here rather than trusted to
        // the client that drew the picker.
        if (! $conversation->skill?->accepts($modality)) {
            return ApiResponse::fail(
                "This skill does not accept {$modality}.",
                ['modality' => ["The skill \"{$conversation->skill?->key}\" does not accept {$modality}."]],
            );
        }

        $sent = Message::create([
            'conversation_id' => $conversation->id,
            'role' => Message::ROLE_USER,
            'body' => $data['body'],
            'modality' => $modality,
            'sent_at' => now(),
        ]);

        $reply = $nina->reply($conversation, $sent);

        $conversation->update(['last_message_at' => $reply->sent_at]);

        return ApiResponse::ok(
            ['sent' => $sent, 'reply' => $reply],
            'Message sent.',
            ['conversation_id' => $conversation->id],
            201,
        );
    }
}
