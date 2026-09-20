@extends('mark.layout', ['title' => 'Mark — '.$skill->name])

@section('content')
    <h1>{{ $skill->name }}</h1>
    <div class="sub">{{ $skill->key }}</div>

    @if (session('saved'))
        <div class="card" style="border-color: var(--green); color: var(--green)">Sačuvano.</div>
    @endif

    <form method="POST" action="{{ route('mark.skill.save', $skill) }}">
        @csrf
        @foreach ([
            'name' => 'Ime',
            'description' => 'Opis (vidi se na kartici)',
            'system_prompt' => 'System prompt — ko je ona, na vrhu svakog poziva',
            'opening_prompt' => 'Uvodna didaskalija — proizvede prvi turn, ne pamti se',
            'turn_reminder' => 'Podsjetnik — lijepi se na KRAJ system prompta',
            'voice_style' => 'Kako govori naglas — samo u glasovnoj sesiji',
        ] as $field => $label)
            <label class="field">
                <span class="fieldLabel">{{ $label }}</span>
                @if ($field === 'name' || $field === 'description')
                    <input name="{{ $field }}" value="{{ old($field, $skill->$field) }}">
                @else
                    <textarea name="{{ $field }}" rows="{{ $field === 'system_prompt' ? 12 : 4 }}">{{ old($field, $skill->$field) }}</textarea>
                @endif
            </label>
        @endforeach

        <div class="row" style="gap: 18px; margin: 14px 0">
            <label class="check"><input type="checkbox" name="supports_text" value="1" @checked($skill->supports_text)> prima tekst</label>
            <label class="check"><input type="checkbox" name="supports_voice" value="1" @checked($skill->supports_voice)> prima glas</label>
            <label class="check"><input type="checkbox" name="opens_conversation" value="1" @checked($skill->opens_conversation)> javlja se prva</label>
        </div>

        <button class="save" type="submit">Sačuvaj</button>
    </form>

    <div class="sub" style="margin-top: 18px">
        Mijenja se odmah, bez restarta — promptovi se čitaju iz baze na svaki poziv.
        Postojeći razgovori nose stari ton u svojoj historiji; otvori novi da vidiš razliku.
    </div>
@endsection
