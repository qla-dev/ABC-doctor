<?php

namespace App\Filament\Tables\Columns;

use App\Models\ScenarioCase;
use App\Models\Workflow;
use App\Services\Practice;
use Filament\Tables\Columns\SelectColumn;
use Illuminate\Validation\ValidationException;

class PublicationColumn extends SelectColumn
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->label('Status')
            ->state(fn (Workflow|ScenarioCase $record): string => self::statusFor($record))
            ->options(fn (Workflow|ScenarioCase $record): array => [
                'draft' => 'Draft',
                'published' => 'Published',
                'archived' => 'Archived',
                ...(self::statusFor($record) === 'unpublished_edits' ? ['unpublished_edits' => 'Unpublished edits'] : []),
            ])
            ->disableOptionWhen(fn (string $value): bool => $value === 'unpublished_edits')
            ->selectablePlaceholder(false)
            ->rules(['required', 'in:draft,published,archived'])
            ->disabled(fn (): bool => ! auth()->user()?->is_admin)
            ->updateStateUsing(function (Workflow|ScenarioCase $record, string $state): string|array {
                try {
                    match ($state) {
                        'published' => app(Practice::class)->publish($record),
                        'draft' => $record->update(['published' => null, 'archived' => false]),
                        'archived' => $record->update(['archived' => true]),
                    };
                } catch (ValidationException $exception) {
                    return ['error' => $exception->getMessage()];
                }

                return self::statusFor($record);
            });
    }

    private static function statusFor(Workflow|ScenarioCase $record): string
    {
        if ($record->archived) {
            return 'archived';
        }

        if (! $record->published) {
            return 'draft';
        }

        return $record->only(array_keys($record->published)) == $record->published
            ? 'published'
            : 'unpublished_edits';
    }
}
