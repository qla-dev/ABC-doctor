<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PracticeEvent extends Model
{
    protected $fillable = ['practice_attempt_id', 'event_key', 'kind', 'payload'];

    protected $casts = ['payload' => 'array'];
}
