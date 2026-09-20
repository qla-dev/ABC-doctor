<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** One turn in a thread. `role` is who spoke, `modality` is how. */
class Message extends Model
{
    public const ROLE_USER = 'user';
    public const ROLE_ASSISTANT = 'assistant';

    protected $fillable = ['conversation_id', 'role', 'body', 'modality', 'meta', 'sent_at'];

    protected function casts(): array
    {
        return ['meta' => 'array', 'sent_at' => 'datetime'];
    }

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }
}
