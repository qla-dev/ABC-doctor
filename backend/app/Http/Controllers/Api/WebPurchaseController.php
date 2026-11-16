<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use App\Models\User;
use App\Services\RevenueCatVerifier;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WebPurchaseController extends Controller
{
    private const SUBSCRIPTION_MAP = [
        'abc.qla.dev.basic.monthly' => ['tier' => 'basic', 'months' => 1],
        'abc.qla.dev.basic.annual'  => ['tier' => 'basic', 'months' => 12],
        'abc.qla.dev.pro.monthly'   => ['tier' => 'pro',   'months' => 1],
        'abc.qla.dev.pro.annual'    => ['tier' => 'pro',   'months' => 12],
    ];

    public function claim(Request $request, RevenueCatVerifier $verifier): JsonResponse
    {
        $request->validate([
            'app_user_id' => 'required|string',
            'email' => 'required|email',
        ]);

        $appUserId = $request->input('app_user_id');
        $email = $request->input('email');

        $sub = $verifier->activeWebSubscription($appUserId);
        if (! $sub) {
            return ApiResponse::fail('No active web subscription found.', [], 402);
        }

        $productId = $sub['product_id'];
        $store = $sub['store'] ?? 'rc_billing';

        $user = User::where('email', $email)->first();
        if (! $user) {
            return ApiResponse::fail('No account found for this email. Please register first.', [], 404);
        }

        $existing = Purchase::where('rc_app_user_id', $appUserId)
            ->where('product_id', $productId)
            ->where('user_id', $user->id)
            ->whereNotNull('granted_at')
            ->first();

        if ($existing) {
            return ApiResponse::ok([
                'messages' => $user->messages_balance,
                'voice_minutes' => $user->voice_minutes_balance,
                'subscription_tier' => $user->subscription_tier,
                'subscription_expires_at' => $user->subscription_expires_at?->toIso8601String(),
            ], 'Subscription already active.');
        }

        if (isset(self::SUBSCRIPTION_MAP[$productId])) {
            $subMap = self::SUBSCRIPTION_MAP[$productId];

            DB::transaction(function () use ($user, $productId, $appUserId, $store, $subMap) {
                $user->lockForUpdate()->refresh();
                $user->update([
                    'subscription_tier' => $subMap['tier'],
                    'subscription_expires_at' => now()->addMonths($subMap['months']),
                ]);

                Purchase::create([
                    'user_id' => $user->id,
                    'product_id' => $productId,
                    'store' => $store,
                    'rc_app_user_id' => $appUserId,
                    'granted_at' => now(),
                ]);
            });

            $user->refresh();
        }

        return ApiResponse::ok([
            'messages' => $user->messages_balance,
            'voice_minutes' => $user->voice_minutes_balance,
            'subscription_tier' => $user->subscription_tier,
            'subscription_expires_at' => $user->subscription_expires_at?->toIso8601String(),
        ], 'Web purchase claimed.');
    }
}
