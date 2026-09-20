<!DOCTYPE html>
<html lang="bs">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title ?? 'Nina' }}</title>
    <style>
        :root {
            --bg: #0b0b0d; --card: #1c1c1e; --line: #2c2c2e;
            --text: #f5f5f7; --muted: #8e8e93; --blue: #0a84ff; --indigo: #5e5ce6;
            --green: #30d158; --orange: #ff9f0a;
        }
        * { box-sizing: border-box; }
        body {
            margin: 0; padding: 24px; background: var(--bg); color: var(--text);
            font: 15px/1.5 -apple-system, "Segoe UI", system-ui, sans-serif;
        }
        .wrap { max-width: 900px; margin: 0 auto; }
        h1 { font-size: 24px; margin: 0 0 4px; }
        .sub { color: var(--muted); font-size: 13px; margin-bottom: 24px; }
        a { color: var(--blue); text-decoration: none; }
        a:hover { text-decoration: underline; }
        .card {
            display: block; background: var(--card); border: 1px solid var(--line);
            border-radius: 14px; padding: 14px 16px; margin-bottom: 10px; color: inherit;
        }
        .card:hover { border-color: var(--blue); text-decoration: none; }
        .row { display: flex; align-items: center; gap: 10px; }
        .grow { flex: 1; min-width: 0; }
        .name { font-weight: 700; }
        .meta { color: var(--muted); font-size: 12.5px; margin-top: 2px; }
        .tag {
            font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 999px;
            border: 1px solid currentColor; white-space: nowrap;
        }
        .voice { color: var(--indigo); }
        .text  { color: var(--blue); }
        /* Where a message came from is the whole point of this page, so it is never hidden. */
        .src { font-size: 11px; color: var(--muted); font-family: ui-monospace, Menlo, monospace; }
        .turn { display: flex; margin-bottom: 12px; }
        .turn.user { justify-content: flex-end; }
        .bubble { max-width: 76%; padding: 10px 14px; border-radius: 16px; background: var(--card); }
        .turn.user .bubble { background: var(--blue); }
        .field { display: block; margin-bottom: 14px; }
        .fieldLabel { display: block; color: var(--muted); font-size: 12.5px; margin-bottom: 6px; }
        input, textarea {
            width: 100%; background: var(--card); color: var(--text);
            border: 1px solid var(--line); border-radius: 12px; padding: 10px 12px;
            font: inherit; resize: vertical;
        }
        input:focus, textarea:focus { outline: none; border-color: var(--blue); }
        .check { color: var(--text); font-size: 13.5px; display: flex; align-items: center; gap: 6px; }
        .save {
            background: var(--blue); color: #fff; border: 0; border-radius: 12px;
            padding: 11px 22px; font: inherit; font-weight: 700; cursor: pointer;
        }
        /* One bar on every page, so no page has to grow its own way back. */
        .nav {
            display: flex; align-items: center; gap: 4px; margin-bottom: 22px;
            border-bottom: 1px solid var(--line); padding-bottom: 12px;
        }
        .nav .brand { font-weight: 700; margin-right: 12px; }
        .nav a {
            padding: 7px 13px; border-radius: 999px; font-size: 13.5px; font-weight: 600;
            color: var(--muted);
        }
        .nav a:hover { color: var(--text); text-decoration: none; }
        .nav a.on { background: var(--card); color: var(--text); }
        .empty { color: var(--muted); padding: 40px 0; text-align: center; }
    </style>
</head>
<body>
<div class="wrap">
    <nav class="nav">
        <span class="brand">Nina</span>
        <a href="{{ route('nina.index') }}" class="{{ request()->routeIs('nina.index', 'nina.show') ? 'on' : '' }}">Razgovori</a>
        <a href="{{ route('nina.skills') }}" class="{{ request()->routeIs('nina.skill*') ? 'on' : '' }}">Vještine</a>
    </nav>
    @yield('content')
</div>
</body>
</html>
