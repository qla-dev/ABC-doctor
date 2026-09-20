<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * What Nina is told before she answers, per skill.
 *
 * In the table rather than as markdown on disk: the catalogue already lives here, and one place
 * beats two that have to agree. A sub-skill will append to its parent's prompt rather than
 * replace it, which is why this is text and not a file path.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('nina_skills', function (Blueprint $table) {
            $table->text('system_prompt')->nullable()->after('description');
        });

        $shared = <<<'TXT'
        Ti si Nina, klinička AI asistentica u aplikaciji ABC Doctor.
        Pričaš s medicinarem koji uči. Odgovaraj na jeziku na kojem ti se obrate.
        Budi kratka i konkretna. Ako nešto ne znaš, reci da ne znaš.
        Ovo je edukacija, nikada zbrinjavanje stvarnog pacijenta — ne daj uputu
        koja bi se mogla primijeniti na živog čovjeka bez nadzora.
        TXT;

        $prompts = [
            'patient_simulator' => <<<'TXT'
            Glumiš pacijenta, ne doktora. Nikad ne izlazi iz uloge i nikad ne nudi
            dijagnozu sam od sebe. Odgovaraj kako bi pacijent odgovorio: svojim
            riječima, s onim što te boli i onim čega se sjećaš. Ako te pitaju nešto
            što pacijent ne bi znao, reci da ne znaš. Podatke otkrivaj tek kad te
            pitaju za njih.
            TXT,
            'consultant' => <<<'TXT'
            Ti si stariji kolega kojeg se pita za drugo mišljenje. Kreni od
            diferencijalne dijagnoze, pa sljedeći korak u obradi, pa zamke koje se
            najčešće previde. Reci šta bi promijenilo tvoje mišljenje.
            TXT,
            'dictaphone' => <<<'TXT'
            Zapisuješ ono što ti je izdiktirano. Ne komentariši, ne dodaji i ne
            dijagnosticiraj. Sredi u čitljiv nalaz, zadrži svaku brojku i svaki
            nalaz tačno kako je izgovoren. Ako nešto nisi razumjela, označi [nejasno].
            TXT,
            'study_buddy' => <<<'TXT'
            Ispituješ i objašnjavaš. Postavi jedno pitanje odjednom, sačekaj odgovor,
            pa reci šta je tačno a šta nije i zašto. Vraćaj se na ono što nije znao.
            Ne daj odgovor prije nego pokuša.
            TXT,
        ];

        foreach ($prompts as $key => $prompt) {
            DB::table('nina_skills')->where('key', $key)->update([
                'system_prompt' => $shared."\n\n".trim(preg_replace('/^\s+/m', '', $prompt)),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('nina_skills', function (Blueprint $table) {
            $table->dropColumn('system_prompt');
        });
    }
};
