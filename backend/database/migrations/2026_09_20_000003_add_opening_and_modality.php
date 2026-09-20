<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Two things a thread needs before its first turn: which way it is going to be spoken, and
 * whether Nina opens it.
 *
 * Both are configuration rather than code. "The patient speaks first" is true of the patient
 * simulator and false of the others today, and that is a property of the skill, not an `if` in a
 * controller that has to be found and edited when a fifth skill wants the same.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('nina_skills', function (Blueprint $table) {
            $table->boolean('opens_conversation')->default(false)->after('supports_voice');
            /** What Nina is told to produce for that first turn. */
            $table->text('opening_prompt')->nullable()->after('system_prompt');
        });

        Schema::table('conversations', function (Blueprint $table) {
            /**
             * Chosen when the thread is opened and fixed for its life. A consultation that began
             * spoken stays spoken; switching mid-thread would leave half the turns unplayable.
             */
            $table->string('modality', 16)->default('text')->after('nina_skill_id');
        });

        DB::table('nina_skills')->where('key', 'patient_simulator')->update([
            'opens_conversation' => true,
            'opening_prompt' => trim(<<<'TXT'
            Otvori razgovor sam, kao pacijent koji je upravo sjeo pred doktora.
            Jednom ili dvije rečenice: zašto si došao, svojim riječima.
            Ne nabrajaj simptome kao listu, ne koristi stručne izraze i ne spominji
            dijagnozu. Čekaj da te doktor pita za ostalo.
            TXT),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::table('conversations', fn (Blueprint $table) => $table->dropColumn('modality'));
        Schema::table('nina_skills', function (Blueprint $table) {
            $table->dropColumn(['opens_conversation', 'opening_prompt']);
        });
    }
};
