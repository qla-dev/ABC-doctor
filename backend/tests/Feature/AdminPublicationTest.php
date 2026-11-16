<?php

namespace Tests\Feature;

use App\Filament\Resources\ScenarioCaseResource\Pages\ManageRecords as ManageCases;
use App\Filament\Resources\WorkflowResource\Pages\ManageRecords as ManageWorkflows;
use App\Models\ScenarioCase;
use App\Models\User;
use App\Models\Workflow;
use App\Services\Practice;
use Filament\Facades\Filament;
use Illuminate\Support\Facades\DB;
use Livewire\Livewire;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class AdminPublicationTest extends TestCase
{
    protected Workflow $workflow;

    protected ScenarioCase $case;

    protected function setUp(): void
    {
        parent::setUp();

        if (DB::connection()->getDriverName() !== 'sqlite' || DB::connection()->getDatabaseName() !== ':memory:') {
            throw new \RuntimeException('Only in-memory SQLite tests allowed.');
        }

        $this->artisan('migrate', ['--no-interaction' => true])->assertSuccessful();
        $this->actingAs(User::factory()->create(['is_admin' => true]));
        Filament::setCurrentPanel(Filament::getPanel('admin'));

        $this->workflow = Workflow::create([
            'name' => 'Initial assessment',
            'purpose' => 'Practice taking a history.',
            'brief' => 'Assess the patient.',
            'stages' => [['name' => 'History']],
            'criteria' => [['text' => 'Ask about symptoms.']],
        ]);
        $this->case = $this->workflow->cases()->create([
            'name' => 'Patient with a cough',
            'story' => 'The patient has a cough.',
            'visible' => 'The patient is alert.',
            'discover' => 'Symptoms started yesterday.',
            'explanation' => 'A fictional respiratory case.',
        ]);

        app(Practice::class)->publish($this->workflow);
        app(Practice::class)->publish($this->case);
    }

    public static function resources(): array
    {
        return [
            'workflows' => [ManageWorkflows::class, 'workflow'],
            'scenario cases' => [ManageCases::class, 'case'],
        ];
    }

    public function test_cases_display_and_search_their_workflow(): void
    {
        $otherWorkflow = $this->workflow->replicate();
        $otherWorkflow->name = 'Handover';
        $otherWorkflow->save();
        $otherCase = $this->case->replicate();
        $otherCase->workflow()->associate($otherWorkflow);
        $otherCase->save();

        Livewire::test(ManageCases::class)
            ->assertTableColumnStateSet('workflow.name', 'Initial assessment', $this->case)
            ->assertTableColumnStateSet('workflow.name', 'Handover', $otherCase)
            ->sortTable('workflow.name')
            ->assertCanSeeTableRecords([$otherCase, $this->case], inOrder: true)
            ->searchTable('Initial assessment')
            ->assertCanSeeTableRecords([$this->case])
            ->assertCanNotSeeTableRecords([$otherCase]);
    }

    #[DataProvider('resources')]
    public function test_status_changes_control_availability_and_preserve_existing_attempts(string $page, string $property): void
    {
        $record = $this->{$property};
        $attempt = app(Practice::class)->start(auth()->user(), $this->workflow->id)->attempt;
        $snapshot = $attempt->snapshot;
        $published = $record->published;
        $component = Livewire::test($page)
            ->assertDontSee('Publish saved draft')
            ->assertTableColumnStateSet('publication', 'published', $record);

        foreach (['archived', 'draft', 'published'] as $status) {
            $component->call('updateTableColumnState', 'publication', (string) $record->id, $status)
                ->assertReturned($status)
                ->assertTableColumnStateSet('publication', $status, $record);
            $record->refresh();

            $this->assertSame($status === 'archived', $record->archived);
            $this->assertSame($status === 'draft' ? null : $published, $record->published);
            $this->assertSame($snapshot, $attempt->fresh()->snapshot);

            $response = $this->getJson('/api/practice/workflows')->assertOk();
            $response->assertJsonCount($status === 'published' ? 1 : 0, 'data');
            if ($status !== 'published') {
                $this->postJson('/api/practice/start', ['workflow_id' => $this->workflow->id])->assertUnprocessable();
            }
        }

        $component->call('updateTableColumnState', 'publication', (string) $record->id, 'archived')
            ->call('updateTableColumnState', 'publication', (string) $record->id, 'published')
            ->assertReturned('published');
        $this->assertFalse($record->fresh()->archived);
        $this->postJson('/api/practice/start', ['workflow_id' => $this->workflow->id])->assertCreated();
    }

    #[DataProvider('resources')]
    public function test_saved_edits_can_be_published_from_the_status_column(string $page, string $property): void
    {
        $record = $this->{$property};
        $oldName = $record->name;
        $record->update(['name' => 'Updated title']);

        $component = Livewire::test($page)
            ->assertTableColumnStateSet('publication', 'unpublished_edits', $record);
        $this->assertSame($oldName, $record->fresh()->published['name']);

        $component->call('updateTableColumnState', 'publication', (string) $record->id, 'published')
            ->assertReturned('published')
            ->assertTableColumnStateSet('publication', 'published', $record);
        $this->assertSame('Updated title', $record->fresh()->published['name']);
    }

    #[DataProvider('resources')]
    public function test_invalid_content_cannot_replace_the_published_snapshot(string $page, string $property): void
    {
        $record = $this->{$property};
        $published = $record->published;
        $record->update(['name' => '']);

        Livewire::test($page)
            ->call('updateTableColumnState', 'publication', (string) $record->id, 'published')
            ->assertReturned(['error' => 'The name field is required.'])
            ->assertTableColumnStateSet('publication', 'unpublished_edits', $record);
        $this->assertSame($published, $record->fresh()->published);
    }

    #[DataProvider('resources')]
    public function test_invalid_statuses_are_rejected(string $page, string $property): void
    {
        $record = $this->{$property};
        $before = $record->fresh()->getAttributes();
        $component = Livewire::test($page);

        foreach (['unpublished_edits', 'invalid', ''] as $status) {
            $component->call('updateTableColumnState', 'publication', (string) $record->id, $status)
                ->assertTableColumnStateSet('publication', 'published', $record);
            $this->assertSame($before, $record->fresh()->getAttributes());
        }
    }

    #[DataProvider('resources')]
    public function test_non_admins_cannot_change_publication(string $page, string $property): void
    {
        $record = $this->{$property};
        $published = $record->published;
        $component = Livewire::test($page);
        auth()->user()->update(['is_admin' => false]);

        $component->call('updateTableColumnState', 'publication', (string) $record->id, 'draft');
        $this->assertSame($published, $record->fresh()->published);
    }
}
