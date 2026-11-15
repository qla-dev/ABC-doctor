<?php

namespace Tests\Feature;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ConversationModesTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        if (DB::connection()->getDriverName() !== 'sqlite' || DB::connection()->getDatabaseName() !== ':memory:') throw new \RuntimeException('Only in-memory SQLite permitted.');
        $this->artisan('migrate', ['--no-interaction' => true])->assertSuccessful();
        $this->actingAs(User::factory()->create(), 'sanctum');
        config(['services.openrouter.key' => 'test', 'services.openai.key' => 'test']);
        Http::preventStrayRequests();
        Http::fake([
            '*chat/completions' => Http::response(['choices' => [['message' => ['content' => 'Test reply.']]]]),
            '*realtime/client_secrets' => Http::response(['value' => 'test', 'expires_at' => 1, 'session' => ['model' => 'realtime']]),
        ]);
    }

    public function test_modes_choose_the_opening_engine_and_validate_role_input(): void
    {
        foreach (['high_quality_voice', 'low_quality_voice', 'speech_text', 'text_speech', 'text_text'] as $mode) {
            $thread = $this->postJson('/api/conversations', ['skill' => 'patient_simulator', 'mode' => $mode])->assertCreated()->json('data');
            $this->assertCount($mode === 'high_quality_voice' ? 0 : 1, $thread['messages']);
        }
        $this->postJson('/api/conversations', ['skill' => 'dictaphone', 'mode' => 'text_text'])->assertUnprocessable();
        $this->postJson('/api/conversations', ['skill' => 'dictaphone', 'mode' => 'low_quality_voice'])->assertCreated();
    }

    public function test_retrying_backend_turn_after_lost_response_does_not_answer_twice(): void
    {
        $id = $this->postJson('/api/conversations', ['skill' => 'consultant', 'mode' => 'text_text'])->assertCreated()->json('data.id');
        $request = ['conversation_id' => $id, 'mode' => 'text_text', 'body' => 'Hello', 'client_turn_id' => 'd38f7088-d297-45b4-9dc9-d7e49f5542d1'];
        $first = $this->postJson('/api/messages', $request)->assertCreated()->json('data');
        $second = $this->postJson('/api/messages', $request)->assertCreated()->json('data');
        $this->assertEquals($first, $second);
        $this->assertSame(2, Conversation::find($id)->messages()->count());
        Http::assertSentCount(1);
        $this->postJson('/api/messages', array_replace($request, ['body' => 'Different']))->assertConflict();
    }

    public function test_switching_engine_preserves_context_and_does_not_open_again(): void
    {
        $id = $this->postJson('/api/conversations', ['skill' => 'patient_simulator', 'mode' => 'high_quality_voice'])->assertCreated()->json('data.id');
        $this->postJson('/api/mark/realtime/transcript', ['conversation_id' => $id, 'role' => 'assistant', 'body' => 'My foot hurts.', 'item_id' => 'opening'])->assertCreated();
        $this->postJson('/api/messages', ['conversation_id' => $id, 'mode' => 'speech_text', 'body' => 'Since when?'])->assertCreated();
        $this->postJson('/api/mark/realtime/session', ['conversation_id' => $id, 'mode' => 'high_quality_voice'])->assertOk()->assertJsonPath('data.opens_conversation', false)->assertJsonCount(3, 'data.history');
        $this->postJson('/api/mark/realtime/session', ['conversation_id' => $id, 'mode' => 'low_quality_voice'])->assertUnprocessable();
        $this->postJson('/api/messages', ['conversation_id' => $id, 'mode' => 'high_quality_voice', 'body' => 'Wrong engine'])->assertUnprocessable();
    }

    public function test_failed_ai_turn_can_be_retried_without_a_canned_or_duplicate_reply(): void
    {
        $id = $this->postJson('/api/conversations', ['skill' => 'consultant', 'mode' => 'text_text'])->assertCreated()->json('data.id');
        config(['services.openrouter.key' => '']);
        $request = ['conversation_id' => $id, 'mode' => 'text_text', 'body' => 'Hello', 'client_turn_id' => 'd38f7088-d297-45b4-9dc9-d7e49f5542d1'];
        $this->postJson('/api/messages', $request)->assertStatus(503);
        $this->assertSame(0, Conversation::find($id)->messages()->count());
        config(['services.openrouter.key' => 'test']);
        $this->postJson('/api/messages', $request)->assertCreated();
        $this->assertSame(2, Conversation::find($id)->messages()->count());
    }

    public function test_quiet_role_uses_openai_voice_input_with_text_output(): void
    {
        $id = $this->postJson('/api/conversations', ['skill' => 'whisperer', 'mode' => 'high_quality_voice'])->assertCreated()->json('data.id');
        $this->postJson('/api/mark/realtime/session', ['conversation_id' => $id, 'mode' => 'high_quality_voice'])->assertOk();
        Http::assertSent(fn ($request) => $request['session']['output_modalities'] === ['text']);
    }
}
