<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Arr;

/** One thread with Mark, fixed to the skill it was opened in. */
class Conversation extends Model
{
    protected $fillable = ['user_id', 'mark_skill_id', 'modality', 'voice', 'context', 'patient_case', 'title', 'last_message_at'];

    protected $hidden = ['patient_case'];

    protected $appends = ['patient', 'is_practice'];

    public function getIsPracticeAttribute(): bool { return $this->attempt()->exists(); }

    protected function casts(): array
    {
        return ['last_message_at' => 'datetime', 'patient_case' => 'array'];
    }

    /** Presentation data only; the hidden diagnosis and history belong in the model's prompt. */
    public function getPatientAttribute(): ?array
    {
        $case = $this->patient_case;
        if (! $case) {
            return null;
        }

        return Arr::only($case, ['name', 'age', 'gender', 'specialty', 'difficulty']) + [
            'source' => Arr::only($case['source'] ?? [], ['vitals', 'physicalExamFindings', 'investigations']),
        ];
    }

    public function attempt() { return $this->hasOne(PracticeAttempt::class); }

    public function skill(): BelongsTo
    {
        return $this->belongsTo(MarkSkill::class, 'mark_skill_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class)->orderBy('sent_at')->orderBy('id');
    }
}
