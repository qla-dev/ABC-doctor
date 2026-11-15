<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\MarkSkill;
use App\Services\MarkResponder;
use App\Services\PatientCases;
use App\Support\ApiResponse;
use App\Support\PatientVoice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $conversations = Conversation::query()->where('user_id', $request->user()->id)
            ->with('skill')
            ->when($request->query('skill'), fn ($q, $key) => $q->whereHas('skill', fn ($s) => $s->where('key', $key)))
            ->orderByDesc('last_message_at')
            ->orderByDesc('id')
            ->limit(50)
            ->get();

        return ApiResponse::ok($conversations, 'Conversations.', ['count' => $conversations->count()]);
    }

    /** A thread is opened in a skill and stays in it — the skill is what Mark is being asked to be. */
    public function store(Request $request, MarkResponder $mark, PatientCases $cases): JsonResponse
    {
        $data = $request->validate([
            'skill' => ['required', 'string', 'exists:mark_skills,key'],
            'modality' => ['nullable', 'string', 'in:text,voice'],
            'context' => ['nullable', 'string', 'max:1000'],
            'sex' => ['nullable', 'string', 'in:M,F,any'],
            'title' => ['nullable', 'string', 'max:120'],
            'case_setup' => ['nullable', 'array:difficulty,specialty,gender,ageBand'],
            'case_setup.difficulty' => ['sometimes', 'required', 'in:easy,medium,hard'],
            'case_setup.specialty' => ['sometimes', 'required', 'in:any,Cardiology,Surgery'],
            'case_setup.gender' => ['sometimes', 'required', 'in:M,F,any'],
            'case_setup.ageBand' => ['sometimes', 'required', 'in:18-34,35-54,55-74,75+'],
        ]);

        $skill = MarkSkill::where('key', $data['skill'])->firstOrFail();

        // Chosen here and fixed for the thread's life: a consultation that began spoken stays
        // spoken, and switching mid-thread would leave half its turns unplayable.
        $modality = $data['modality'] ?? ($skill->supports_text ? 'text' : 'voice');

        if (! $skill->accepts($modality)) {
            return ApiResponse::fail(
                "This skill does not accept {$modality}.",
                ['modality' => [sprintf('The skill %s does not accept %s.', $skill->key, $modality)]],
            );
        }

        $patient = $skill->key === 'patient_simulator'
            ? $cases->create($data['case_setup'] ?? ['gender' => $data['sex'] ?? 'any'])
            : null;

        $conversation = Conversation::create([
            'user_id' => $request->user()->id,
            'mark_skill_id' => $skill->id,
            'modality' => $modality,
            // Resolved once and kept: a patient who sounds like a different person on the second
            // call is not the same patient.
            'voice' => PatientVoice::for($patient['gender'] ?? $data['sex'] ?? null),
            'context' => $patient ? null : ($data['context'] ?? null),
            'patient_case' => $patient,
            'title' => $data['title'] ?? $skill->name,
        ]);

        // Some skills speak first — a patient is sitting there before anyone asks anything.
        // Which ones is configuration on the skill rather than a branch here.
        // A spoken opening is generated once, by Realtime, from the saved case.
        if ($modality !== 'voice' && ($opening = $mark->open($conversation))) {
            $conversation->update(['last_message_at' => $opening->sent_at]);
        }

        return ApiResponse::ok(
            $conversation->fresh()->load(['skill', 'messages']),
            'Conversation started.',
            [],
            201,
        );
    }

    public function show(Conversation $conversation): JsonResponse
    {
        return ApiResponse::ok($conversation->load(['skill', 'messages']), 'Conversation.');
    }
}
