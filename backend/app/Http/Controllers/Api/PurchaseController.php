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

class PurchaseController extends Controller
{
    private const PRODUCT_MAP = [
        'abc.qla.dev.messages100' => ['messages' => 100, 'minutes' => 0],
        'abc.qla.dev.messages200' => ['messages' => 200, 'minutes' => 0],
        'abc.qla.dev.voice30'    => ['messages' => 0,   'minutes' => 30],
        'abc.qla.dev.voice60'    => ['messages' => 0,   'minutes' => 60],
        'abc.qla.dev.voice180'   => ['messages' => 0,   'minutes' => 180],
    ];

    private const SUBSCRIPTION_MAP = [
        'abc.qla.dev.basic.monthly' => ['tier' => 'basic', 'months' => 1],
        'abc.qla.dev.basic.annual'  => ['tier' => 'basic', 'months' => 12],
        'abc.qla.dev.pro.monthly'   => ['tier' => 'pro',   'months' => 1],
        'abc.qla.dev.pro.annual'    => ['tier' => 'pro',   'months' => 12],
    ];

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        return $this->balanceResponse($user);
    }

    public function grant(Request $request, RevenueCatVerifier $verifier): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|string',
            'rc_app_user_id' => 'required|string',
            'store' => 'nullable|string',
        ]);

        $productId = $request->input('product_id');
        $rcUserId = $request->input('rc_app_user_id');
        $allProducts = array_merge(array_keys(self::PRODUCT_MAP), array_keys(self::SUBSCRIPTION_MAP));

        if (! in_array($productId, $allProducts, true)) {
            return ApiResponse::fail('Unknown product.', ['product_id' => ['Product not recognized.']], 422);
        }

        $verified = $verifier->verifyPurchase($rcUserId, $productId);
        if (! $verified) {
            return ApiResponse::fail('Purchase could not be verified with RevenueCat.', [], 402);
        }

        if (isset(self::SUBSCRIPTION_MAP[$productId])) {
            $existing = Purchase::where('rc_app_user_id', $rcUserId)
                ->where('product_id', $productId)
                ->whereNotNull('granted_at')
                ->first();
            if ($existing) {
                return $this->balanceResponse($request->user(), 'Already granted.');
            }
        }

        $user = $request->user();
        $store = $request->input('store', $verified['store'] ?? 'app_store');

        DB::transaction(function () use ($user, $productId, $rcUserId, $store) {
            $user = User::lockForUpdate()->find($user->id);

            if (isset(self::PRODUCT_MAP[$productId])) {
                $amounts = self::PRODUCT_MAP[$productId];
                $user->increment('messages_balance', $amounts['messages']);
                $user->increment('voice_minutes_balance', $amounts['minutes']);

                Purchase::create([
                    'user_id' => $user->id,
                    'product_id' => $productId,
                    'store' => $store,
                    'rc_app_user_id' => $rcUserId,
                    'amount_messages' => $amounts['messages'],
                    'amount_voice_minutes' => $amounts['minutes'],
                    'granted_at' => now(),
                ]);
            } elseif (isset(self::SUBSCRIPTION_MAP[$productId])) {
                $sub = self::SUBSCRIPTION_MAP[$productId];
                $user->update([
                    'subscription_tier' => $sub['tier'],
                    'subscription_expires_at' => now()->addMonths($sub['months']),
                ]);

                Purchase::create([
                    'user_id' => $user->id,
                    'product_id' => $productId,
                    'store' => $store,
                    'rc_app_user_id' => $rcUserId,
                    'granted_at' => now(),
                ]);
            }
        });

        $user->refresh();

        return $this->balanceResponse($user, 'Purchase granted.');
    }

    public function recharge(Request $request): JsonResponse
    {
        $user = $request->user();

        DB::transaction(function () use (&$user) {
            $user = User::lockForUpdate()->find($user->id);
            $user->increment('messages_balance', 100);
            $user->increment('voice_minutes_balance', 100);
        });

        return $this->balanceResponse($user, 'Recharged +100 messages, +100 minutes.');
    }

    private function balanceResponse($user, string $message = 'OK'): JsonResponse
    {
        return ApiResponse::ok([
            'messages' => $user->messages_balance,
            'voice_minutes' => $user->voice_minutes_balance,
            'subscription_tier' => $user->subscription_tier,
            'subscription_expires_at' => $user->subscription_expires_at?->toIso8601String(),
        ], $message);
    }
}
