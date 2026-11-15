<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PracticeAttempt extends Model
{
    protected $fillable = ['conversation_id', 'workflow_id', 'user_id', 'snapshot', 'status', 'report', 'evaluation_revision'];

    protected $casts = ['snapshot' => 'array', 'report' => 'array', 'evaluation_revision' => 'integer'];

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    public function events()
    {
        return $this->hasMany(PracticeEvent::class)->orderBy('id');
    }
}
