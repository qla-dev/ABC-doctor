<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * One thing Mark can be asked to be. Sub-skills nest through `parent_id`, the way Lena's do,
 * though nothing creates one yet.
 */
class MarkSkill extends Model
{
    protected $fillable = [
        'parent_id', 'key', 'name', 'description', 'intro_texts', 'system_prompt',
        'supports_text', 'supports_voice', 'reply_modality', 'opens_conversation',
        'opening_prompt', 'turn_reminder', 'voice_style', 'model', 'position', 'is_active',
    ];

    /**
     * What Mark is told is the server's business. The catalogue endpoint is public to every
     * client, and a system prompt handed out there is a system prompt anyone can work around.
     */
    protected $hidden = ['system_prompt', 'opening_prompt', 'turn_reminder', 'voice_style'];

    protected function casts(): array
    {
        return [
            'supports_text' => 'boolean',
            'supports_voice' => 'boolean',
            'opens_conversation' => 'boolean',
            'intro_texts' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('position');
    }

    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class);
    }

    /** Whether this skill will take a turn spoken that way. */
    public function accepts(string $modality): bool
    {
        return match ($modality) {
            'text' => $this->supports_text,
            'voice' => $this->supports_voice,
            default => false,
        };
    }
}
