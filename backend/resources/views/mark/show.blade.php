@extends('nina.layout', ['title' => 'Nina — razgovor #'.$conversation->id])

@section('content')
    <h1>#{{ $conversation->id }} · {{ $conversation->skill?->name }}</h1>
    <div class="sub">
        {{ $conversation->modality }}
        @if ($conversation->voice) · glas {{ $conversation->voice }} @endif
        @if ($conversation->context) · {{ $conversation->context }} @endif
    </div>

    @forelse ($conversation->messages as $message)
        @php
            $meta = $message->meta ?? [];
            // Which half of the system produced this line is the question this page exists to
            // answer: a transcript came off the phone, a model line was written on the server.
            $source = isset($meta['transcript']) ? 'transkript s telefona'
                : ($meta['model'] ?? (isset($meta['stub']) ? 'stub: '.($meta['reason'] ?? '') : '—'));
        @endphp
        <div class="turn {{ $message->role }}">
            <div>
                <div class="bubble">{{ $message->body }}</div>
                <div class="src" style="text-align: {{ $message->role === 'user' ? 'right' : 'left' }}">
                    {{ $message->role }} · {{ $message->modality }} · {{ $source }}
                    · {{ $message->sent_at?->format('H:i:s') }}
                </div>
            </div>
        </div>
    @empty
        <div class="empty">Nijedna poruka.</div>
    @endforelse
@endsection
