@extends('mark.layout', ['title' => 'Mark — vještine'])

@section('content')
    <h1>Vještine</h1>
    <div class="sub">{{ $skills->count() }} u katalogu · mijenjaj tekst ovdje umjesto migracijom</div>

    @foreach ($skills as $skill)
        <a class="card" href="{{ route('mark.skill', $skill) }}">
            <div class="row">
                <div class="grow">
                    <div class="name">{{ $skill->position }}. {{ $skill->name }}</div>
                    <div class="meta">{{ $skill->key }} · {{ $skill->description }}</div>
                </div>
                @if ($skill->supports_text)<span class="tag text">tekst</span>@endif
                @if ($skill->supports_voice)<span class="tag voice">glas</span>@endif
            </div>
        </a>
    @endforeach
@endsection
