<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    /*
     * The model Mark speaks through. OpenRouter because it is how model calls are made in the
     * sibling repos, and because one key reaches every model rather than one key per provider.
     *
     * With no key set, MarkResponder falls back to a canned reply and says so in the message's
     * meta — the app keeps working locally and the reason is legible instead of a 500.
     */
    'openrouter' => [
        'key' => env('OPENROUTER_API_KEY'),
        'model' => env('OPENROUTER_MODEL', 'google/gemini-2.5-flash'),
        /** Tried when the primary refuses — a dead slug, a rate limit, a model pulled overnight. */
        'fallback_model' => env('OPENROUTER_FALLBACK_MODEL', 'anthropic/claude-3.5-haiku'),
        'base_url' => env('OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1'),
        'timeout' => (int) env('OPENROUTER_TIMEOUT', 60),
    ],

    /*
     * Voice does NOT go through OpenRouter. A realtime model is not something OpenRouter lets a
     * caller select, so the spoken path talks to OpenAI directly and keeps its own key.
     */
    'openai' => [
        'key' => env('OPENAI_API_KEY'),
        'realtime_model' => env('OPENAI_REALTIME_MODEL', 'gpt-realtime-2.1'),
        'realtime_voice' => env('OPENAI_REALTIME_VOICE', 'verse'),
        'transcribe_model' => env('OPENAI_TRANSCRIBE_MODEL', 'gpt-4o-transcribe'),
        /**
         * The transcriber behind the live preview, which is a different session type and not
         * necessarily the same model. Defaults to the one above because that is the one this
         * account is known to be able to call; 'gpt-live-transcribe' is the newer one OpenAI
         * recommends for transcription sessions, and this is the line to change for it.
         */
        'live_transcribe_model' => env('OPENAI_LIVE_TRANSCRIBE_MODEL', env('OPENAI_TRANSCRIBE_MODEL', 'gpt-4o-transcribe')),
        /** A Latin-script code on purpose: `sr` would come back in Cyrillic. */
        'transcribe_language' => env('OPENAI_TRANSCRIBE_LANGUAGE', 'hr'),
        'transcribe_prompt' => env('OPENAI_TRANSCRIBE_PROMPT',
            'Razgovor doktora i pacijenta, na bosanskom, latinicom. '
            .'Anamneza, tegobe, bol, mučnina, dispneja, palpitacije, otok, vrtoglavica, '
            .'EKG, troponin, saturacija, krvni tlak, puls, temperatura, terapija, dijagnoza.'),
        /** near_field for a phone at the ear, far_field for a room or a loudspeaker. */
        'noise_reduction' => env('OPENAI_NOISE_REDUCTION', 'far_field'),
        'base_url' => env('OPENAI_BASE_URL', 'https://api.openai.com/v1'),
    ],

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];
