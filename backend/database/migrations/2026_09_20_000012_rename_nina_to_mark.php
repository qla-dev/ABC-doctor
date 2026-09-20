<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Nina becomes Mark.
 *
 * The name is in three places and only one of them is code: the table and the column that names
 * it, the prose the skills speak about themselves, and the grammar that prose is written in.
 * Bosnian agrees with gender, so a find-and-replace would leave Mark saying "budi kratka" — the
 * right name in the wrong body. Every feminine form the prompts carried is corrected here beside
 * the name itself.
 *
 * The migrations before this one keep saying `nina_skills`, because that is what they did. A
 * fresh database still creates it under the old name and arrives here to be renamed.
 */
return new class extends Migration
{
    /** What the shared preamble says in every skill, and what it has to say about a man. */
    private const FEMININE = [
        'Budi kratka i konkretna' => 'Budi kratak i konkretan',
        'Ako nešto nisi razumjela' => 'Ako nešto nisi razumio',
        'Ti si Nina, kolegica koja' => 'Ti si Mark, kolega koji',
        'Spremna sam.' => 'Spreman sam.',
        // The whisperer is not heard by the patient, and the patient does not hear HIM now.
        'Pacijent je ne čuje.' => 'Pacijent ga ne čuje.',
    ];

    /**
     * What migration 000005 wrote into study_buddy, restored.
     *
     * The stored prompt is not a prompt: it is the text of a PHP fatal error, pasted over the
     * real one at some point through the skills editor. The skill has been running without any
     * instructions at all. Only a row that still holds that error is touched.
     */
    private const STUDY_BUDDY = <<<'TXT'
    Odgovaraj na jeziku na kojem ti se obrate. Budi kratak i konkretan.
    Ovo je edukacija, nikada zbrinjavanje stvarnog pacijenta.

    Ti si Mark, kolega koji ispituje i objašnjava.
    Postavi jedno pitanje, stani, i čekaj odgovor. Ne piši odgovor umjesto
    njega i ne nastavljaj razgovor sam sa sobom. Kad odgovori, reci šta je
    tačno a šta nije i zašto, pa postavi sljedeće pitanje.
    TXT;

    public function up(): void
    {
        Schema::rename('nina_skills', 'mark_skills');

        Schema::table('conversations', function (Blueprint $table) {
            $table->renameColumn('nina_skill_id', 'mark_skill_id');
        });

        $columns = ['description', 'system_prompt', 'opening_prompt', 'turn_reminder', 'voice_style', 'intro_texts'];

        foreach (DB::table('mark_skills')->get() as $skill) {
            $changes = [];

            foreach ($columns as $column) {
                $before = (string) ($skill->$column ?? '');
                if ($before === '') {
                    continue;
                }

                $after = strtr($before, self::FEMININE);
                // The name last, so the phrases above match the text as it was written.
                $after = preg_replace('/\bNina\b/u', 'Mark', $after);

                if ($after !== $before) {
                    $changes[$column] = $after;
                }
            }

            if ($changes) {
                DB::table('mark_skills')->where('id', $skill->id)->update($changes + ['updated_at' => now()]);
            }
        }

        DB::table('mark_skills')
            ->where('key', 'study_buddy')
            ->where('system_prompt', 'like', 'Fatal error%')
            ->update([
                'system_prompt' => trim(preg_replace('/^\s+/m', '', self::STUDY_BUDDY)),
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->renameColumn('mark_skill_id', 'nina_skill_id');
        });

        Schema::rename('mark_skills', 'nina_skills');

        // The prose is deliberately left as it is. Reversing a rename is about the schema; the
        // words a skill speaks are content, and content that has been edited since is not ours
        // to put back.
    }
};
