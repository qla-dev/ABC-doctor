<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedInteger('messages_balance')->default(0)->after('apple_id');
            $table->unsignedInteger('voice_minutes_balance')->default(0)->after('messages_balance');
            $table->string('subscription_tier')->nullable()->after('voice_minutes_balance');
            $table->dateTime('subscription_expires_at')->nullable()->after('subscription_tier');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['messages_balance', 'voice_minutes_balance', 'subscription_tier', 'subscription_expires_at']);
        });
    }
};
