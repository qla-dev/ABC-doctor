<?php
namespace App\Filament\Resources;
use App\Models\MarkSkill;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Forms\Components\{TextInput,Textarea,Toggle};
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Actions\EditAction;
class MarkSkillResource extends Resource {
 protected static ?string $model=MarkSkill::class;
 public static function canAccess(): bool { return (bool)auth()->user()?->is_admin; }
 public static function canCreate(): bool { return false; }
 public static function canDelete($record): bool { return false; }
 public static function form(Schema $schema): Schema { return $schema->components([
 TextInput::make('name')->required()->maxLength(120),Textarea::make('description')->maxLength(500),Textarea::make('system_prompt')->rows(8)->maxLength(8000),Textarea::make('opening_prompt')->maxLength(2000),Textarea::make('turn_reminder')->maxLength(2000),Textarea::make('voice_style')->maxLength(2000),Toggle::make('supports_text'),Toggle::make('supports_voice'),Toggle::make('opens_conversation')])->columns(1); }
 public static function table(Table $table): Table { return $table->columns([TextColumn::make('name'),TextColumn::make('key')])->recordActions([EditAction::make()]); }
 public static function getPages(): array { return ['index'=>\App\Filament\Resources\MarkSkillResource\Pages\ManageRecords::route('/')]; }
}
