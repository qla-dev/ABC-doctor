<?php

namespace Tests\Feature;

use App\Filament\Resources\WorkflowResource\Pages\ManageRecords;
use App\Jobs\EvaluatePractice;
use App\Models\Conversation;
use App\Models\MarkSkill;
use App\Models\PracticeAttempt;
use App\Models\ScenarioCase;
use App\Models\User;
use App\Models\Workflow;
use App\Services\Practice;
use App\Services\PracticeAi;
use App\Services\StarterWorkflows;
use Filament\Facades\Filament;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Livewire\Livewire;
use Tests\TestCase;

class PracticeTest extends TestCase
{
    protected User $doctor;

    protected function setUp(): void
    {
        parent::setUp();
        if (DB::connection()->getDriverName() !== 'sqlite' || DB::connection()->getDatabaseName() !== ':memory:') {
            throw new \RuntimeException('Only in-memory SQLite tests allowed.');
        }
        $this->artisan('migrate', ['--no-interaction' => true])->assertSuccessful();
        Http::preventStrayRequests();
        $this->doctor = User::factory()->create();
        app(StarterWorkflows::class)->import();
        foreach (Workflow::all() as $w) {
            app(Practice::class)->publish($w);
        }
        foreach (ScenarioCase::all() as $c) {
            app(Practice::class)->publish($c);
        }
    }

    private function start(): array
    {
        return $this->actingAs($this->doctor, 'sanctum')->postJson('/api/practice/start', [])->assertCreated()->json('data');
    }

    public function test_login_and_owner_access_and_hidden_case(): void
    {
        $this->getJson('/api/practice/workflows')->assertUnauthorized();
        $this->get('/api/practice/workflows')->assertUnauthorized();
        $this->postJson('/api/auth/login', ['email' => $this->doctor->email, 'password' => 'wrong'])->assertUnprocessable();
        $login = $this->postJson('/api/auth/login', ['email' => $this->doctor->email, 'password' => 'password'])->assertOk()->json('data');
        $this->assertNotEmpty($login['token']);
        $c = $this->start();
        $this->assertTrue($c['is_practice']);
        $this->assertArrayNotHasKey('snapshot', $c);
        $this->assertNull($c['patient']);
        $this->getJson('/api/practice/'.$c['id'])->assertOk()->assertJsonMissingPath('data.snapshot');
        $this->actingAs(User::factory()->create(), 'sanctum');
        foreach (['/api/conversations/', '/api/practice/'] as $p) {
            $this->getJson($p.$c['id'])->assertNotFound();
        }
        $this->postJson('/api/mark/realtime/session', ['conversation_id' => $c['id']])->assertNotFound();
        $this->postJson('/api/mark/realtime/transcript', ['conversation_id' => $c['id'], 'role' => 'user', 'body' => 'stolen'])->assertNotFound();
        $this->getJson('/api/conversations')->assertJsonCount(0, 'data');
    }

    public function test_selection_preferences_and_publication_are_stable(): void
    {
        $this->actingAs($this->doctor, 'sanctum');
        $ids = Workflow::pluck('id')->all();
        $this->putJson('/api/practice/preferences', ['disabled' => $ids])->assertOk();
        $this->postJson('/api/practice/start', [])->assertUnprocessable();
        $this->putJson('/api/practice/preferences', ['disabled' => array_slice($ids, 1)])->assertOk();
        $c = $this->postJson('/api/practice/start', [])->assertCreated()->json('data');
        $a = PracticeAttempt::where('conversation_id', $c['id'])->firstOrFail();
        $this->assertEquals($ids[0], $a->workflow_id);
        $snapshot = $a->snapshot;
        $w = Workflow::find($ids[0]);
        $w->update(['name' => 'Edited draft']);
        $this->getJson('/api/practice/workflows')->assertJsonPath('data.0.name', $snapshot['workflow']['name']);
        app(Practice::class)->publish($w);
        $this->assertSame($snapshot, $a->fresh()->snapshot);
        $w->update(['archived' => true]);
        $this->postJson('/api/practice/start', [])->assertUnprocessable();
    }

    public function test_events_finish_and_retries(): void
    {
        Queue::fake();
        $c = $this->start();
        $url = '/api/practice/'.$c['id'];
        $data = ['event_key' => 'call_1', 'kind' => 'stage', 'stage' => 'Invented', 'description' => 'advance'];
        $this->postJson($url.'/events', $data)->assertUnprocessable();
        $data = ['event_key' => 'call_1', 'kind' => 'action', 'description' => 'Ask about allergies'];
        $this->postJson($url.'/events', $data)->assertOk();
        $this->postJson($url.'/events', $data)->assertOk();
        $a = PracticeAttempt::where('conversation_id', $c['id'])->first();
        $this->assertSame(1, $a->events()->count());
        $this->postJson($url.'/finish')->assertOk();
        $this->postJson($url.'/finish')->assertOk();
        Queue::assertPushed(EvaluatePractice::class, 1);
        Queue::assertPushed(EvaluatePractice::class, fn ($job) => $job->connection === 'sync');
        $this->postJson('/api/mark/realtime/session', ['conversation_id' => $c['id']])->assertStatus(409);
        $this->postJson('/api/mark/realtime/transcript', ['conversation_id' => $c['id'], 'role' => 'user', 'body' => 'late final turn', 'item_id' => 'late_1'])->assertCreated();
        Queue::assertPushed(EvaluatePractice::class, 2);
        $this->assertSame(2, $a->fresh()->evaluation_revision);
    }

