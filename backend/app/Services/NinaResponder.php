<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\Message;

/**
 * Nina's side of a turn: assemble what she is told, call the model, persist what she says.
 *
 * When no key is configured — or the call fails — this writes a canned reply instead and records
 * why in `meta`. The app then keeps working on a laptop with no credentials, and a failure reads
 * as a message in the thread rather than a 500 at the client.
 */
class NinaResponder
{
    /** How much of the thread goes back with each turn. */
    private const HISTORY_LIMIT = 30;

    public function __construct(private readonly OpenRouterClient $client) {}

    /**
     * The skill's instructions plus whatever this thread was opened about. A simulator told
     * "58, male, cardiology, hard" plays that patient; one told nothing invents its own.
     */
    private function instructions(Conversation $conversation): string
    {
        $skill = $conversation->skill;
        $parts = array_filter([
            (string) $skill?->system_prompt,
            filled($conversation->context) ? "Za ovaj razgovor vrijedi: {$conversation->context}" : null,
            // Last line of the one system instruction, where it outweighs the history above it.
            filled($skill?->turn_reminder) ? "OBAVEZNO PRAVILO: {$skill->turn_reminder}" : null,
        ]);

        return trim(implode("\n\n", $parts));
    }

    /**
     * The first turn, when the skill says Nina opens. The instruction that produces it is sent
     * but never persisted — it is stage direction, not something the doctor said.
     */
    public function open(Conversation $conversation): ?Message
    {
        $skill = $conversation->skill;

        if (! $skill?->opens_conversation) {
            return null;
        }

        if (! $this->client->configured()) {
            return $this->persist($conversation, 'Dobar dan, doktore.', $conversation->modality, [
                'stub' => true,
                'reason' => 'OPENROUTER_API_KEY is not set.',
                'opening' => true,
            ]);
        }

        try {
            $result = $this->client->chat([
                ['role' => 'system', 'content' => $this->instructions($conversation)],
                ['role' => 'user', 'content' => (string) $skill->opening_prompt],
            ], $skill->model);

            return $this->persist($conversation, $result['content'], $conversation->modality, [
                'model' => $result['model'],
                'usage' => $result['usage'],
                'latency_ms' => $result['latency_ms'],
                'opening' => true,
            ]);
        } catch (\Throwable $e) {
            return $this->persist($conversation, 'Dobar dan, doktore.', $conversation->modality, [
                'stub' => true,
                'reason' => $e->getMessage(),
                'opening' => true,
            ]);
        }
    }

    public function reply(Conversation $conversation, Message $incoming): Message
    {
        $skill = $conversation->skill;

        if (! $this->client->configured()) {
            return $this->write($conversation, $this->canned($skill?->key, $incoming), $incoming, [
                'stub' => true,
                'reason' => 'OPENROUTER_API_KEY is not set.',
            ]);
        }

        try {
            $result = $this->client->chat(
                $this->messages($conversation, $this->instructions($conversation)),
                $conversation->skill?->model,
            );

            return $this->write($conversation, $result['content'], $incoming, [
                'model' => $result['model'],
                'usage' => $result['usage'],
                'latency_ms' => $result['latency_ms'],
            ]);
        } catch (\Throwable $e) {
            return $this->write($conversation, $this->canned($skill?->key, $incoming), $incoming, [
                'stub' => true,
                'reason' => $e->getMessage(),
            ]);
        }
    }

    /**
     * The system prompt, then the thread in order. The incoming turn is already persisted, so it
     * arrives as the last of the history rather than being appended twice.
     *
     * @return list<array{role: string, content: string}>
     */
    private function messages(Conversation $conversation, ?string $systemPrompt): array
    {
        $messages = [];

        if (filled($systemPrompt)) {
            $messages[] = ['role' => 'system', 'content' => $systemPrompt];
        }

        /**
         * The stage direction that produced the opening, replayed as the first user turn.
         *
         * Not cosmetic: a thread where Nina speaks first starts with an assistant message, and a
         * payload whose history begins with one is not something Gemini accepts — the turn is
         * dropped in translation, taking with it the only example of Nina being the patient. The
         * model then reaches for the clinician voice and starts interviewing the student.
         *
         * Sending this first makes the shape identical to `open()`, which never drifted.
         */
        if (filled($conversation->skill?->opening_prompt)) {
            $messages[] = ['role' => 'user', 'content' => (string) $conversation->skill->opening_prompt];
        }

        $history = $conversation->messages()
            ->whereIn('role', [Message::ROLE_USER, Message::ROLE_ASSISTANT])
            ->get()
            ->slice(-self::HISTORY_LIMIT);

        foreach ($history as $message) {
            $last = count($messages) - 1;

            if ($last >= 0 && $messages[$last]['role'] === $message->role) {
                $messages[$last]['content'] .= "\n".$message->body;

                continue;
            }

            $messages[] = ['role' => $message->role, 'content' => $message->body];
        }

        return $messages;
    }

    /** @param array<string, mixed> $meta */
    private function write(Conversation $conversation, string $body, Message $incoming, array $meta): Message
    {
        $skill = $conversation->skill;
        // She answers in the mode she was spoken to, where the skill allows it.
        $modality = $skill && $skill->accepts($incoming->modality) ? $incoming->modality : 'text';

        return $this->persist($conversation, $body, $modality, $meta);
    }

    /** @param array<string, mixed> $meta */
    private function persist(Conversation $conversation, string $body, string $modality, array $meta): Message
    {
        return Message::create([
            'conversation_id' => $conversation->id,
            'role' => Message::ROLE_ASSISTANT,
            'body' => $body,
            'modality' => $modality,
            'meta' => $meta + ['skill' => $conversation->skill?->key],
            'sent_at' => now(),
        ]);
    }

    private function canned(?string $skillKey, Message $incoming): string
    {
        $heard = trim($incoming->body);

        return match ($skillKey) {
            'patient_simulator' => "(pacijent) Čuo sam vas: \"{$heard}\". Boli me otkad sam se jutros probudio.",
            'consultant' => "Na osnovu \"{$heard}\" — prvo razmisli o diferencijalnoj, pa o sljedećem koraku.",
            'dictaphone' => "Zapisano: {$heard}",
            'study_buddy' => "Pitanje na osnovu \"{$heard}\": koji je prvi korak u zbrinjavanju?",
            default => "Primila sam: {$heard}",
        };
    }
}
