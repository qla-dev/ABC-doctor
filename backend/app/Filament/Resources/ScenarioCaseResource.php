<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ScenarioCaseResource\Pages\ManageRecords;
use App\Models\ScenarioCase;
use App\Services\Practice;
use App\Services\PracticeAi;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Actions\ReplicateAction;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ScenarioCaseResource extends Resource
{
    protected static ?string $model = ScenarioCase::class;

    public static function canAccess(): bool
    {
        return (bool) auth()->user()?->is_admin;
    }

    public static function canDelete($record): bool
    {
        return false;
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([Select::make('workflow_id')->relationship('workflow', 'name')->required()->disabled(fn ($record) => (bool) $record?->published)->helperText('Duplicate a published case to use it in another workflow.'), TextInput::make('name')->label('Internal case title')->required()->maxLength(120), Textarea::make('story')->label('Patient story')->required()->rows(4), Textarea::make('visible')->label('Initially visible information')->required(), Textarea::make('discover')->label('Information to discover')->required()->rows(4), Textarea::make('explanation')->label('Clinical explanation (hidden from doctor)')->required(), Repeater::make('criteria')->label('Special assessment expectations')->schema([Textarea::make('text')->required()]), Section::make('Advanced')->collapsed()->schema([Textarea::make('references')->label('References and author review notes')]), Toggle::make('archived')])->columns(1);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([TextColumn::make('name')->searchable(), TextColumn::make('publication')->state(fn ($record) => $record->archived ? 'Archived' : (! $record->published ? 'Draft' : ($record->only(array_keys($record->published)) == $record->published ? 'Published' : 'Unpublished edits')))->badge(), TextColumn::make('updated_at')->dateTime()->sortable()])->recordActions([EditAction::make(), Action::make('review')->label('Review with AI')->action(function ($record) {
            try {
                $result = app(PracticeAi::class)->json('Review this fictional training case and workflow for contradictions, missing essential facts, and unfair assessment requirements. Return review_notes string only. Do not modify the case or claim clinical certification.', ['workflow' => $record->workflow->toArray(), 'case' => $record->toArray()]);
                Notification::make()->title('AI authoring review')->body((string) ($result['review_notes'] ?? 'No review returned.'))->persistent()->send();
            } catch (\Throwable $e) {
                report($e);
                Notification::make()->title('Review unavailable; check AI configuration')->danger()->send();
            }
        }), Action::make('publish')->label('Publish saved draft')->action(fn ($record) => app(Practice::class)->publish($record)), ReplicateAction::make()->excludeAttributes(['starter_key', 'published'])->beforeReplicaSaved(fn ($replica) => $replica->name .= ' (copy)'), Action::make('preview')->url(fn ($record) => route('practice.preview', $record))->openUrlInNewTab()]);
    }

    public static function getPages(): array
    {
        return ['index' => ManageRecords::route('/')];
    }
}
