<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\Message;

/**
 * Nina's side of a turn.
 *
 * NO MODEL IS CALLED HERE YET. This writes a deterministic reply shaped exactly like the real one
 * — same row, same columns, same `meta` — so the clients and the protocol can be finished and
 * tested before a provider is chosen. Swapping in a real call means replacing `compose()` and
 * filling `meta`; nothing above this class has to change.
 */
class NinaResponder
{
    public function reply(Conversation $conversation, Message $incoming): Message
    {
        $skill = $conversation->skill;

        return Message::create([
            'conversation_id' => $conversation->id,
            'role' => Message::ROLE_ASSISTANT,
            'body' => $this->compose($skill?->key, $incoming),
            // Nina answers in the mode she was spoken to, where the skill allows it.
            'modality' => $skill && $skill->accepts($incoming->modality) ? $incoming->modality : 'text',
            'meta' => ['stub' => true, 'skill' => $skill?->key],
            'sent_at' => now(),
        ]);
    }

    private function compose(?string $skillKey, Message $incoming): string
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
