<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\NinaSkill;
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
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'skill' => ['required', 'string', 'exists:nina_skills,key'],
            'title' => ['nullable', 'string', 'max:120'],
        ]);

        $skill = NinaSkill::where('key', $data['skill'])->firstOrFail();

        $conversation = Conversation::create([
            'nina_skill_id' => $skill->id,
            'title' => $data['title'] ?? $skill->name,
        ]);

        return ApiResponse::ok($conversation->load('skill'), 'Conversation started.', [], 201);
    }

    public function show(Conversation $conversation): JsonResponse
    {
        return ApiResponse::ok($conversation->load(['skill', 'messages']), 'Conversation.');
    }
}
