<?php

use App\Http\Controllers\Api\NinaRealtimeController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NinaSkillController;
use App\Http\Controllers\Api\NinaTranscriptionController;
use Illuminate\Support\Facades\Route;

/*
 * Nina's messaging protocol.
 *
 * No auth yet, on purpose: this is a local spike and Sanctum is a decision that belongs with the
 * first real user, not with the first message. Nothing here is safe to expose beyond localhost.
 */

Route::get('health', fn () => \App\Support\ApiResponse::ok(
    ['status' => 'ok', 'timestamp' => now()->toIso8601String()],
    'ABC Doctor API is healthy.',
));

Route::get('nina/skills', [NinaSkillController::class, 'index']);

Route::get('conversations', [ConversationController::class, 'index']);
Route::post('conversations', [ConversationController::class, 'store']);
Route::get('conversations/{conversation}', [ConversationController::class, 'show']);
Route::get('conversations/{conversation}/messages', [MessageController::class, 'index']);

Route::post('nina/realtime/session', [NinaRealtimeController::class, 'store']);
Route::post('nina/realtime/transcript', [NinaRealtimeController::class, 'transcript']);
Route::post('nina/realtime/transcription', [NinaRealtimeController::class, 'transcription'])->middleware('throttle:30,1');

/*
 * A voice message on its way in, which is the one route here that uploads anything: throttled
 * because an audio body is expensive to both carry and transcribe, and a stuck microphone is a
 * bill rather than a bug.
 */
Route::post('nina/transcribe', [NinaTranscriptionController::class, 'store'])->middleware('throttle:30,1');

Route::post('messages', [MessageController::class, 'store']);
