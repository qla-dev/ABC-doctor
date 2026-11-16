<?php

use App\Http\Controllers\Api\MarkRealtimeController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\MarkSkillController;
use App\Http\Controllers\Api\MarkTranscriptionController;
use App\Http\Controllers\Api\PurchaseController;
use App\Http\Controllers\Api\WebPurchaseController;
use Illuminate\Support\Facades\Route;

/*
 * Mark's messaging protocol.
 *
 * Sanctum authenticates mobile clients; conversation policies enforce ownership.
 */

Route::get('health', fn () => \App\Support\ApiResponse::ok(
    ['status' => 'ok', 'timestamp' => now()->toIso8601String()],
    'ABC Doctor API is healthy.',
));

Route::post('auth/login', [\App\Http\Controllers\Api\AuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('auth/google', [\App\Http\Controllers\Api\AuthController::class, 'google'])->middleware('throttle:10,1');
Route::post('auth/apple', [\App\Http\Controllers\Api\AuthController::class, 'apple'])->middleware('throttle:10,1');
Route::post('web-purchases/claim', [WebPurchaseController::class, 'claim'])->middleware('throttle:10,1');
Route::middleware(['auth:sanctum', \App\Http\Middleware\OwnConversation::class])->group(function () {
Route::post('auth/logout', [\App\Http\Controllers\Api\AuthController::class,'logout']);
Route::get('auth/me', [\App\Http\Controllers\Api\AuthController::class,'me']);
Route::put('auth/profile', [\App\Http\Controllers\Api\AuthController::class,'updateProfile']);
Route::post('auth/sign-in-methods/{provider}', [\App\Http\Controllers\Api\AuthController::class,'linkMethod'])->middleware('throttle:10,1');
Route::delete('auth/sign-in-methods/{provider}', [\App\Http\Controllers\Api\AuthController::class,'unlinkMethod']);
Route::get('mark/skills', [MarkSkillController::class, 'index']);

Route::get('conversations', [ConversationController::class, 'index']);
Route::post('conversations', [ConversationController::class, 'store']);
Route::get('conversations/{conversation}', [ConversationController::class, 'show']);
Route::get('conversations/{conversation}/messages', [MessageController::class, 'index']);

Route::post('mark/realtime/session', [MarkRealtimeController::class, 'store']);
Route::post('mark/realtime/transcript', [MarkRealtimeController::class, 'transcript']);
Route::post('mark/realtime/transcription', [MarkRealtimeController::class, 'transcription'])->middleware('throttle:30,1');

/*
 * A voice message on its way in, which is the one route here that uploads anything: throttled
 * because an audio body is expensive to both carry and transcribe, and a stuck microphone is a
 * bill rather than a bug.
 */
Route::post('mark/transcribe', [MarkTranscriptionController::class, 'store'])->middleware('throttle:30,1');

Route::post('messages', [MessageController::class, 'store']);

Route::get('purchases', [PurchaseController::class, 'index']);
Route::post('purchases', [PurchaseController::class, 'grant']);


Route::get('practice/workflows', [\App\Http\Controllers\Api\PracticeController::class,'workflows']);
Route::put('practice/preferences', [\App\Http\Controllers\Api\PracticeController::class,'preferences']);
Route::post('practice/start', [\App\Http\Controllers\Api\PracticeController::class,'start']);
Route::get('practice/{conversation}', [\App\Http\Controllers\Api\PracticeController::class,'show']);
Route::post('practice/{conversation}/events', [\App\Http\Controllers\Api\PracticeController::class,'event']);
Route::post('practice/{conversation}/finish', [\App\Http\Controllers\Api\PracticeController::class,'finish'])->middleware('throttle:10,1');
});
