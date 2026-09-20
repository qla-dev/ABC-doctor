<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NinaSkill;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class NinaSkillController extends Controller
{
    /** The catalogue a client builds its picker from. Sub-skills come nested, not flattened. */
    public function index(): JsonResponse
    {
        $skills = NinaSkill::query()
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->with(['children' => fn ($q) => $q->where('is_active', true)])
            ->orderBy('position')
            ->get();

        return ApiResponse::ok($skills, 'Nina skills.', ['count' => $skills->count()]);
    }
}
