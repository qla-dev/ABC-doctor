<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;

/**
 * Every response carries the same four keys, the way the freightbook API does: `message` for
 * people, `data` for the payload, `meta` for anything about the payload, `errors` for what went
 * wrong. A client that can read one endpoint can read all of them.
 */
class ApiResponse
{
    /** @param array<string, mixed> $meta */
    public static function ok(mixed $data = null, string $message = '', array $meta = [], int $status = 200): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'data' => $data,
            'meta' => $meta,
            'errors' => [],
        ], $status);
    }

    /** @param array<string, list<string>> $errors */
    public static function fail(string $message, array $errors = [], int $status = 422): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'data' => null,
            'meta' => [],
            'errors' => $errors,
        ], $status);
    }
}
