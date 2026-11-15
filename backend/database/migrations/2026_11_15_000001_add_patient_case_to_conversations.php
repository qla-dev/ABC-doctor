<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->json('patient_case')->nullable();
        });
        Schema::table('messages', function (Blueprint $table) {
            $table->string('realtime_item_id', 100)->nullable();
            $table->unique(['conversation_id', 'realtime_item_id']);
        });
    }

    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropUnique(['conversation_id', 'realtime_item_id']);
            $table->dropColumn('realtime_item_id');
        });
        Schema::table('conversations', fn (Blueprint $table) => $table->dropColumn('patient_case'));
    }
};
