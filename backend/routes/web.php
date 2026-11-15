<?php
use Illuminate\Support\Facades\Route;
Route::get('/', fn() => redirect('/admin'));
Route::get('/mark/skills/{path?}', fn() => redirect('/admin/mark-skills'))->where('path','.*');
Route::get('/mark/{path?}', fn() => redirect('/admin'))->where('path','.*');

Route::middleware([\App\Http\Middleware\PracticeAdmin::class,\App\Http\Middleware\OwnConversation::class])->prefix('admin/practice-preview')->group(function() {
 Route::get('{case}',fn(\App\Models\ScenarioCase $case)=>view('practice-preview',['case'=>$case]))->name('practice.preview');
 Route::post('{case}/start',function(\Illuminate\Http\Request $r,\App\Models\ScenarioCase $case,\App\Services\Practice $practice) { return \App\Support\ApiResponse::ok($practice->start($r->user(),null,$case)); });
 Route::post('session/voice',[\App\Http\Controllers\Api\MarkRealtimeController::class,'store']);
 Route::post('session/transcript',[\App\Http\Controllers\Api\MarkRealtimeController::class,'transcript']);
 Route::get('session/{conversation}',[\App\Http\Controllers\Api\PracticeController::class,'show']);
 Route::post('session/{conversation}/events',[\App\Http\Controllers\Api\PracticeController::class,'event']);
 Route::post('session/{conversation}/finish',[\App\Http\Controllers\Api\PracticeController::class,'finish']);
});
