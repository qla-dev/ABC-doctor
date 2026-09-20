<?php

declare(strict_types=1);

/**
 * Redeploy, triggered from a browser.
 *
 * Taken from freightbook's `backend/public/redeploy.php`, which exists for the same reason this
 * one does: the host is cPanel shared hosting with no SSH worth using and no CI runner, so the
 * only way to pull a change onto it is to ask the web server to do it. Output is streamed as it
 * happens rather than buffered, because a Composer install on a shared host takes minutes and a
 * blank page for two of them is indistinguishable from a hang.
 *
 * What it does NOT do is migrate. That is deliberate and it is not an omission to fix casually:
 * a schema change arriving with a code push, unattended, against a database nobody is looking
 * at, is how a deploy becomes an incident. Run `php artisan migrate` yourself, having checked
 * which database answers.
 *
 * It is also not authenticated, exactly as freightbook's is not. Anyone who finds the URL can
 * run `git pull` and `composer install` on this account, so the URL is the only thing keeping
 * them out — worth knowing when choosing where this file lives.
 */

set_time_limit(0);
ini_set('memory_limit', '512M');
ini_set('output_buffering', '0');
ini_set('zlib.output_compression', '0');

$baseDir = dirname(__DIR__);
chdir($baseDir);
putenv('COMPOSER_ALLOW_SUPERUSER=1');
putenv('COMPOSER_NO_INTERACTION=1');

$environmentFile = $baseDir.DIRECTORY_SEPARATOR.'.env';

/**
 * A DB_HOST pasted as a URL is a real mistake people make, and the failure it produces — a
 * connection refused to a host whose name begins with "https" — says nothing about the cause.
 */
if (is_file($environmentFile)) {
    $environment = file_get_contents($environmentFile);

    if (is_string($environment)) {
        $normalizedEnvironment = preg_replace('/^(DB_HOST=)https?:\/\//m', '$1', $environment);

        if (is_string($normalizedEnvironment) && $normalizedEnvironment !== $environment) {
            file_put_contents($environmentFile, $normalizedEnvironment, LOCK_EX);
        }
    }
}

/**
 * Composer wants a home directory, and the one the web server user has is either missing or not
 * writable. Keeping both inside the project is what stops every install from starting cold.
 */
$composerHome = $baseDir.DIRECTORY_SEPARATOR.'.composer';
$composerCache = $composerHome.DIRECTORY_SEPARATOR.'cache';

foreach ([$composerHome, $composerCache] as $directory) {
    if (! is_dir($directory)) {
        mkdir($directory, 0755, true);
    }
}

putenv('HOME='.$composerHome);
putenv('COMPOSER_HOME='.$composerHome);
putenv('COMPOSER_CACHE_DIR='.$composerCache);

if (PHP_SAPI !== 'cli') {
    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-Control: no-cache');
    header('X-Accel-Buffering: no');
}

while (ob_get_level() > 0) {
    ob_end_flush();
}
ob_implicit_flush(true);

$startedAt = time();
$write = static function (string $message): void {
    echo $message;
    flush();
};
$shellArg = static fn (string $value): string => escapeshellarg($value);

$findExecutable = static function (array $commands): ?string {
    foreach ($commands as $command) {
        if (str_contains($command, DIRECTORY_SEPARATOR) && is_file($command) && is_executable($command)) {
            return $command;
        }

        $check = PHP_OS_FAMILY === 'Windows'
            ? 'where '.escapeshellarg($command)
            : 'command -v '.escapeshellarg($command);
        $output = [];
        exec($check, $output, $exitCode);
        if ($exitCode === 0 && isset($output[0]) && $output[0] !== '') {
            return trim($output[0]);
        }
    }

    return null;
};

$downloadComposer = static function (string $targetFile, callable $write): bool {
    $composerUrl = 'https://getcomposer.org/download/latest-stable/composer.phar';
    $write("Composer was not found. Downloading local composer.phar...\n");

    $composerPhar = @file_get_contents($composerUrl);

    if ($composerPhar === false) {
        $write("Could not download Composer from {$composerUrl}.\n");
        $write("Ensure allow_url_fopen is enabled, or upload composer.phar to the project root.\n");

        return false;
    }

    if (@file_put_contents($targetFile, $composerPhar) === false) {
        $write("Could not write Composer to {$targetFile}. Check directory permissions.\n");

        return false;
    }

    $write("Saved local Composer to {$targetFile}.\n");

    return true;
};

/**
 * The PHP running the web request is not necessarily one that can run Artisan; on cPanel the CLI
 * binary lives under the selected EA build. The list ends with the ones this project can use —
 * Laravel 12 needs 8.2 or newer.
 */
