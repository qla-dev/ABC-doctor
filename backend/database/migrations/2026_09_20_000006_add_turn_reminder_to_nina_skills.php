<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * A short reminder sent as the LAST thing before each turn.
 *
 * Rewriting the system prompt was not enough. An instruction at the top of a call loses weight as
 * the history grows, and on a vague turn — "Stvarno", "aha" — the model reached for the role it
 * knows best and started interviewing the doctor: "gdje vas točno boli, možete li pokazati". That
 * is the student's job.
 *
 * Instructions nearest the end carry the most weight, so the role is restated there, every turn.
 * Only the skills whose whole point is a role need one; the consultant is already itself.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('nina_skills', function (Blueprint $table) {
            $table->text('turn_reminder')->nullable()->after('opening_prompt');
        });

        $reminders = [
            'patient_simulator' => 'Podsjetnik: ti si pacijent. Odgovori na ono što je doktor rekao, '
                .'svojim riječima i kratko. Ne postavljaj mu pitanja i ne traži od njega da išta '
                .'opiše ili pokaže. Ako ti poruka nije jasna, samo reci da nisi razumio.',
            'dictaphone' => 'Podsjetnik: ti si diktafon. Samo zapiši izgovoreno. Bez pitanja, '
                .'bez komentara, bez dijagnoze.',
            'study_buddy' => 'Podsjetnik: postavi jedno pitanje i stani. Ne odgovaraj umjesto njega.',
        ];

        foreach ($reminders as $key => $reminder) {
            DB::table('nina_skills')->where('key', $key)->update([
                'turn_reminder' => $reminder,
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('nina_skills', fn (Blueprint $table) => $table->dropColumn('turn_reminder'));
    }
};
