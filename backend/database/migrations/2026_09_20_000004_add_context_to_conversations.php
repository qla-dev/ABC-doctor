<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * What this particular thread is about, beyond the skill.
 *
 * The simulator's setup screen picks a difficulty, a specialty, a sex and an age band. Without
 * somewhere to put that, the screen is decoration: Nina would invent a patient with no regard for
 * any of it. This is that somewhere — free text, appended to the skill's own instructions, so a
 * caller can say "58-year-old man, cardiology, hard" without the server learning what those mean.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->text('context')->nullable()->after('modality');
        });
    }

    public function down(): void
    {
        Schema::table('conversations', fn (Blueprint $table) => $table->dropColumn('context'));
    }
};
