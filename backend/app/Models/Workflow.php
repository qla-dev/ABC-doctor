<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Workflow extends Model
{
    protected $fillable = ['starter_key', 'name', 'purpose', 'brief', 'stages', 'criteria', 'advanced', 'archived', 'published'];

    protected $casts = ['stages' => 'array', 'criteria' => 'array', 'published' => 'array', 'archived' => 'boolean'];

    public function cases()
    {
        return $this->hasMany(ScenarioCase::class);
    }
}
