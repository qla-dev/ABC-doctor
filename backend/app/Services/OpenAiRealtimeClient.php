<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Mints a short-lived key the phone can open a realtime voice session with.
 *
 * The account key never leaves the server. What goes to the device is an `ek_…` that expires in
 * about a minute and can do nothing but start the one session it was cut for.
 *
 * `/v1/realtime/sessions` is gone — it answers 404. `/v1/realtime/client_secrets` is the endpoint
 * that mints these now, and it takes the whole session config nested under `session`.
 */
class OpenAiRealtimeClient
{
    public function configured(): bool
    {
        return filled(config('services.openai.key'));
    }

    /**
     * @return array{value: string, expires_at: int, model: string, voice: string}
     *
     * @throws \RuntimeException
     */
    public function mint(?string $instructions = null): array
    {
        $model = (string) config('services.openai.realtime_model');
        $voice = (string) config('services.openai.realtime_voice');

        $session = ['type' => 'realtime', 'model' => $model];

        if (filled($instructions)) {
            $session['instructions'] = $instructions;
        }
        if (filled($voice)) {
            $session['audio'] = ['output' => ['voice' => $voice]];
        }

        $response = Http::withToken((string) config('services.openai.key'))
            ->timeout(20)
            ->acceptJson()
            ->post(rtrim((string) config('services.openai.base_url'), '/').'/realtime/client_secrets', [
                'session' => $session,
            ]);

        if ($response->failed()) {
            $reason = $response->json('error.message') ?? $response->body();
            Log::warning('OpenAI realtime session failed', ['status' => $response->status(), 'reason' => $reason]);

            throw new \RuntimeException("OpenAI {$response->status()}: {$reason}");
        }

        return [
            'value' => (string) $response->json('value'),
            'expires_at' => (int) $response->json('expires_at'),
            'model' => (string) ($response->json('session.model') ?? $model),
            'voice' => $voice,
        ];
    }
}
