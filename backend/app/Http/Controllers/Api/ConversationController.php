<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\NinaSkill;
use App\Services\NinaResponder;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $conversations = Conversation::query()
            ->with('skill')
            ->when($request->query('skill'), fn ($q, $key) =>
                $q->whereHas('skill', fn ($s) => $s->where('key', $key)))
            ->orderByDesc('last_message_at')
            ->orderByDesc('id')
            ->limit(50)
            ->get();

        return ApiResponse::ok($conversations, 'Conversations.', ['count' => $conversations->count()]);
    }

    /** A thread is opened in a skill and stays in it — the skill is what Nina is being asked to be. */
    public function store(Request $request, NinaResponder $nina): JsonResponse
    {
        $data = $request->validate([
            'skill' => ['required', 'string', 'exists:nina_skills,key'],
            'modality' => ['nullable', 'string', 'in:text,voice'],
            'context' => ['nullable', 'string', 'max:1000'],
            'title' => ['nullable', 'string', 'max:120'],
        ]);

        $skill = NinaSkill::where('key', $data['skill'])->firstOrFail();

        // Chosen here and fixed for the thread's life: a consultation that began spoken stays
        // spoken, and switching mid-thread would leave half its turns unplayable.
        $modality = $data['modality'] ?? ($skill->supports_text ? 'text' : 'voice');

        if (! $skill->accepts($modality)) {
            return ApiResponse::fail(
                "This skill does not accept {$modality}.",
                ['modality' => [sprintf('The skill %s does not accept %s.', $skill->key, $modality)]],
            );
        }

        $conversation = Conversation::create([
            'nina_skill_id' => $skill->id,
            'modality' => $modality,
            'context' => $data['context'] ?? null,
            'title' => $data['title'] ?? $skill->name,
        ]);

        // Some skills speak first — a patient is sitting there before anyone asks anything.
        // Which ones is configuration on the skill rather than a branch here.
        if ($opening = $nina->open($conversation)) {
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
