<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RevenueCatVerifier
{
    private string $secretKey;
    private bool $allowSandbox;

    public function __construct()
    {
        $this->secretKey = config('services.revenuecat.secret_key');
        $this->allowSandbox = (bool) config('services.revenuecat.allow_sandbox');
    }

    public function verifyPurchase(string $appUserId, string $productId): ?array
    {
        $subscriber = $this->fetchSubscriber($appUserId);
        if (! $subscriber) {
            return null;
        }

        $purchase = $subscriber['non_subscriptions'][$productId] ?? null;
        if ($purchase) {
            $latest = end($purchase);
            if (! $this->allowSandbox && ($latest['store'] ?? '') === 'sandbox') {
                return null;
            }
            return $latest;
        }

        $sub = $subscriber['subscriptions'][$productId] ?? null;
        if ($sub) {
            if (! $this->allowSandbox && ($sub['store'] ?? '') === 'sandbox') {
                return null;
            }
            if (! empty($sub['unsubscribe_detected_at']) && now()->greaterThan($sub['expires_date'])) {
                return null;
            }
            return $sub;
        }

        return null;
    }

    public function activeSubscription(string $appUserId): ?array
    {
        $subscriber = $this->fetchSubscriber($appUserId);
        if (! $subscriber) {
            return null;
        }

        foreach ($subscriber['subscriptions'] ?? [] as $productId => $sub) {
            if (! $this->allowSandbox && ($sub['store'] ?? '') === 'sandbox') {
                continue;
            }
            if (! empty($sub['expires_date']) && now()->greaterThan($sub['expires_date'])) {
                continue;
            }
            return ['product_id' => $productId, ...$sub];
        }

        return null;
    }

    public function activeWebSubscription(string $appUserId): ?array
    {
        $subscriber = $this->fetchSubscriber($appUserId);
        if (! $subscriber) {
            return null;
        }

        foreach ($subscriber['subscriptions'] ?? [] as $productId => $sub) {
            $store = $sub['store'] ?? '';
            if ($store !== 'rc_billing' && $store !== 'stripe') {
                continue;
            }
            if (! $this->allowSandbox && $store === 'sandbox') {
                continue;
            }
            if (! empty($sub['expires_date']) && now()->greaterThan($sub['expires_date'])) {
                continue;
            }
            return ['product_id' => $productId, ...$sub];
        }

        return null;
    }

    private function fetchSubscriber(string $appUserId): ?array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->secretKey,
            'Content-Type' => 'application/json',
        ])->get("https://api.revenuecat.com/v1/subscribers/{$appUserId}");

        if (! $response->successful()) {
            Log::warning('RevenueCat subscriber fetch failed', [
                'app_user_id' => $appUserId,
                'status' => $response->status(),
            ]);
            return null;
        }

        return $response->json('subscriber');
    }
}
