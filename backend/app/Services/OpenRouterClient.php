<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * One call to OpenRouter's chat completions, and nothing else.
 *
 * Kept separate from NinaResponder so the thing that decides WHAT to say is not also the thing
 * that knows how to speak HTTP — swapping providers later touches this file only.
 */
class OpenRouterClient
{
    public function configured(): bool
    {
        return filled(config('services.openrouter.key'));
    }

    public function model(): string
    {
        return (string) config('services.openrouter.model');
    }

    /**
     * @param list<array{role: string, content: string}> $messages
     * @return array{content: string, usage: array<string, mixed>, latency_ms: int}
     *
     * @throws \RuntimeException when the call fails or comes back without a reply
     */
    public function chat(array $messages, ?string $preferred = null): array
    {
        $models = array_values(array_unique(array_filter([
            $preferred,
            $this->model(),
            (string) config('services.openrouter.fallback_model'),
        ])));

        $last = null;

        foreach ($models as $model) {
            try {
                return $this->call($model, $messages);
            } catch (RuntimeException $e) {
                // A dead slug or a rate limit on the primary should cost a retry, not the turn.
                $last = $e;
            }
        }

        throw $last ?? new RuntimeException('No OpenRouter model configured.');
    }

    /**
     * @param list<array{role: string, content: string}> $messages
     * @return array{content: string, model: string, usage: array<string, mixed>, latency_ms: int}
     */
    private function call(string $model, array $messages): array
    {
        $started = microtime(true);

        $response = Http::withToken((string) config('services.openrouter.key'))
            ->timeout((int) config('services.openrouter.timeout'))
            ->withHeaders([
                // OpenRouter attributes usage to these; they are not credentials.
                'HTTP-Referer' => (string) config('app.url'),
                'X-Title' => (string) config('app.name'),
            ])
            ->acceptJson()
            ->post(rtrim((string) config('services.openrouter.base_url'), '/').'/chat/completions', [
                'model' => $model,
                'messages' => $messages,
            ]);

        $latency = (int) round((microtime(true) - $started) * 1000);

        if ($response->failed()) {
            // The body carries the useful part — a bad model slug, no credit, a rate limit —
            // and the status alone never says which.
            $reason = $response->json('error.message') ?? $response->body();
            Log::warning('OpenRouter call failed', ['status' => $response->status(), 'reason' => $reason]);

            throw new \RuntimeException("OpenRouter {$response->status()}: {$reason}");
        }

        $content = $response->json('choices.0.message.content');

        if (! is_string($content) || trim($content) === '') {
            throw new \RuntimeException('OpenRouter returned no content.');
        }

        return [
            'content' => trim($content),
            'model' => $model,
            'usage' => (array) ($response->json('usage') ?? []),
            'latency_ms' => $latency,
        ];
    }
}
