<?php

namespace App\Filament\Resources\ScenarioCaseResource\Pages;

use App\Filament\Resources\ScenarioCaseResource;
use App\Models\ScenarioCase;
use App\Models\Workflow;
use App\Services\PracticeAi;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;

class ManageRecords extends \Filament\Resources\Pages\ManageRecords
{
    protected static string $resource = ScenarioCaseResource::class;

    protected function getHeaderActions(): array
    {
        return [CreateAction::make(), Action::make('draftWithAi')->label('Draft with AI')->schema([Select::make('workflow_id')->options(Workflow::pluck('name', 'id'))->required(), Textarea::make('description')->label('Describe the exercise')->required()->maxLength(6000)])->action(function (array $data) {
            try {
                $context = isset($data['workflow_id']) ? Workflow::findOrFail($data['workflow_id'])->toArray() : [];
                $draft = app(PracticeAi::class)->draft($data['description'], 'case', $context);
                $notes = $draft['review_notes'];
                unset($draft['review_notes']);
                $draft['references'] = ($draft['references'] ?? '')."\nAI review notes: ".$notes;
                if (isset($data['workflow_id'])) {
                    $draft['workflow_id'] = $data['workflow_id'];
                }
                ScenarioCase::create($draft);
                Notification::make()->title('Draft created — review before publishing')->body($notes)->success()->persistent()->send();
            } catch (\Throwable $e) {
                report($e);
                Notification::make()->title('AI draft could not be created')->body('Check AI configuration and try again. Your existing content is unchanged.')->danger()->send();
            }
        })];
    }
}
