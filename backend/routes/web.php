<?php

use App\Models\Conversation;
use App\Models\NinaSkill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

/*
 * A window on the threads and the skills, for reading what was said and changing what Nina is
 * told, without a phone in hand. No auth, same as the API: nothing here is meant to leave
 * localhost.
 */
Route::get('/nina', function () {
    return view('nina.index', [
        'conversations' => Conversation::with('skill')
            ->withCount('messages')
            ->orderByDesc('id')
            ->limit(50)
            ->get(),
    ]);
})->name('nina.index');

Route::get('/nina/skills', function () {
    return view('nina.skills', [
        'skills' => NinaSkill::orderBy('position')->get(),
    ]);
})->name('nina.skills');

Route::get('/nina/skills/{skill}', function (NinaSkill $skill) {
    return view('nina.skill', ['skill' => $skill]);
})->name('nina.skill');

/*
 * Prompts are read from the database on every call, so a save here changes the next turn. This is
 * why they live in the database rather than in files: a migration per wording change is a tax on
 * the one thing that gets edited most.
 */
Route::post('/nina/skills/{skill}', function (Request $request, NinaSkill $skill) {
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

    return redirect()->route('nina.skill', $skill)->with('saved', true);
})->name('nina.skill.save');

Route::get('/nina/{conversation}', function (Conversation $conversation) {
    return view('nina.show', [
        'conversation' => $conversation->load(['skill', 'messages']),
    ]);
})->name('nina.show');
