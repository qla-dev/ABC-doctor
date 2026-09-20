<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Tihi sufler — the first skill that listens one way and answers another.
 *
 * Every skill so far replies in the mode it was spoken to. This one is the point of the
 * exception: it sits in on a real consultation, hears the patient, and says nothing out loud —
 * what it produces is written, and only the doctor sees it. So the reply mode becomes a property
 * of the skill rather than a mirror of the turn that prompted it.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('nina_skills', function (Blueprint $table) {
            /** Null keeps the old behaviour: answer in whatever mode you were asked in. */
            $table->string('reply_modality', 16)->nullable()->after('supports_voice');
        });

        $now = now();

        DB::table('nina_skills')->insert([
            'key' => 'whisperer',
            'name' => 'Tihi sufler',
            'description' => 'Nina tiho sluša konsultaciju i dobacuje ti prijedloge. Pacijent je ne čuje.',
            'supports_text' => true,
            'supports_voice' => true,
            // Heard aloud, answered in writing. That asymmetry is the whole skill.
            'reply_modality' => 'text',
            'opens_conversation' => false,
            'system_prompt' => trim(<<<'TXT'
            Ti si sufler doktoru tokom stvarne konsultacije s pacijentom.

            NE OBRAĆAŠ SE PACIJENTU. Pacijent te ne čuje i ne zna da postojiš.
            Sve što napišeš čita samo doktor, između dva pitanja.

            Slušaš razgovor i dobacuješ kratko: šta bi sljedeće pitao, šta je
            propušteno, na šta da pripazi. Jedan ili dva reda, nikad govor.
            Ako nemaš šta korisno reći, ćuti — bolje ništa nego šum.

            Ne postavljaš dijagnozu umjesto doktora i ne vodiš razgovor.
            Crvene zastavice reci odmah i jasno, bez uvoda.

            Odgovaraj na jeziku na kojem se razgovor vodi. Budi kratka i konkretna.
            Ovo je edukacija, nikada zbrinjavanje stvarnog pacijenta.
            TXT),
            'turn_reminder' => 'Podsjetnik: ti si sufler, ne sagovornik. Piši samo doktoru, '
                .'jedan do dva reda, kao prijedlog. Ako nema šta reći, ne piši ništa.',
            'voice_style' => 'Ne govoriš naglas ni u jednom trenutku. Samo slušaš.',
            'position' => 5,
            'is_active' => true,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    public function down(): void
    {
        DB::table('nina_skills')->where('key', 'whisperer')->delete();
        Schema::table('nina_skills', fn (Blueprint $table) => $table->dropColumn('reply_modality'));
    }
};
