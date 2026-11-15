<?php

namespace App\Filament\Resources;

use App\Filament\Resources\WorkflowResource\Pages\ManageRecords;
use App\Models\Workflow;
use App\Services\Practice;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Actions\ReplicateAction;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class WorkflowResource extends Resource
{
    protected static ?string $model = Workflow::class;

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
        return $schema->components([TextInput::make('name')->required()->maxLength(120), Textarea::make('purpose')->required(), Textarea::make('brief')->label('Opening instructions')->required(), Repeater::make('stages')->schema([TextInput::make('name')->required()->maxLength(120)])->minItems(1)->defaultItems(3)->reorderable(), Repeater::make('criteria')->label('What should the doctor demonstrate?')->schema([Textarea::make('text')->required()])->minItems(1), Section::make('Advanced')->collapsed()->schema([Textarea::make('advanced')->label('Ordering rules and alternate endings')]), Toggle::make('archived')])->columns(1);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([TextColumn::make('name')->searchable(), TextColumn::make('publication')->state(fn ($record) => $record->archived ? 'Archived' : (! $record->published ? 'Draft' : ($record->only(array_keys($record->published)) == $record->published ? 'Published' : 'Unpublished edits')))->badge(), TextColumn::make('updated_at')->dateTime()->sortable()])->recordActions([EditAction::make(), Action::make('publish')->label('Publish saved draft')->action(fn ($record) => app(Practice::class)->publish($record)), ReplicateAction::make()->excludeAttributes(['starter_key', 'published'])->beforeReplicaSaved(fn ($replica) => $replica->name .= ' (copy)')]);
    }

    public static function getPages(): array
    {
        return ['index' => ManageRecords::route('/')];
    }
}
