@extends('mark.layout', ['title' => 'Mark — razgovori'])

@section('content')
    <h1>Razgovori</h1>
    <div class="sub">{{ $conversations->count() }} najnovijih · baza {{ config('database.connections.'.config('database.default').'.database') }}</div>

    @forelse ($conversations as $conversation)
        <a class="card" href="{{ route('mark.show', $conversation) }}">
            <div class="row">
                <div class="grow">
                    <div class="name">#{{ $conversation->id }} · {{ $conversation->title ?? $conversation->skill?->name }}</div>
                    <div class="meta">
                        {{ $conversation->skill?->key }}
                        @if ($conversation->voice) · glas {{ $conversation->voice }} @endif
                        · {{ $conversation->messages_count }} poruka
                        @if ($conversation->last_message_at) · {{ $conversation->last_message_at->diffForHumans() }} @endif
                    </div>
                    @if ($conversation->context)
                        <div class="meta">{{ $conversation->context }}</div>
                    @endif
                </div>
                <span class="tag {{ $conversation->modality }}">{{ $conversation->modality }}</span>
            </div>
        </a>
    @empty
        <div class="empty">Još nema razgovora.</div>
    @endforelse
@endsection
