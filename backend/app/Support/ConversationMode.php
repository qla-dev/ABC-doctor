<?php

namespace App\Support;

use App\Models\MarkSkill;
use Illuminate\Validation\ValidationException;

class ConversationMode
{
    public const RULE = 'in:high_quality_voice,low_quality_voice,speech_text,text_speech,text_text';

    public static function input(string $mode): string
    {
        return in_array($mode, ['text_speech', 'text_text']) ? 'text' : 'voice';
    }

    public static function validate(string $mode, MarkSkill $skill, ?bool $realtime = null): void
    {
        if (! $skill->accepts(self::input($mode)) || ($realtime !== null && ($mode === 'high_quality_voice') !== $realtime)) {
            throw ValidationException::withMessages(['mode' => 'This mode is not compatible with this role or endpoint.']);
        }
    }
}
