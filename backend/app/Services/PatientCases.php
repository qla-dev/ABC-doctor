<?php

namespace App\Services;

use Illuminate\Support\Arr;

/** Select once at conversation creation. Persist the entire snapshot, not just a template id. */
class PatientCases
{
    public function create(array $setup = []): array
    {
        $catalog = json_decode(file_get_contents(resource_path('patient-cases.json')), true, flags: JSON_THROW_ON_ERROR);
        $specialty = $setup['specialty'] ?? 'any';
        $matching = array_values(array_filter($catalog, fn ($case) => $specialty === 'any' || $case['specialty'] === $specialty));
        $case = Arr::random($matching);
        $gender = ($setup['gender'] ?? 'any') === 'any' ? Arr::random(['M', 'F']) : $setup['gender'];
        [$low, $high] = match ($setup['ageBand'] ?? '35-54') {
            '18-34' => [18, 34], '55-74' => [55, 74], '75+' => [75, 92], default => [35, 54],
        };
        $age = random_int($low, $high);

        // The old templates contain sex/age-specific details. Do not give a young patient
        // a 30-year smoking history or a male patient a menstrual/pregnancy history.
        if ($case['specialty'] === 'Cardiology') {
            $years = min(30, $age - 18);
            $case['source']['historyClues'][3]['patientAnswer'] = $years > 0
                ? "I smoke about a pack a day and have smoked for {$years} years. No drugs."
                : 'I started smoking recently, about a pack a day. No drugs.';
        } elseif ($gender === 'M' || $age >= 55) {
            $case['source']['historyClues'] = array_values(array_filter($case['source']['historyClues'], fn ($clue) => ! in_array($clue['id'], ['he1', 'he2'])));
            $case['source']['historyClues'][1]['patientAnswer'] = 'No burning or frequency when urinating.';
            $case['source']['physicalExamFindings'] = array_values(array_filter($case['source']['physicalExamFindings'], fn ($finding) => $finding['system'] !== 'Pelvic Exam'));
            $case['source']['investigations'] = array_values(array_filter($case['source']['investigations'], fn ($test) => $test['id'] !== 'inv_hcg'));
        }

        return $case + [
            'version' => 1,
            'name' => Arr::random($gender === 'M'
                ? ['Emir Hadžić', 'Marko Petrović', 'Adnan Kovač']
                : ['Amina Softić', 'Jelena Marić', 'Lejla Begić']),
            'age' => $age,
            'gender' => $gender,
            'difficulty' => $setup['difficulty'] ?? 'medium',
            'behavior' => 'Worried but cooperative. Answer briefly in everyday language. Reveal symptoms when asked; do not change their location, severity, timing or associated symptoms.',
            'unspecified_facts' => 'Not documented. Do not invent additional illnesses, medicines, allergies or symptoms. Say that you do not know or cannot recall.',
        ];
    }
}
