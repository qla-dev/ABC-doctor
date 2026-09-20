<?php

use App\Models\Conversation;
use App\Models\MarkSkill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

/*
 * A window on the threads and the skills, for reading what was said and changing what Mark is
 * told, without a phone in hand. No auth, same as the API: nothing here is meant to leave
 * localhost.
 */
Route::get('/mark', function () {
    return view('mark.index', [
        'conversations' => Conversation::with('skill')
            ->withCount('messages')
            ->orderByDesc('id')
            ->limit(50)
            ->get(),
    ]);
})->name('mark.index');

Route::get('/mark/skills', function () {
    return view('mark.skills', [
        'skills' => MarkSkill::orderBy('position')->get(),
    ]);
})->name('mark.skills');

Route::get('/mark/skills/{skill}', function (MarkSkill $skill) {
    return view('mark.skill', ['skill' => $skill]);
})->name('mark.skill');

/*
 * Prompts are read from the database on every call, so a save here changes the next turn. This is
 * why they live in the database rather than in files: a migration per wording change is a tax on
 * the one thing that gets edited most.
 */
Route::post('/mark/skills/{skill}', function (Request $request, MarkSkill $skill) {
    $data = $request->validate([
        'name' => ['required', 'string', 'max:120'],
        'description' => ['nullable', 'string', 'max:500'],
        'system_prompt' => ['nullable', 'string', 'max:8000'],
        'opening_prompt' => ['nullable', 'string', 'max:2000'],
        'turn_reminder' => ['nullable', 'string', 'max:2000'],
        'voice_style' => ['nullable', 'string', 'max:2000'],
    ]);

    // Unchecked boxes are simply absent from a form post, so each one is read rather than merged.
    $skill->update($data + [
        'supports_text' => $request->boolean('supports_text'),
        'supports_voice' => $request->boolean('supports_voice'),
        'opens_conversation' => $request->boolean('opens_conversation'),
    ]);

    return redirect()->route('mark.skill', $skill)->with('saved', true);
})->name('mark.skill.save');

Route::get('/mark/{conversation}', function (Conversation $conversation) {
    return view('mark.show', [
        'conversation' => $conversation->load(['skill', 'messages']),
    ]);
})->name('mark.show');