    public function test_evaluation_requires_evidence_and_scores_only_authored_criteria(): void
    {
        $c = $this->start();
        $a = PracticeAttempt::where('conversation_id', $c['id'])->first();
        $msg = $a->conversation->messages()->create(['role' => 'user', 'body' => 'Do you have allergies?', 'modality' => 'voice', 'sent_at' => now()]);
        $criteria = array_merge($a->snapshot['workflow']['criteria'], $a->snapshot['case']['criteria']);
        $results = [];
        foreach ($criteria as $i => $criterion) {
            $results[] = ['index' => $i, 'status' => 'met', 'feedback' => 'Good question', 'evidence' => [$i === 0 ? $msg->id : 999999]];
        }
        $this->mock(PracticeAi::class, fn ($mock) => $mock->shouldReceive('json')->once()->andReturn(['summary' => 'Review', 'strengths' => [], 'improvements' => [], 'critical_errors' => [], 'provisional' => false, 'criteria' => $results]));
        (new EvaluatePractice($a->id, 0))->handle(app(PracticeAi::class));
        $r = $a->fresh()->report;
        $this->assertTrue($r['provisional']);
        $this->assertEquals(round(100 / count($criteria)), $r['score']);
        $this->assertSame('unclear', $r['criteria'][1]['status']);
    }

    public function test_starter_import_preserves_edits_and_admin_pages_render(): void
    {
        Workflow::first()->update(['name' => 'My edit']);
        app(StarterWorkflows::class)->import();
        $this->assertSame(3, Workflow::count());
        $this->assertSame(9, ScenarioCase::count());
        $this->assertSame('My edit', Workflow::first()->name);
        $this->actingAs($this->doctor)->get('/admin/workflows')->assertForbidden();
        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($admin);
        foreach (['/admin/workflows', '/admin/scenario-cases', '/admin/users', '/admin/practice-preview/'.ScenarioCase::first()->id] as $path) {
            $this->get($path)->assertOk();
        }
    }

    public function test_an_encounter_without_doctor_dialogue_is_not_scored_or_sent_to_ai(): void
    {
        $c = $this->start();
        $a = PracticeAttempt::where('conversation_id', $c['id'])->firstOrFail();
        $this->mock(PracticeAi::class, fn ($mock) => $mock->shouldNotReceive('json'));
        foreach ([false, true] as $hasGreeting) {
            if ($hasGreeting) {
                $a->conversation->messages()->create(['role' => 'assistant', 'body' => 'Hello doctor', 'modality' => 'voice', 'sent_at' => now()]);
            }
            (new EvaluatePractice($a->id, 0))->handle(app(PracticeAi::class));
            $r = $a->fresh()->report;
            $this->assertNull($r['score']);
            $this->assertTrue($r['provisional']);
            $this->assertSame([], $r['critical_errors']);
            $this->assertSame(['unclear'], array_values(array_unique(array_column($r['criteria'], 'status'))));
        }
    }

    public function test_recording_gaps_cannot_be_scored_as_clinical_omissions(): void
    {
        $c = $this->start();
        $a = PracticeAttempt::where('conversation_id', $c['id'])->firstOrFail();
        $a->conversation->messages()->create(['role' => 'user', 'body' => 'Hello, I am your doctor.', 'modality' => 'voice', 'sent_at' => now()]);
        $a->events()->create(['event_key' => 'gap', 'kind' => 'transcript_gap', 'payload' => []]);
        $criteria = array_merge($a->snapshot['workflow']['criteria'], $a->snapshot['case']['criteria']);
        $results = array_map(fn ($i) => ['index' => $i, 'status' => 'missed', 'feedback' => 'No evidence', 'evidence' => []], array_keys($criteria));
        $this->mock(PracticeAi::class, fn ($mock) => $mock->shouldReceive('json')->once()
            ->withArgs(fn ($instructions, $data) => $data['transcript_complete'] === false)
            ->andReturn(['summary' => 'Incomplete recording', 'strengths' => [], 'improvements' => [], 'critical_errors' => [], 'provisional' => false, 'criteria' => $results]));
        (new EvaluatePractice($a->id, 0))->handle(app(PracticeAi::class));
        $r = $a->fresh()->report;
        $this->assertNull($r['score']);
        $this->assertTrue($r['provisional']);
        $this->assertSame(['unclear'], array_values(array_unique(array_column($r['criteria'], 'status'))));
    }

    public function test_voice_prompt_includes_frozen_case_and_tools(): void
    {
        config(['services.openai.key' => 'test']);
        Http::fake(['*realtime/client_secrets' => Http::response(['value' => 'ek_test'])]);
        $c = $this->start();
        $this->postJson('/api/mark/realtime/session', ['conversation_id' => $c['id']])->assertOk();
        Http::assertSent(fn ($r) => str_contains($r['session']['instructions'], 'AUTHORITATIVE CASE') && $r['session']['tools'][0]['name'] === 'record_practice_event');
    }

    public function test_admin_can_create_and_edit_a_workflow_through_filament(): void
    {
        $this->actingAs(User::factory()->create(['is_admin' => true]));
        Filament::setCurrentPanel(Filament::getPanel('admin'));
        Livewire::test(ManageRecords::class)
            ->callAction('create', data: ['name' => 'Simple encounter', 'purpose' => 'Practice listening', 'brief' => 'Meet the patient', 'stages' => [['name' => 'Listen']], 'criteria' => [['text' => 'Listen without interrupting']]])
            ->assertHasNoActionErrors();
        $this->assertDatabaseHas('workflows', ['name' => 'Simple encounter']);
    }

    public function test_unowned_legacy_conversations_are_never_assigned_automatically(): void
    {
        $c = Conversation::create(['mark_skill_id' => MarkSkill::first()->id, 'modality' => 'voice']);
        $this->actingAs($this->doctor, 'sanctum')->getJson('/api/conversations/'.$c->id)->assertNotFound();
        $this->assertNull($c->fresh()->user_id);
    }
}
