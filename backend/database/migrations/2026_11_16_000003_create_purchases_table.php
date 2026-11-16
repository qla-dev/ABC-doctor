<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('product_id');
            $table->string('store');
            $table->string('rc_app_user_id')->nullable();
            $table->unsignedInteger('amount_messages')->default(0);
            $table->unsignedInteger('amount_voice_minutes')->default(0);
            $table->dateTime('granted_at')->nullable();
            $table->timestamps();

            $table->index(['rc_app_user_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};
