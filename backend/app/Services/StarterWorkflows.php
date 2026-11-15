<?php

namespace App\Services;

use App\Models\ScenarioCase;
use App\Models\Workflow;

class StarterWorkflows
{
    public function import(): void
    {
        foreach (json_decode(file_get_contents(resource_path('starter-workflows.json')), true, 512, JSON_THROW_ON_ERROR) as $row) {
            $cases = $row['cases'];
            unset($row['cases']);
            $w = Workflow::firstOrCreate(['starter_key' => $row['starter_key']], $row);
            foreach ($cases as $case) {
                ScenarioCase::firstOrCreate(['starter_key' => $case['starter_key']], $case + ['workflow_id' => $w->id]);
            }
        }
    }
}
