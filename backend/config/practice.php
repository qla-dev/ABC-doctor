<?php

return [
    // Shared hosting does not require a resident worker. Set to database when one is managed.
    'evaluation_connection' => env('PRACTICE_EVALUATION_QUEUE', 'sync'),
];
