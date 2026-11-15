<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $r)
    {
        $d = $r->validate(['email' => 'required|email', 'password' => 'required|string']);
        $u = User::where('email', $d['email'])->first();
        if (! $u || ! Hash::check($d['password'], $u->password)) {
            throw ValidationException::withMessages(['email' => 'Invalid email or password.']);
        }

return ApiResponse::ok(['user' => $u->only('id', 'name', 'email'), 'token' => $u->createToken('mobile', ['*'], now()->addDays(30))->plainTextToken]);
    }

    public function logout(Request $r)
    {
        $r->user()->currentAccessToken()?->delete();

        return ApiResponse::ok(null);
    }
}
