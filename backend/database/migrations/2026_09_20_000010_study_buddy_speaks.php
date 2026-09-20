<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * The study buddy gets a voice.
 *
 * It was written as a text-only skill, and that was the wrong call: being asked a question out
 * loud and answering out loud is how anyone has ever been quizzed, and it is the mode you can use
 * while walking. Nothing about the skill needed text; only the flag said so.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::table('nina_skills')->where('key', 'study_buddy')->update([
            'supports_voice' => true,
            'voice_style' => 'Pitaj naglas, kratko i jasno, pa stani i čekaj odgovor. '
                .'Ne popunjavaj tišinu dok razmišlja.',
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('nina_skills')->where('key', 'study_buddy')->update([
            'supports_voice' => false,
            'updated_at' => now(),
        ]);
    }
};
