<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Who the patient sounds like, and how they speak.
 *
 * A 58-year-old man answering in a woman's voice breaks the case before a word of it lands, so the
 * voice is resolved when the thread is opened — from the sex the setup screen already asks for —
 * and stored, rather than read from one global setting at call time.
 *
 * How they speak is a property of the skill: a patient hesitates and trails off, a dictaphone
 * never should. That belongs in configuration next to the rest of the skill's character.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->string('voice', 32)->nullable()->after('modality');
        });

        Schema::table('nina_skills', function (Blueprint $table) {
            /** Appended to the spoken instructions only. The written path never sees it. */
            $table->text('voice_style')->nullable()->after('turn_reminder');
        });

        DB::table('nina_skills')->where('key', 'patient_simulator')->update([
            'voice_style' => trim(<<<'TXT'
            KAKO GOVORIŠ NAGLAS:
            Govori kao običan čovjek kojem nije dobro, ne kao spiker.
            Zastani prije nego odgovoriš na nešto teško. Koristi "ovaj", "pa", "hmm",
            "ne znam kako da kažem". Počni rečenicu pa je prepravi: "boli me tu, ovaj,
            više ispod rebara". Ponekad odgovori samo "aha" ili "da".
            Kratke rečenice. Nikad nabrajanje, nikad lista.
            Ako te nešto boli dok pričaš, neka se to čuje — uzdahni, uspori.
            Nikad ne zvuči uglađeno ni uvježbano.
            TXT),
            'updated_at' => now(),
        ]);

        DB::table('nina_skills')->where('key', 'consultant')->update([
            'voice_style' => 'Govori mirno i sabrano, kao kolega preko telefona. '
                .'Kratke rečenice, bez nabrajanja naglas — reci jednu po jednu stvar.',
            'updated_at' => now(),
        ]);

        DB::table('nina_skills')->where('key', 'dictaphone')->update([
            'voice_style' => 'Govori minimalno. Potvrdi da si zapisala i stani. Bez oklijevanja i bez ćaskanja.',
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::table('conversations', fn (Blueprint $table) => $table->dropColumn('voice'));
        Schema::table('nina_skills', fn (Blueprint $table) => $table->dropColumn('voice_style'));
    }
};
