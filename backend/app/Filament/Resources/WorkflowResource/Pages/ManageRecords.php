<?php

namespace App\Filament\Resources\WorkflowResource\Pages;

use App\Filament\Resources\WorkflowResource;
use App\Models\Workflow;
use App\Services\PracticeAi;
use App\Services\StarterWorkflows;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;

class ManageRecords extends \Filament\Resources\Pages\ManageRecords
{
    protected static string $resource = WorkflowResource::class;

    protected function getHeaderActions(): array
    {
        return [CreateAction::make(), Action::make('draftWithAi')->label('Draft with AI')->schema([Textarea::make('description')->label('Describe the exercise')->required()->maxLength(6000)])->action(function (array $data) {
            try {
                $context = isset($data['workflow_id']) ? Workflow::findOrFail($data['workflow_id'])->toArray() : [];
                $draft = app(PracticeAi::class)->draft($data['description'], 'workflow', $context);
                $notes = $draft['review_notes'];
                unset($draft['review_notes']);
                $draft['advanced'] = ($draft['advanced'] ?? '')."\nAI review notes: ".$notes;
                if (isset($data['workflow_id'])) {
                    $draft['workflow_id'] = $data['workflow_id'];
                }
                Workflow::create($draft);
                Notification::make()->title('Draft created — review before publishing')->body($notes)->success()->persistent()->send();
            } catch (\Throwable $e) {
                report($e);
                Notification::make()->title('AI draft could not be created')->body('Check AI configuration and try again. Your existing content is unchanged.')->danger()->send();
            }
        }), Action::make('starterExamples')->label('Add starter examples')->action(function () {
            app(StarterWorkflows::class)->import();
            Notification::make()->title('Starter drafts added; existing content preserved')->success()->send();
        })];
    }
}