$php = $findExecutable(array_filter([
    PHP_SAPI === 'cli' ? PHP_BINARY : null,
    'php',
    '/usr/local/bin/php',
    '/usr/bin/php',
    '/opt/cpanel/ea-php82/root/usr/bin/php',
    '/opt/cpanel/ea-php83/root/usr/bin/php',
    '/opt/cpanel/ea-php84/root/usr/bin/php',
]));

if ($php === null) {
    $write("Could not find CLI PHP.\n");
    exit(127);
}

$phpCommand = $shellArg($php);
$composerPhar = $baseDir.DIRECTORY_SEPARATOR.'composer.phar';
$composer = null;

if (is_file($composerPhar)) {
    $composer = $phpCommand.' '.$shellArg($composerPhar);
} else {
    $globalComposer = $findExecutable(['composer']);

    if ($globalComposer !== null) {
        $composer = $shellArg($globalComposer);
    } elseif ($downloadComposer($composerPhar, $write)) {
        $composer = $phpCommand.' '.$shellArg($composerPhar);
    }
}

if ($composer === null) {
    exit(127);
}

/**
 * Runs one command and relays its output line by line as it arrives.
 *
 * The pipes are non-blocking and polled, rather than read to completion, so a long step reports
 * progress instead of appearing to hang; a step that says nothing for fifteen seconds gets a
 * line of its own saying it is still going, which is what keeps a proxy from closing the
 * connection on an idle response.
 */
$runCommand = static function (string $command, string $cwd, callable $write): int {
    $process = proc_open($command, [
        0 => ['pipe', 'r'],
        1 => ['pipe', 'w'],
        2 => ['pipe', 'w'],
    ], $pipes, $cwd);

    if (! is_resource($process)) {
        $write("Failed to start command: {$command}\n");

        return 1;
    }

    fclose($pipes[0]);
    stream_set_blocking($pipes[1], false);
    stream_set_blocking($pipes[2], false);
    $lastOutputAt = time();
    $exitCode = null;

    do {
        foreach ([1, 2] as $pipeNumber) {
            while (($line = fgets($pipes[$pipeNumber])) !== false) {
                $lastOutputAt = time();
                $write($line);
            }
        }

        $status = proc_get_status($process);
        if (! $status['running']) {
            $exitCode = $status['exitcode'];
            break;
        }

        if (time() - $lastOutputAt >= 15) {
            $lastOutputAt = time();
            $write('... still running at '.date('H:i:s')."\n");
        }
        usleep(100000);
    } while (true);

    foreach ([1, 2] as $pipeNumber) {
        while (($line = fgets($pipes[$pipeNumber])) !== false) {
            $write($line);
        }
        fclose($pipes[$pipeNumber]);
    }

    $closeCode = proc_close($process);

    return is_int($exitCode) && $exitCode >= 0 ? $exitCode : $closeCode;
};

/**
 * Cleared first, then cached. Rebuilding the config cache last is what makes the new `.env`
 * take effect; leaving it cleared would work too, and cost a file read on every request.
 */
$commands = [
    ['label' => 'Pulling latest code', 'command' => 'git pull --ff-only'],
    ['label' => 'Installing Composer dependencies', 'command' => $composer.' install --no-interaction --prefer-dist --no-progress --optimize-autoloader --no-dev --no-ansi'],
    ['label' => 'Clearing Laravel config cache', 'command' => $phpCommand.' artisan config:clear --no-ansi'],
    ['label' => 'Clearing Laravel route cache', 'command' => $phpCommand.' artisan route:clear --no-ansi'],
    ['label' => 'Clearing Laravel view cache', 'command' => $phpCommand.' artisan view:clear --no-ansi'],
    ['label' => 'Clearing Laravel application cache', 'command' => $phpCommand.' artisan cache:clear --no-ansi'],
    ['label' => 'Rebuilding Laravel config cache', 'command' => $phpCommand.' artisan config:cache --no-ansi'],
];

foreach ($commands as $step) {
    $write("\n=== {$step['label']} ===\n");
    $write("Command: {$step['command']}\n");
    $exitCode = $runCommand($step['command'], $baseDir, $write);
    if ($exitCode !== 0) {
        $write("{$step['label']} failed with exit code {$exitCode}.\n");
        exit($exitCode);
    }
}

$write("\nRedeploy completed successfully in ".(time() - $startedAt)."s.\n");
$write("Schema changes are not part of this. Run `php artisan migrate` yourself.\n");
