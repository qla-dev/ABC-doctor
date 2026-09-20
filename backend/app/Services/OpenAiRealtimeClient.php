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
     * @return array{value: string, expires_at: int, model: string, voice: string, call_url: string}
     *
     * @throws \RuntimeException
     */
    public function mint(?string $instructions = null, ?string $voiceOverride = null, ?string $context = null, bool $silent = false): array
    {
        $model = (string) config('services.openai.realtime_model');
        $voice = $voiceOverride ?: (string) config('services.openai.realtime_voice');

        $session = ['type' => 'realtime', 'model' => $model];

        if ($silent) {
            // Without this the model answers out loud by default, and a sufler that speaks is
            // just a third person in the room.
            $session['output_modalities'] = ['text'];
        }

        if (filled($instructions)) {
            $session['instructions'] = $instructions;
        }
        $session['audio'] = [
            /**
             * Both taken from the Lena session. Noise reduction runs BEFORE the turn detector, so
             * room noise and the speaker bleeding back are less likely to be handed to the
             * transcriber as speech — which is exactly when it invents words nobody said.
             *
             * Transcribing the caller's own turns is what lets a spoken consultation be read back
             * afterwards; without it the doctor's half of the call exists only as audio nobody keeps.
             */
            'input' => [
                /**
                 * far_field, not near_field. Lena's caller holds the phone to their face; a
                 * consultation here runs on the loudspeaker by default, so Nina's own voice comes
                 * back into the microphone. Reduction runs BEFORE the turn detector, and that
                 * bleed reaching the transcriber as "speech" is exactly when it invents a
                 * YouTube sign-off — "welcome to the channel" — out of nothing anyone said.
                 */
                'noise_reduction' => ['type' => (string) config('services.openai.noise_reduction')],
                /**
                 * whisper-1 is the old model and the one that hallucinates on silence. The 4o
                 * transcribers are markedly better at Bosnian and stay quiet when nothing is said.
                 *
                 * No `language` is pinned: forcing one made whisper guess harder at noise, and
                 * these detect it per utterance, which also lets a case be held in English.
                 */
                'transcription' => array_filter([
                    'model' => (string) config('services.openai.transcribe_model'),
                    /**
                     * Pinned, and pinned to a LATIN-SCRIPT code. Left to detect, it hears our
                     * language, decides Serbian, and writes the whole consultation in Cyrillic —
                     * correct words, unusable text.
                     */
                    'language' => (string) config('services.openai.transcribe_language'),
                    /**
                     * The transcriber takes a prompt the way it takes audio: as an example of what
                     * it is about to hear. Medical words spelled out here stop "dispneja" coming
                     * back as something that merely rhymes with it, and the thread's own case
                     * rides along so this patient's complaint is expected rather than guessed.
                     */
                    'prompt' => trim(implode(' ', array_filter([
                        (string) config('services.openai.transcribe_prompt'),
                        $context,
                    ]))),
                ]),
                /**
                 * Semantic turn detection, not plain silence. A VAD that cuts on a gap alone hands
                 * over half-finished utterances, and half an utterance is exactly what comes back
                 * as invented syllables. This one waits until what was said sounds finished.
                 */
                'turn_detection' => ['type' => 'semantic_vad'],
            ],
        ];

        if (filled($voice)) {
            $session['audio']['output'] = ['voice' => $voice];
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

        $resolved = (string) ($response->json('session.model') ?? $model);

        return [
            'value' => (string) $response->json('value'),
            'expires_at' => (int) $response->json('expires_at'),
            'model' => $resolved,
            'voice' => $voice,
            /**
             * Where the client posts its SDP offer. Handed down rather than built on the device:
             * the beta path answers "The Realtime Beta API is no longer supported — use
             * /v1/realtime/calls", and when it moves again this is the one line that changes.
             */
            'call_url' => rtrim((string) config('services.openai.base_url'), '/')
                .'/realtime/calls?model='.urlencode($resolved),
        ];
    }

    /**
     * A key for a session that only listens.
     *
     * The difference from `mint` is the whole point of it: no voice, no model answering, nothing
     * coming back but the words as they are said. It is what puts a transcript in the composer
     * while somebody is still talking, so a voice message can be read before it is sent.
     *
     * Lena does this with the browser's own SpeechRecognition running alongside the recording.
     * A phone has no such engine, and adding one is a native module and a new build — so the
     * preview comes from the same transcriber that produces the final text, over a socket the
     * device opens with this key.
     *
     * @return array{value: string, expires_at: int, model: string, url: string}
     *
     * @throws \RuntimeException
     */
    public function mintTranscription(?string $context = null): array
    {
        $model = (string) config('services.openai.live_transcribe_model');

        $session = [
            'type' => 'transcription',
            'audio' => [
                'input' => [
                    /**
                     * What the phone can actually produce: expo-audio's stream hands over raw
                     * PCM, and 24 kHz mono is both what this endpoint wants and the least of it
                     * worth sending over a mobile connection.
                     */
                    'format' => ['type' => 'audio/pcm', 'rate' => 24000],
                    'noise_reduction' => ['type' => (string) config('services.openai.noise_reduction')],
                    'transcription' => array_filter([
                        'model' => $model,
                        // Same reasoning as the call session: left to detect, it decides Serbian
                        // and writes the whole thing in Cyrillic.
                        'language' => (string) config('services.openai.transcribe_language'),
                        'prompt' => trim(implode(' ', array_filter([
                            (string) config('services.openai.transcribe_prompt'),
                            $context,
                        ]))),
                    ]),
                    /**
                     * Detection stays on, unlike a session that is committed by hand: it is what
                     * makes each finished sentence land as text while the next one is still being
                     * said, which is the entire point of a preview.
                     */
                    'turn_detection' => ['type' => 'semantic_vad'],
                ],
            ],
        ];

        $response = Http::withToken((string) config('services.openai.key'))
            ->timeout(20)
            ->acceptJson()
            ->post(rtrim((string) config('services.openai.base_url'), '/').'/realtime/client_secrets', [
                'session' => $session,
            ]);

        if ($response->failed()) {
            $reason = $response->json('error.message') ?? $response->body();
            Log::warning('OpenAI transcription session failed', [
                'status' => $response->status(),
                'reason' => $reason,
            ]);

            throw new \RuntimeException("OpenAI {$response->status()}: {$reason}");
        }

        return [
            'value' => (string) $response->json('value'),
            'expires_at' => (int) $response->json('expires_at'),
            'model' => (string) ($response->json('session.audio.input.transcription.model') ?? $model),
            /**
             * A socket rather than the SDP exchange the call uses: there is no audio coming back
             * to route, and a phone that is already holding the microphone for its own recorder
             * cannot hand it to WebRTC as well.
             */
            'url' => str_replace(['https://', 'http://'], ['wss://', 'ws://'],
                rtrim((string) config('services.openai.base_url'), '/')).'/realtime?intent=transcription',
        ];
    }
}
