<?php

namespace App\Http\Middleware;

use App\Models\Conversation;
use Closure;
use Illuminate\Http\Request;

class OwnConversation
{
    public function handle(Request $request, Closure $next)
    {
        $id = $request->route('conversation') ?? $request->input('conversation_id');
        if ($id) {
            abort_unless($id instanceof Conversation || (is_scalar($id) && ctype_digit((string)$id)), 422, 'Invalid conversation ID.');
            $c = $id instanceof Conversation ? $id : Conversation::findOrFail($id);
            abort_unless($request->user()->can('view', $c), 404);
        }

        return $next($request);
    }
}
