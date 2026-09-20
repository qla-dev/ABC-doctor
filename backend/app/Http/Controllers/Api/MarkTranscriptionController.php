<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\NinaTranscription;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

/**
 * A voice message, on its way to becoming an ordinary one.
 *
 * The text is returned rather than posted into the thread, so the app decides what to do with
 * it. That is deliberate: `POST /messages` answers, and whether a recording should be answered
 * is the client's call — the same transcript might be sent as a turn or dropped into the
 * composer for a word to be corrected first.
 *
 * Base64 in JSON rather than multipart, the way freightbook's does it: a recording made on the
 * device is already a file the app would have to open either way, and one encoding is fewer
 * moving parts than a multipart body assembled in React Native.
 */
class NinaTranscriptionController extends Controller
{
    /**
     * Roughly two minutes of the m4a expo-audio records. Base64 inflates by a third, and the
     * request still has to fit inside PHP's own post_max_size.
     */
    private const MAX_BASE64_LENGTH = 4_000_000;

    public function store(Request $request, NinaTranscription $transcription): JsonResponse
    {
        $data = $request->validate([
            'audio' => ['required', 'string', 'max:'.self::MAX_BASE64_LENGTH],
            // What the endpoint can actually decode. The phone records m4a; the rest are here so
            // a build that changes the preset does not have to change the API with it.
            'format' => ['required', 'string', 'in:m4a,mp4,mp3,mpga,mpeg,wav,webm,ogg,flac'],
        ]);

        if (! $transcription->configured()) {
            return ApiResponse::fail(
                'Voice messages are not configured.',
                ['key' => ['OPENAI_API_KEY is not set.']],
                503,
            );
        }

        $audio = base64_decode($data['audio'], true);
        if ($audio === false || $audio === '') {
            return ApiResponse::fail('That recording could not be read.', ['audio' => ['Not valid base64.']]);
        }

        try {
            $text = $transcription->transcribe($audio, $data['format']);
        } catch (Throwable $exception) {
            return ApiResponse::fail('Speech recognition is temporarily unavailable.', [], 502);
        }

        return ApiResponse::ok(['text' => $text], 'Transcribed.');
    }
}
