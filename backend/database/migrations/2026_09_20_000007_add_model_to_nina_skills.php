<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * A model per skill, where the default is not up to the job.
 *
 * Holding a role is not the same task as answering a question. `gemini-2.5-flash` answers the
 * consultant's questions well and is cheap, but it will not stay a patient: given a vague turn it
 * reaches for the clinician voice and starts interviewing the student, and neither rewriting the
 * system prompt nor repeating the role after every turn stopped it.
 *
 * Null means the configured default. Only the skills that need more say so.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('nina_skills', function (Blueprint $table) {
            $table->string('model')->nullable()->after('turn_reminder');
        });

        DB::table('nina_skills')->where('key', 'patient_simulator')->update([
            'model' => 'google/gemini-2.5-pro',
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::table('nina_skills', fn (Blueprint $table) => $table->dropColumn('model'));
    }
};
