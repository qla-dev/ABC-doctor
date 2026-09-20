<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Services\OpenAiRealtimeClient;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NinaRealtimeController extends Controller
{
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
