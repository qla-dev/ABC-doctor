<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class CreatePracticeAdmin extends Command
{
    protected $signature = 'practice:admin {email}';

    protected $description = 'Create the initial practice administrator (never changes an existing account)';

    public function handle(): int
    {
        $email = $this->argument('email');
        if (! filter_var($email, FILTER_VALIDATE_EMAIL) || User::where('email', $email)->exists()) {
            $this->error('Use a valid, new email address.');

            return 1;
        }
        $name = $this->ask('Name');
        $password = $this->secret('Password (at least 12 characters)');
        if (! $name || strlen($password ?? '') < 12) {
            $this->error('Name and a password of at least 12 characters are required.');

            return 1;
        }
        User::create(['name' => $name, 'email' => $email, 'password' => $password, 'is_admin' => true]);
        $this->info('Administrator created.');

        return 0;
    }
}
