<?php

use App\Models\Conversation;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

/*
 * A read-only window on the threads, for reading what was actually said without a phone in hand.
 * No auth, same as the API: nothing here is meant to leave localhost.
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

Route::get('/nina/{conversation}', function (Conversation $conversation) {
    return view('nina.show', [
        'conversation' => $conversation->load(['skill', 'messages']),
    ]);
})->name('nina.show');
