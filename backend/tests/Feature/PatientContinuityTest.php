<?php

namespace Tests\Feature;

use App\Models\Conversation;
use App\Models\MarkSkill;
use App\Services\PatientCases;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PatientContinuityTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $connection = DB::connection();
        if ($connection->getDriverName() !== 'sqlite' || $connection->getDatabaseName() !== ':memory:') {
            throw new \RuntimeException('Tests require SQLite :memory:. Refusing database writes.');
        }
        // Each test has a new in-memory connection. No reset, wipe, rollback or seed command.
        $this->artisan('migrate', ['--no-interaction' => true])->assertSuccessful();
        $this->actingAs(\App\Models\User::factory()->create(), 'sanctum');
        Http::preventStrayRequests();
        config([
            'services.openai.key' => 'test-key',
            'services.openrouter.key' => 'test-key',
        ]);
        Http::fake([
            '*realtime/client_secrets' => Http::response(['value' => 'ek_test', 'expires_at' => 123456, 'session' => ['model' => 'test-realtime']]),
            '*chat/completions' => Http::response(['choices' => [['message' => ['content' => 'Dobar dan, doktore.']]]]),
        ]);
    }

    private function start(string $modality = 'voice', array $setup = []): array
    {
        return $this->postJson('/api/conversations', [
            'skill' => 'patient_simulator',
            'modality' => $modality,
            'case_setup' => $setup + ['specialty' => 'Cardiology', 'ageBand' => '55-74', 'gender' => 'M', 'difficulty' => 'hard'],
        ])->assertCreated()->json('data');
    }

    public function test_case_is_saved_once_and_reloaded_without_exposing_the_diagnosis(): void
    {
        $thread = $this->start();
        $conversation = Conversation::findOrFail($thread['id']);
        $case = $conversation->patient_case;
        $this->assertSame('ST-Elevation Myocardial Infarction (STEMI)', $case['source']['correctDiagnosis']);
        $this->assertSame('M', $thread['patient']['gender']);
        $this->assertGreaterThanOrEqual(55, $thread['patient']['age']);
        $this->assertLessThanOrEqual(74, $thread['patient']['age']);
        $this->assertArrayNotHasKey('patient_case', $thread);
        $this->assertArrayNotHasKey('correctDiagnosis', $thread['patient']['source']);
        $this->assertSame($case['source']['vitals'], $thread['patient']['source']['vitals']);
        $this->assertSame([], $thread['patient']['source']['investigations']);
        $this->assertSame([], $thread['patient']['source']['physicalExamFindings']);
        for ($i = 0; $i < 3; $i++) {
            $this->getJson('/api/conversations/'.$thread['id'])->assertOk()->assertJsonPath('data.patient', $thread['patient']);
            $this->assertSame($case, $conversation->fresh()->patient_case);
        }
    }

    public function test_voice_case_has_no_independent_text_greeting(): void
    {
        $thread = $this->start();
        $this->assertSame([], $thread['messages']);
        Http::assertNothingSent();
        $this->postJson('/api/mark/realtime/session', ['conversation_id' => $thread['id']])
            ->assertOk()->assertJsonPath('data.history', [])->assertJsonPath('data.opens_conversation', true);
        Http::assertSentCount(1);
    }

    public function test_text_greeting_replies_and_voice_receive_the_same_fixed_case_and_role_reminder(): void
    {
        $thread = $this->start('text');
        $conversation = Conversation::findOrFail($thread['id']);
        $caseJson = json_encode($conversation->patient_case, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $this->postJson('/api/messages', ['conversation_id' => $thread['id'], 'body' => 'Gdje boli?', 'modality' => 'text'])->assertCreated();
        $voice = $this->postJson('/api/mark/realtime/session', ['conversation_id' => $thread['id']])
            ->assertOk()->assertJsonPath('data.opens_conversation', false);
        $this->assertCount(3, $voice->json('data.history'));
        $this->assertSame($thread['messages'][0]['body'], $voice->json('data.history.0.body'));
        $reminder = $conversation->skill->turn_reminder;
        foreach (Http::recorded() as [$request]) {
            $prompt = $request['session']['instructions'] ?? $request['messages'][0]['content'];
            $this->assertStringContainsString($caseJson, $prompt);
            $this->assertStringContainsString($reminder, $prompt);
            $this->assertStringContainsString('Ne izmišljaj nove simptome', $prompt);
        }
        Http::assertSentCount(3);
    }

    public function test_reconnected_calls_restore_transcripts_and_keep_case_and_voice(): void
    {
        $thread = $this->start();
        $first = $this->postJson('/api/mark/realtime/session', ['conversation_id' => $thread['id']])->assertOk()->json('data');
        $case = Conversation::findOrFail($thread['id'])->patient_case;
        foreach ([['user', 'Koliko dugo boli?', 'item_question'], ['assistant', 'Sat i po, bez prestanka.', 'item_answer']] as [$role, $body, $id]) {
            $this->postJson('/api/mark/realtime/transcript', ['conversation_id' => $thread['id'], 'role' => $role, 'body' => $body, 'item_id' => $id])->assertCreated();
        }
        $second = $this->postJson('/api/mark/realtime/session', ['conversation_id' => $thread['id']])
            ->assertOk()->assertJsonPath('data.opens_conversation', false)->json('data');
        $this->assertSame(['Koliko dugo boli?', 'Sat i po, bez prestanka.'], array_column($second['history'], 'body'));
        $this->assertSame(['user', 'assistant'], array_column($second['history'], 'role'));
        $this->assertSame($first['voice'], $second['voice']);
        $this->assertSame($case, Conversation::findOrFail($thread['id'])->patient_case);
        $prompt = Http::recorded()->last()[0]['session']['instructions'];
        $this->assertStringContainsString('Nastavljaš isti razgovor', $prompt);
        $this->assertStringNotContainsString('Progovori prvi', $prompt);
    }

    public function test_retrying_a_transcript_does_not_duplicate_it(): void
    {
        $thread = $this->start();
        $payload = ['conversation_id' => $thread['id'], 'role' => 'assistant', 'body' => 'Sat i po.', 'item_id' => 'item_retry'];
        $first = $this->postJson('/api/mark/realtime/transcript', $payload)->assertCreated()->json('data.id');
        $this->postJson('/api/mark/realtime/transcript', $payload)->assertCreated()->assertJsonPath('data.id', $first);
        $this->assertSame(1, Conversation::findOrFail($thread['id'])->messages()->count());
    }

    public function test_legacy_case_keeps_all_earlier_facts_without_inventing_a_new_case(): void
    {
        $conversation = Conversation::create(['user_id'=>auth('sanctum')->id(),
            'mark_skill_id' => MarkSkill::where('key', 'patient_simulator')->value('id'),
            'modality' => 'voice', 'context' => 'Pacijent: 55-74 godina, muškarac.', 'voice' => 'ash',
        ]);
        for ($i = 0; $i < 55; $i++) {
            $conversation->messages()->create(['role' => $i % 2 ? 'user' : 'assistant', 'body' => $i === 0 ? 'Boli me lijevo koljeno tri dana.' : "Turn {$i}", 'modality' => 'voice', 'sent_at' => now()]);
        }
        $this->postJson('/api/mark/realtime/session', ['conversation_id' => $conversation->id])->assertOk()
            ->assertJsonCount(55, 'data.history')->assertJsonPath('data.history.0.body', 'Boli me lijevo koljeno tri dana.');
        $this->postJson('/api/messages', ['conversation_id' => $conversation->id, 'body' => 'Ponovite.', 'modality' => 'voice'])->assertCreated();
        $messages = Http::recorded()->last()[0]['messages'];
        $this->assertStringContainsString('nema sačuvan dosje', $messages[0]['content']);
        $this->assertStringContainsString('Boli me lijevo koljeno tri dana.', json_encode($messages));
        $this->assertNull($conversation->fresh()->patient_case);
        $this->getJson('/api/conversations/'.$conversation->id)->assertJsonPath('data.patient', null);
    }

    public function test_case_setup_is_validated_and_clients_cannot_supply_a_diagnosis(): void
    {
        $this->postJson('/api/conversations', ['skill' => 'patient_simulator', 'case_setup' => ['specialty' => 'Unknown']])
            ->assertUnprocessable()->assertJsonValidationErrors('case_setup.specialty');
        $this->postJson('/api/conversations', ['skill' => 'patient_simulator', 'case_setup' => ['diagnosis' => 'invented']])
            ->assertUnprocessable();
    }

    public function test_templates_are_adapted_to_the_saved_demographics(): void
    {
        foreach (['M', 'F'] as $gender) {
            foreach (['18-34', '55-74'] as $band) {
                $case = app(PatientCases::class)->create(['specialty' => 'Surgery', 'gender' => $gender, 'ageBand' => $band]);
                $hasMenstrualHistory = in_array('he1', array_column($case['source']['historyClues'], 'id'));
                $this->assertSame($gender === 'F' && $band === '18-34', $hasMenstrualHistory);
                $this->assertStringNotContainsString('Elena', $case['source']['historyOfPresentIllness']);
            }
        }
    }

    public function test_unavailable_text_model_does_not_invent_a_new_symptom(): void
    {
        config(['services.openrouter.key' => null]);
        $thread = $this->start('text', ['specialty' => 'Surgery']);
        $this->assertSame(Conversation::findOrFail($thread['id'])->patient_case['opening_line'], $thread['messages'][0]['body']);
        $this->postJson('/api/messages', ['conversation_id' => $thread['id'], 'body' => 'Gdje boli?'])
            ->assertCreated()->assertJsonPath('data.reply.body', 'Nisam razumio pitanje. Možete li ponoviti?');
        Http::assertNothingSent();
    }

    public function test_other_skills_keep_their_context_without_receiving_a_patient_case(): void
    {
        $thread = $this->postJson('/api/conversations', [
            'skill' => 'consultant', 'modality' => 'voice', 'context' => 'Discuss a practice question.',
        ])->assertCreated()->assertJsonPath('data.patient', null)->json('data');
        $this->postJson('/api/mark/realtime/session', ['conversation_id' => $thread['id']])
            ->assertOk()->assertJsonPath('data.opens_conversation', false);
        $prompt = Http::recorded()->last()[0]['session']['instructions'];
        $this->assertStringContainsString('Discuss a practice question.', $prompt);
        $this->assertStringNotContainsString('TI SI PACIJENT', $prompt);
    }
}
