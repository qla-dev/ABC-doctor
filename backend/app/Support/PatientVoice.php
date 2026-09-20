<?php

namespace App\Support;

/**
 * Which OpenAI voice a patient gets.
 *
 * The names carry no sex in the API, so the mapping lives here rather than being guessed at the
 * call site. Several per sex, because a simulator that always sounds like the same two people
 * stops feeling like a new patient by the third case.
 */
class PatientVoice
{
    /** @var list<string> */
    private const MALE = ['ash', 'echo', 'verse'];

    /** @var list<string> */
    private const FEMALE = ['coral', 'sage', 'shimmer'];

    /**
     * @param  string|null  $sex  `M`, `F`, or anything else for "let the case decide"
     */
    public static function for(?string $sex): string
    {
        $pool = match (strtoupper((string) $sex)) {
            'M' => self::MALE,
            'F' => self::FEMALE,
            // The setup screen's "Svejedno" is a real choice, not a missing one: the patient's sex
            // is part of the case being generated, so it is rolled here along with the voice.
            default => [...self::MALE, ...self::FEMALE],
        };

        return $pool[array_rand($pool)];
    }

    /** True when the name is one this app hands out, so stored values can be trusted. */
    public static function known(?string $voice): bool
    {
        return in_array((string) $voice, [...self::MALE, ...self::FEMALE], true);
    }
}
