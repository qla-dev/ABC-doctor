<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Services\MarkInstructions;
use App\Services\OpenAiRealtimeClient;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MarkRealtimeController extends Controller
{
    /**
     * One side of a spoken turn, saved as an ordinary message.
     *
     * A realtime call runs peer to peer between the phone and OpenAI; the server never hears it.
     * Without this the whole consultation exists only as audio nobody kept, and history shows a
     * thread with a single opening line and nothing after it.
     *
     * Deliberately NOT `POST /messages`: that one answers. These turns have already been spoken
     * and answered inside the call, so asking the text model to reply again would put a second,
     * contradictory Mark into the same thread.
     */
    public function transcript(Request $request): JsonResponse
    {
        $data = $request->validate([
            'conversation_id' => ['required', 'integer', 'exists:conversations,id'],
            'role' => ['required', 'string', 'in:user,assistant'],
            'body' => ['required', 'string', 'max:4000'],
            'item_id' => ['nullable', 'string', 'max:100', 'regex:/^[a-zA-Z0-9_-]+$/'],
        ]);

        $conversation = Conversation::findOrFail($data['conversation_id']);

        $attributes = [
            'conversation_id' => $conversation->id,
            'role' => $data['role'],
            'body' => trim($data['body']),
            'modality' => 'voice',
            'meta' => ['transcript' => true],
            'sent_at' => now(),
        ];
        // Retrying an upload after a dropped connection must not duplicate spoken turns.
        $message = filled($data['item_id'] ?? null)
            ? Message::firstOrCreate([
                'conversation_id' => $conversation->id,
                'realtime_item_id' => $data['item_id'],
            ], $attributes)
            : Message::create($attributes);

        if ($conversation->last_message_at === null || $message->sent_at->greaterThan($conversation->last_message_at)) {
            $conversation->update(['last_message_at' => $message->sent_at]);
        }

        if ($message->wasRecentlyCreated && ($attempt = $conversation->attempt) && $attempt->status !== 'active') {
            $attempt->increment('evaluation_revision');
            $attempt->update(['status'=>'evaluating','report'=>null]);
            \App\Jobs\EvaluatePractice::dispatch($attempt->id,$attempt->evaluation_revision)->onConnection(config('practice.evaluation_connection'))->delay(now()->addSeconds(2));
        }

        return ApiResponse::ok($message, 'Transcript saved.', [], 201);
    }

    /**
     * A key for one spoken session, cut for the skill the thread is in.
     *
     * Voice does not go through OpenRouter — a realtime model is not something it lets a caller
     * select — so this is the one place the app talks to OpenAI, and it only ever receives the
     * ephemeral key.
     */
    public function store(Request $request, OpenAiRealtimeClient $openai): JsonResponse
    {
        $data = $request->validate([
            'conversation_id' => ['required', 'integer', 'exists:conversations,id'],
        ]);

        $conversation = Conversation::with('skill')->findOrFail($data['conversation_id']);
        abort_if($conversation->attempt && $conversation->attempt->status !== 'active', 409, 'This exercise has ended.');
        $skill = $conversation->skill;

        if (! $skill?->supports_voice) {
            return ApiResponse::fail(
                'This skill does not accept voice.',
                ['modality' => [sprintf('The skill %s does not accept voice.', $skill?->key)]],
            );
        }

        if (! $openai->configured()) {
            return ApiResponse::fail('Voice is not configured.', ['key' => ['OPENAI_API_KEY is not set.']], 503);
        }

        try {
            $history = $conversation->messages()->whereIn('role', ['user', 'assistant'])
                ->get(['id', 'role', 'body'])->toArray();
            $opens = $skill->opens_conversation && count($history) === 0;
            $instructions = app(MarkInstructions::class)->for($conversation, voice: true);
            $instructions .= "\n\n".($opens
                ? ($conversation->attempt ? 'Begin the authored practice encounter with its brief and visible facts. Do not reveal hidden facts.' : (string) $skill->opening_prompt)
                : 'Nastavljaš isti razgovor. Prethodne poruke će biti učitane prije nego čuješ korisnika. Ne predstavljaj se ponovo i ne započinji novi slučaj. Čekaj sljedeću poruku.');

            $secret = $openai->mint(
                $instructions,
                $conversation->voice,
                $conversation->context,
                $skill->reply_modality === 'text',
                $conversation->attempt ? \App\Services\Practice::tools() : [],
            );
            $secret['history'] = $history;
            $secret['opens_conversation'] = $opens;
        } catch (\Throwable $e) {
            return ApiResponse::fail('Could not start a voice session.', ['openai' => [$e->getMessage()]], 502);
        }

        return ApiResponse::ok($secret, 'Voice session ready.', [
            'conversation_id' => $conversation->id,
            'skill' => $skill->key,
            'opens_conversation' => $opens,
        ]);
    }

    /**
     * A key for a session that only listens, for the words appearing in the composer while a
     * voice message is still being spoken.
     *
     * Unlike `store` this does not need a thread and does not care what the skill is: nothing is
     * being answered, so there is no persona to load and no modality to refuse. A conversation
     * id, when there is one, only lends its case to the transcriber's prompt — a patient whose
     * complaint is already known is a patient whose terms come back spelled correctly.
     */
    public function transcription(Request $request, OpenAiRealtimeClient $openai): JsonResponse
    {
        $data = $request->validate([
            'conversation_id' => ['nullable', 'integer', 'exists:conversations,id'],
        ]);

        if (! $openai->configured()) {
            return ApiResponse::fail('Voice is not configured.', ['key' => ['OPENAI_API_KEY is not set.']], 503);
        }

        $context = isset($data['conversation_id'])
            ? Conversation::find($data['conversation_id'])?->context
            : null;

        try {
            $secret = $openai->mintTranscription($context);
        } catch (\Throwable $e) {
            return ApiResponse::fail('Could not start a transcription session.', ['openai' => [$e->getMessage()]], 502);
        }

        return ApiResponse::ok($secret, 'Transcription session ready.');
    }
}
