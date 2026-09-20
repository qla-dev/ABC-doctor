<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * What an empty thread says before anyone has spoken.
 *
 * Several per skill, picked at random. Lena's call greeting is deliberately fixed — a signature
 * that changes every call is not a signature — but this is not a signature. It is the line on an
 * empty screen inviting you to start, and the same sentence every time is how a screen begins to
 * feel dead.
 *
 * Keyed by language, not a flat list. The app ships in bs, en and de, and copy that lives in the
 * database rather than the locale files would otherwise be the one string that ignores the
 * language everything around it respects. The client picks its own and falls back to `bs`.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('nina_skills', function (Blueprint $table) {
            $table->json('intro_texts')->nullable()->after('description');
        });

        $intros = [
            'patient_simulator' => [
                'bs' => [
                    'Pacijent je u čekaonici. Kad budeš spreman.',
                    'Novi slučaj čeka. Počni kako bi počeo i u ambulanti.',
                    'Neko sjedi pred tobom i ne zna šta mu je. Ti saznaj.',
                ],
                'en' => [
                    'A patient is waiting. Whenever you are ready.',
                    'A new case is up. Start the way you would in clinic.',
                    'Someone is sitting in front of you and does not know what is wrong.',
                ],
                'de' => [
                    'Ein Patient wartet. Wann immer Sie bereit sind.',
                    'Ein neuer Fall. Beginnen Sie wie in der Sprechstunde.',
                    'Jemand sitzt vor Ihnen und weiß nicht, was ihm fehlt.',
                ],
            ],
            'consultant' => [
                'bs' => [
                    'Ispričaj mi slučaj. Krećemo od diferencijalne.',
                    'Šta te muči? Reci naglas, često se tu i vidi odgovor.',
                    'Drugo mišljenje, bez ustezanja. Pitaj.',
                ],
                'en' => [
                    'Tell me the case. We start with the differential.',
                    'What is bothering you? Say it out loud — that is often where it shows.',
                    'A second opinion, no hedging. Ask.',
                ],
                'de' => [
                    'Schildern Sie den Fall. Wir beginnen mit der Differentialdiagnose.',
                    'Was beschäftigt Sie? Sagen Sie es laut — oft zeigt es sich dabei.',
                    'Eine zweite Meinung, ohne Umschweife. Fragen Sie.',
                ],
            ],
            'dictaphone' => [
                'bs' => [
                    'Diktiraj nalaz. Zapisujem i sređujem.',
                    'Slušam. Govori kako ti dolazi, ja ću posložiti.',
                    'Spremna sam. Brojke i nalaze reci polako.',
                ],
                'en' => [
                    'Dictate the findings. I write them down and tidy them up.',
                    'Listening. Say it as it comes, I will arrange it.',
                    'Ready. Say the numbers and findings slowly.',
                ],
                'de' => [
                    'Diktieren Sie den Befund. Ich schreibe mit und ordne.',
                    'Ich höre zu. Sprechen Sie frei, ich bringe es in Form.',
                    'Bereit. Zahlen und Befunde bitte langsam.',
                ],
            ],
            'study_buddy' => [
                'bs' => [
                    'Reci temu, pa da krenemo s pitanjima.',
                    'Šta učiš danas? Ispitat ću te.',
                    'Biraj oblast. Idemo jedno po jedno pitanje.',
                ],
                'en' => [
                    'Name a topic and we will start asking.',
                    'What are you studying today? I will quiz you.',
                    'Pick a field. One question at a time.',
                ],
                'de' => [
                    'Nennen Sie ein Thema, dann fangen wir an.',
                    'Was lernen Sie heute? Ich frage Sie ab.',
                    'Wählen Sie ein Fach. Eine Frage nach der anderen.',
                ],
            ],
            'whisperer' => [
                'bs' => [
                    'Slušam konsultaciju. Javljam se samo kad ima šta reći.',
                    'Tu sam sa strane. Pacijent me ne čuje.',
                    'Vodi ti razgovor, ja pazim šta je propušteno.',
                ],
                'en' => [
                    'Listening in. I speak up only when there is something to say.',
                    'I am here on the side. The patient cannot hear me.',
                    'You lead the conversation; I watch for what is missed.',
                ],
                'de' => [
                    'Ich höre mit. Ich melde mich nur, wenn es etwas zu sagen gibt.',
                    'Ich bin im Hintergrund. Der Patient hört mich nicht.',
                    'Führen Sie das Gespräch, ich achte auf Ausgelassenes.',
                ],
            ],
        ];

        foreach ($intros as $key => $byLanguage) {
            DB::table('nina_skills')->where('key', $key)->update([
                'intro_texts' => json_encode($byLanguage, JSON_UNESCAPED_UNICODE),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('nina_skills', fn (Blueprint $table) => $table->dropColumn('intro_texts'));
    }
};
