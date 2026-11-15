<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScenarioCase extends Model
{
    protected $fillable = ['workflow_id', 'starter_key', 'name', 'story', 'visible', 'discover', 'explanation', 'criteria', 'references', 'archived', 'published'];

    protected $casts = ['criteria' => 'array', 'published' => 'array', 'archived' => 'boolean'];

    public function workflow()
    {
        return $this->belongsTo(Workflow::class);
    }
}
