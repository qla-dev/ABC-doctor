<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * A recorded turn, turned into words.
 *
 * The counterpart to OpenAiRealtimeClient rather than a second copy of it: that one hands the
 * phone a key and steps out of the way while the call runs peer to peer, so a spoken turn only
 * ever reaches us as text somebody already heard. A voice message is the opposite — nobody has
 * heard it, there is no session, and the audio has to come through the server to become a
 * message at all.
 *
 * What comes out is handled exactly as if it had been typed: the same skills, the same thread,
 * the same reply. Speaking is a way of writing here, not a mode of its own.
 *
 * Adapted from freightbook's LenaTranscription, minus the two-provider dance — that one runs
 * through OpenRouter, which does not let a caller pick a transcription model, so it needs a
 * fallback. We are already talking to OpenAI directly for the realtime key.
 */
class NinaTranscription
{
    public function configured(): bool
    {
        return filled(config('services.openai.key'));
    }

    /**
     * @param  string  $audio  Raw audio bytes — not base64, not a data URI.
     * @param  string  $format The container the phone recorded, as a bare extension: m4a, mp3, …
     *
     * @throws RuntimeException When the provider is unset, unreachable, or answers with nothing.
     */
    public function transcribe(string $audio, string $format): string
    {
        $key = (string) config('services.openai.key');
        if ($key === '') {
            throw new RuntimeException('Transcription is not configured.');
        }

        $url = rtrim((string) config('services.openai.base_url'), '/').'/audio/transcriptions';

        // A filename with the real extension is not decoration: the endpoint decides how to
        // decode the bytes from it, and an m4a sent as `blob` comes back as an unsupported
        // format error.
        $response = Http::withToken($key)
            ->connectTimeout(10)
            ->timeout(60)
            ->attach('file', $audio, 'turn.'.$format)
            ->post($url, array_filter([
                'model' => (string) config('services.openai.transcribe_model'),
                /**
                 * Pinned, unlike the realtime session's transcriber. That one hears one utterance
                 * at a time inside a running conversation and can afford to detect per utterance;
                 * this hears a single recording with no context around it, and an unpinned guess
                 * on a short Bosnian sentence comes back as Slovene often enough to matter.
                 */
                'language' => (string) config('services.openai.transcribe_language'),
                // The vocabulary of the thing being recorded, so the terms come back spelled as
                // terms rather than as the everyday words they sound like.
                'prompt' => (string) config('services.openai.transcribe_prompt'),
                'response_format' => 'json',
                'temperature' => '0',
                // By emptiness, not by truthiness: a plain array_filter drops '0' along with the
                // blanks, and the temperature is the one field whose correct value is falsy.
            ], static fn ($value) => $value !== ''));

        if (! $response->successful()) {
            // The provider's own message can carry the request, and the request carries both the
            // credentials and somebody's voice. The status is all that leaves this class.
            throw new RuntimeException('Transcription failed (HTTP '.$response->status().').');
        }

        $text = trim((string) $response->json('text', ''));
        if ($text === '') {
            throw new RuntimeException('Nothing was heard in that recording.');
        }

        return $text;
    }
}
