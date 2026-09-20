<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/** One thread with Mark, fixed to the skill it was opened in. */
class Conversation extends Model
{
    protected $fillable = ['mark_skill_id', 'modality', 'voice', 'context', 'title', 'last_message_at'];

    protected function casts(): array
    {
        return ['last_message_at' => 'datetime'];
    }

    public function skill(): BelongsTo
    {
        return $this->belongsTo(MarkSkill::class, 'mark_skill_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class)->orderBy('sent_at')->orderBy('id');
    }
}
