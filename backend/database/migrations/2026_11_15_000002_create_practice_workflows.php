<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $t) {
            $t->boolean('is_admin')->default(false);
            $t->json('disabled_workflows')->nullable();
        });
        Schema::table('conversations', fn (Blueprint $t) => $t->foreignId('user_id')->nullable()->constrained());
        Schema::create('personal_access_tokens', function (Blueprint $t) {
            $t->id();
            $t->morphs('tokenable');
            $t->text('name');
            $t->string('token', 64)->unique();
            $t->text('abilities')->nullable();
            $t->timestamp('last_used_at')->nullable();
            $t->timestamp('expires_at')->nullable()->index();
            $t->timestamps();
        });
        Schema::create('workflows', function (Blueprint $t) {
            $t->id();
            $t->string('starter_key')->nullable()->unique();
            $t->string('name');
            $t->text('purpose');
            $t->text('brief');
            $t->json('stages');
            $t->json('criteria');
            $t->text('advanced')->nullable();
            $t->boolean('archived')->default(false);
            $t->json('published')->nullable();
            $t->timestamps();
        });
        Schema::create('scenario_cases', function (Blueprint $t) {
            $t->id();
            $t->foreignId('workflow_id')->constrained();
            $t->string('starter_key')->nullable()->unique();
            $t->string('name');
            $t->text('story');
            $t->text('visible');
            $t->text('discover');
            $t->text('explanation');
            $t->json('criteria')->nullable();
            $t->text('references')->nullable();
            $t->boolean('archived')->default(false);
            $t->json('published')->nullable();
            $t->timestamps();
        });
        Schema::create('practice_attempts', function (Blueprint $t) {
            $t->id();
            $t->foreignId('conversation_id')->unique()->constrained();
            $t->foreignId('workflow_id')->constrained();
            $t->foreignId('user_id')->constrained();
            $t->json('snapshot');
            $t->string('status')->default('active');
            $t->json('report')->nullable();
            $t->unsignedInteger('evaluation_revision')->default(0);
            $t->timestamps();
        });
        Schema::create('practice_events', function (Blueprint $t) {
            $t->id();
            $t->foreignId('practice_attempt_id')->constrained();
            $t->string('event_key', 100);
            $t->string('kind');
            $t->json('payload');
            $t->timestamps();
            $t->unique(['practice_attempt_id', 'event_key']);
        });
    }

    public function down(): void
    { /* Forward-only: preserve practice and user data. */
    }
};
