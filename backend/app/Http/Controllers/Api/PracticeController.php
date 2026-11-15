<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\EvaluatePractice;
use App\Models\Conversation;
use App\Models\Workflow;
use App\Services\Practice;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PracticeController extends Controller
{
    public function workflows(Request $r)
    {
        return ApiResponse::ok(Workflow::whereNotNull('published')->where('archived', false)->whereHas('cases', fn ($q) => $q->whereNotNull('published')->where('archived', false))->get()->map(fn ($w) => ['id' => $w->id, 'name' => $w->published['name'], 'purpose' => $w->published['purpose'], 'enabled' => ! in_array($w->id, $r->user()->disabled_workflows ?? [])]));
    }

    public function preferences(Request $r)
    {
        $d = $r->validate(['disabled' => 'present|array', 'disabled.*' => 'integer|exists:workflows,id']);
        $r->user()->forceFill(['disabled_workflows' => array_values(array_unique($d['disabled']))])->save();

        return ApiResponse::ok(null);
    }

    public function start(Request $r, Practice $p)
    {
        $d = $r->validate(['workflow_id' => 'nullable|integer|exists:workflows,id']);

        return ApiResponse::ok($p->start($r->user(), $d['workflow_id'] ?? null)->load('skill'), 'Practice started.', [], 201);
    }

    public function show(Conversation $conversation)
    {
        $a = $conversation->attempt()->firstOrFail();

        return ApiResponse::ok(['conversation_id' => $conversation->id, 'status' => $a->status, 'brief' => $a->snapshot['workflow']['brief']."\n\n".$a->snapshot['case']['visible'], 'report' => $a->report]);
    }

    public function event(Request $r, Conversation $conversation)
    {
        $a = $conversation->attempt()->firstOrFail();
        abort_unless($a->status === 'active', 409, 'Attempt has ended.');
        $d = $r->validate(['event_key' => 'required|string|max:100', 'kind' => 'required|in:action,stage,finish_requested', 'description' => 'required|string|max:2000', 'stage' => 'nullable|string|max:120']);
        if ($d['kind'] === 'stage') {
            abort_unless(in_array($d['stage'] ?? null, array_column($a->snapshot['workflow']['stages'], 'name')), 422, 'Unknown stage.');
        }
        $event = $a->events()->firstOrCreate(['event_key' => $d['event_key']], ['kind' => $d['kind'], 'payload' => array_intersect_key($d, array_flip(['description', 'stage']))]);

        return ApiResponse::ok(['recorded' => true, 'kind' => $event->kind]);
    }

    public function finish(Request $request, Conversation $conversation)
    {
        $data = $request->validate(['transcript_complete'=>'sometimes|boolean']);
        if (($data['transcript_complete'] ?? true) === false) $conversation->attempt->events()->firstOrCreate(['event_key'=>'transcript_gap'],['kind'=>'transcript_gap','payload'=>['description'=>'Some audio was not transcribed before the call ended.']]);
        $a = DB::transaction(function () use ($conversation) {
            $a = $conversation->attempt()->lockForUpdate()->firstOrFail();
            if (in_array($a->status, ['active', 'evaluation_failed'])) {
                $a->update(['status' => 'evaluating', 'evaluation_revision' => $a->evaluation_revision + 1]);
                EvaluatePractice::dispatch($a->id, $a->evaluation_revision)->afterCommit();
            }

return $a;
        });

        return ApiResponse::ok(['status' => $a->status]);
    }
}
