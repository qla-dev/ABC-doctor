<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Services\OpenAiRealtimeClient;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NinaRealtimeController extends Controller
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
     * contradictory Nina into the same thread.
     */
    public function transcript(Request $request): JsonResponse
    {
        $data = $request->validate([
            'conversation_id' => ['required', 'integer', 'exists:conversations,id'],
            'role' => ['required', 'string', 'in:user,assistant'],
            'body' => ['required', 'string', 'max:4000'],
        ]);

        $conversation = Conversation::findOrFail($data['conversation_id']);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'role' => $data['role'],
            'body' => trim($data['body']),
            'modality' => 'voice',
            'meta' => ['transcript' => true],
            'sent_at' => now(),
        ]);

        $conversation->update(['last_message_at' => $message->sent_at]);

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
            // The same instructions the written turns run on, so Nina is the same person either
            // way; a skill that opens says so here too, since a spoken patient also speaks first.
            $instructions = trim(implode("\n\n", array_filter([
                (string) $skill->system_prompt,
                filled($conversation->context) ? "Za ovaj razgovor vrijedi: {$conversation->context}" : null,
                // Only the spoken path gets this: hesitation and trailing off read as noise in
                // writing, and as a person out loud.
                (string) $skill->voice_style,
                $skill->opens_conversation ? (string) $skill->opening_prompt : null,
            ])));

            $secret = $openai->mint($instructions, $conversation->voice);
        } catch (\Throwable $e) {
            return ApiResponse::fail('Could not start a voice session.', ['openai' => [$e->getMessage()]], 502);
        }

        return ApiResponse::ok($secret, 'Voice session ready.', [
            'conversation_id' => $conversation->id,
            'skill' => $skill->key,
            'opens_conversation' => $skill->opens_conversation,
        ]);
    }
}
