<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class PracticeAdmin
{
    public function handle(Request $r, Closure $next)
    {
        if (! $r->user()) {
            return redirect('/admin/login');
        } abort_unless($r->user()->is_admin, 403);

        return $next($r);
    }
}
