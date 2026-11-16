<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
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

        return ApiResponse::ok([
            'user' => $u->only('id', 'name', 'email'),
            'token' => $u->createToken('mobile', ['*'], now()->addDays(30))->plainTextToken,
        ]);
    }

    public function logout(Request $r)
    {
        $r->user()->currentAccessToken()?->delete();

        return ApiResponse::ok(null);
    }

    public function me(Request $r)
    {
        $u = $r->user();

        return ApiResponse::ok([
            'id' => $u->id,
            'name' => $u->name,
            'email' => $u->email,
            'sign_in_methods' => array_values(array_filter([
                $u->google_id ? ['provider' => 'google', 'email' => $u->email] : null,
                $u->apple_id ? ['provider' => 'apple', 'email' => $u->email] : null,
            ])),
        ]);
    }

    public function updateProfile(Request $r)
    {
        $d = $r->validate([
            'name' => 'sometimes|string|max:100',
        ]);

        $r->user()->update($d);

        return $this->me($r);
    }

    public function linkMethod(Request $r, string $provider)
    {
        abort_unless(in_array($provider, ['google', 'apple'], true), 404);

        $u = $r->user();
        $providerKey = $provider.'_id';

        if ($u->{$providerKey}) {
            return ApiResponse::fail("$provider is already linked.", [], 409);
        }

        if ($provider === 'google') {
            $r->validate(['id_token' => 'required_without:access_token|string', 'access_token' => 'required_without:id_token|string']);
            $payload = $r->id_token ? $this->verifyGoogleIdToken($r->id_token) : $this->verifyGoogleAccessToken($r->access_token);
            $existingUser = User::where('google_id', $payload['sub'])->where('id', '!=', $u->id)->first();
            if ($existingUser) {
                return ApiResponse::fail('This Google account is linked to another user.', [], 409);
            }
            $u->update(['google_id' => $payload['sub']]);
        } else {
            $r->validate(['identity_token' => 'required|string']);
            $payload = $this->verifyAppleIdentityToken($r->identity_token);
            $existingUser = User::where('apple_id', $payload['sub'])->where('id', '!=', $u->id)->first();
            if ($existingUser) {
                return ApiResponse::fail('This Apple account is linked to another user.', [], 409);
            }
            $u->update(['apple_id' => $payload['sub']]);
        }

        return $this->me($r);
    }

    public function unlinkMethod(Request $r, string $provider)
    {
        abort_unless(in_array($provider, ['google', 'apple'], true), 404);

        $u = $r->user();
        $providerKey = $provider.'_id';

        if (! $u->{$providerKey}) {
            return ApiResponse::fail("$provider is not linked.", [], 409);
        }

        $otherProvider = $provider === 'google' ? 'apple_id' : 'google_id';
        $hasPassword = $u->password && ! Str::startsWith($u->password, '$2y$10$placeholder');
        if (! $u->{$otherProvider} && ! $hasPassword) {
            return ApiResponse::fail('Cannot remove your only sign-in method.', [], 422);
        }

        $u->update([$providerKey => null]);

        return $this->me($r);
    }

    // ── Google ───────────────────────────────────────────────────────────

    public function google(Request $r)
    {
        $r->validate([
            'id_token' => 'required_without:access_token|string',
            'access_token' => 'required_without:id_token|string',
        ]);

        if ($r->id_token) {
            $payload = $this->verifyGoogleIdToken($r->id_token);
        } else {
            $payload = $this->verifyGoogleAccessToken($r->access_token);
        }

        return $this->authenticateSocial('google_id', $payload['sub'], $payload['email'], $payload['name'] ?? null);
    }

    private function verifyGoogleIdToken(string $idToken): array
    {
        $res = Http::get('https://oauth2.googleapis.com/tokeninfo', ['id_token' => $idToken]);

        if ($res->failed()) {
            abort(401, 'Invalid Google ID token.');
        }

        $data = $res->json();
        $clientIds = config('services.google.client_ids', []);

        if ($clientIds && ! in_array($data['aud'] ?? '', $clientIds, true)) {
            abort(401, 'Google token audience mismatch.');
        }
        if (empty($data['email_verified']) || $data['email_verified'] === 'false') {
            abort(401, 'Google email not verified.');
        }
        if (($data['exp'] ?? 0) < time()) {
            abort(401, 'Google token expired.');
        }

        return [
            'sub' => $data['sub'],
            'email' => $data['email'],
            'name' => $data['name'] ?? null,
        ];
    }

    private function verifyGoogleAccessToken(string $accessToken): array
    {
        $tokenInfo = Http::get('https://oauth2.googleapis.com/tokeninfo', ['access_token' => $accessToken]);

        if ($tokenInfo->failed()) {
            abort(401, 'Invalid Google access token.');
        }

        $info = $tokenInfo->json();
        $clientIds = config('services.google.client_ids', []);

        if ($clientIds && ! in_array($info['aud'] ?? '', $clientIds, true)) {
            abort(401, 'Google token audience mismatch.');
        }
        if (($info['exp'] ?? 0) < time()) {
            abort(401, 'Google token expired.');
        }

        $userInfo = Http::withToken($accessToken)->get('https://openidconnect.googleapis.com/v1/userinfo');

        if ($userInfo->failed()) {
            abort(401, 'Failed to fetch Google user info.');
        }

        $profile = $userInfo->json();

        return [
            'sub' => $profile['sub'],
            'email' => $profile['email'],
            'name' => $profile['name'] ?? null,
        ];
    }

    // ── Apple ────────────────────────────────────────────────────────────

    public function apple(Request $r)
    {
        $r->validate([
            'identity_token' => 'required|string',
            'full_name' => 'nullable|string',
        ]);

        $payload = $this->verifyAppleIdentityToken($r->identity_token);

        return $this->authenticateSocial('apple_id', $payload['sub'], $payload['email'] ?? null, $r->full_name);
    }

    private function verifyAppleIdentityToken(string $jwt): array
    {
        $parts = explode('.', $jwt);
        if (count($parts) !== 3) {
            abort(401, 'Malformed Apple identity token.');
        }

        $header = json_decode(base64_decode(strtr($parts[0], '-_', '+/')), true);
        $payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')), true);
        $signature = base64_decode(strtr($parts[2], '-_', '+/'));

        if (! $header || ! $payload || ! $signature) {
            abort(401, 'Cannot decode Apple identity token.');
        }

        // Fetch Apple's public keys and find the one that signed this token.
        $jwks = Http::get('https://appleid.apple.com/auth/keys')->json();
        $key = collect($jwks['keys'] ?? [])->firstWhere('kid', $header['kid'] ?? '');

        if (! $key) {
            abort(401, 'Apple signing key not found.');
        }

        $pem = $this->jwkToPem($key);
        $data = $parts[0].'.'.$parts[1];
        $valid = openssl_verify($data, $signature, $pem, OPENSSL_ALGO_SHA256);

        if ($valid !== 1) {
            abort(401, 'Apple token signature invalid.');
        }

        if (($payload['iss'] ?? '') !== 'https://appleid.apple.com') {
            abort(401, 'Apple token issuer mismatch.');
        }

        $clientIds = config('services.apple.client_ids', []);
        if ($clientIds && ! in_array($payload['aud'] ?? '', $clientIds, true)) {
            abort(401, 'Apple token audience mismatch.');
        }

        if (($payload['exp'] ?? 0) < time()) {
            abort(401, 'Apple token expired.');
        }

        return [
            'sub' => $payload['sub'],
            'email' => $payload['email'] ?? null,
        ];
    }

    private function jwkToPem(array $jwk): string
    {
        $modulus = base64_decode(strtr($jwk['n'], '-_', '+/'));
        $exponent = base64_decode(strtr($jwk['e'], '-_', '+/'));

        $modLen = strlen($modulus);
        $expLen = strlen($exponent);

        $modulus = ltrim($modulus, "\x00");
        if (ord($modulus[0]) > 0x7f) {
            $modulus = "\x00".$modulus;
        }

        $encMod = $this->asn1Length(strlen($modulus)).$modulus;
        $encExp = $this->asn1Length($expLen).$exponent;

        $seq = "\x02".$encMod."\x02".$encExp;
        $seq = "\x30".$this->asn1Length(strlen($seq)).$seq;

        $bitString = "\x00".$seq;
        $bitString = "\x03".$this->asn1Length(strlen($bitString)).$bitString;

        $oid = "\x30\x0d\x06\x09\x2a\x86\x48\x86\xf7\x0d\x01\x01\x01\x05\x00";

        $der = "\x30".$this->asn1Length(strlen($oid) + strlen($bitString)).$oid.$bitString;

        return "-----BEGIN PUBLIC KEY-----\n".chunk_split(base64_encode($der), 64, "\n")."-----END PUBLIC KEY-----\n";
    }

    private function asn1Length(int $length): string
    {
        if ($length < 0x80) {
            return chr($length);
        }
        $temp = ltrim(pack('N', $length), "\x00");

        return chr(0x80 | strlen($temp)).$temp;
    }

    // ── Shared social auth ───────────────────────────────────────────────

    private function authenticateSocial(string $providerKey, string $providerId, ?string $email, ?string $name)
    {
        $user = User::where($providerKey, $providerId)->first();

        if (! $user && $email) {
            $user = User::where('email', $email)->first();
        }

        if (! $user) {
            if (! $email) {
                return ApiResponse::fail('Email is required to create an account.', [], 422);
            }

            $user = User::create([
                'name' => $name ?: Str::before($email, '@'),
                'email' => $email,
                'password' => Hash::make(Str::random(48)),
                $providerKey => $providerId,
                'email_verified_at' => now(),
            ]);

            return ApiResponse::ok([
                'user' => $user->only('id', 'name', 'email'),
                'token' => $user->createToken('mobile', ['*'], now()->addDays(30))->plainTextToken,
                'is_new_user' => true,
            ]);
        }

        if (! $user->{$providerKey}) {
            $user->update([$providerKey => $providerId]);
        }

        if (! $user->email_verified_at) {
            $user->update(['email_verified_at' => now()]);
        }

        return ApiResponse::ok([
            'user' => $user->only('id', 'name', 'email'),
            'token' => $user->createToken('mobile', ['*'], now()->addDays(30))->plainTextToken,
            'is_new_user' => false,
        ]);
    }
}
