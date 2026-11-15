<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages\ManageRecords;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

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
        return $schema->components([TextInput::make('name')->required(), TextInput::make('email')->email()->required()->unique(ignoreRecord: true), TextInput::make('password')->password()->minLength(12)->required(fn (string $operation) => $operation === 'create')->dehydrated(fn ($state) => filled($state)), Toggle::make('is_admin')->label('Administrator')])->columns(1);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([TextColumn::make('name')->searchable(), TextColumn::make('updated_at')->dateTime()->sortable()])->recordActions([EditAction::make(), Action::make('revokeSessions')->label('Revoke mobile sessions')->requiresConfirmation()->action(fn ($record) => $record->tokens()->delete())]);
    }

    public static function getPages(): array
    {
        return ['index' => ManageRecords::route('/')];
    }
}
