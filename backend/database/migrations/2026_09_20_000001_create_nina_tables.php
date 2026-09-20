<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * The messaging protocol Nina speaks: what she can be asked to be, the threads that hold a
 * conversation with her, and the turns inside one.
 *
 * Deliberately not the Lena schema. That one hangs conversations off companies and loads, and
 * there is nothing here to hang them off yet.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nina_skills', function (Blueprint $table) {
            $table->id();

            /**
             * Sub-skills, the way Lena nests hers. Nothing creates one yet; the column is here so
             * the first one does not need a migration against a table that already holds threads.
             */
            $table->foreignId('parent_id')->nullable()
                ->constrained('nina_skills')->cascadeOnDelete()->cascadeOnUpdate();

            /** Stable identifier the clients switch on. Names are display, keys are contract. */
            $table->string('key')->unique();
            $table->string('name');
            $table->text('description')->nullable();

            /**
             * What a skill will accept. Two booleans rather than one enum, because "text only",
             * "voice only" and "both" are the three states they already make, and a fourth skill
             * that grows voice later flips a flag instead of migrating an enum.
             */
            $table->boolean('supports_text')->default(true);
            $table->boolean('supports_voice')->default(false);

            $table->unsignedSmallInteger('position')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nina_skill_id')
                ->constrained('nina_skills')->restrictOnDelete()->cascadeOnUpdate();
            $table->string('title')->nullable();
            /** Denormalised so a thread list orders without touching every message. */
            $table->timestamp('last_message_at')->nullable()->index();
            $table->timestamps();
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')
                ->constrained('conversations')->cascadeOnDelete()->cascadeOnUpdate();

            /** Who spoke: `user` or `assistant`. A `system` turn is allowed but never shown. */
            $table->string('role', 16);
            $table->text('body');
            /** How it was spoken: `text` or `voice`. Checked against the skill's flags on write. */
            $table->string('modality', 16)->default('text');
            /** Room for what a real model call will want to record — tokens, latency, audio ids. */
            $table->json('meta')->nullable();
            $table->timestamp('sent_at')->index();
            $table->timestamps();
        });

        /**
         * The four skills ship as data in the migration rather than a seeder, so a fresh database
         * is one `migrate` away from usable and nobody has to remember a second command.
         */
        $now = now();
        DB::table('nina_skills')->insert([
            [
                'key' => 'patient_simulator',
                'name' => 'Simulator pacijenta',
                'description' => 'Nina glumi pacijenta. Ti uzimaš anamnezu, pregledaš i postavljaš dijagnozu.',
                'supports_text' => true,
                'supports_voice' => true,
                'position' => 1,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'consultant',
                'name' => 'Konsultant',
                'description' => 'Drugo mišljenje o slučaju: diferencijalna, sljedeći korak, zamke.',
                'supports_text' => true,
                'supports_voice' => true,
                'position' => 2,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'dictaphone',
                'name' => 'Diktafon',
                'description' => 'Diktiraš nalaz, Nina ga zapisuje i sređuje. Bez kucanja.',
                'supports_text' => false,
                'supports_voice' => true,
                'position' => 3,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'study_buddy',
                'name' => 'Drug za učenje',
                'description' => 'Ispituje te, objašnjava i vraća se na ono što ti ne ide.',
                'supports_text' => true,
                'supports_voice' => false,
                'position' => 4,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
        Schema::dropIfExists('conversations');
        Schema::dropIfExists('nina_skills');
    }
};
