# ABC Doctor — agent notes

Working notes from inspecting this repo and its reference repos on 2026-09-19. Read this
instead of re-reading the reference repos; open them only for the specific file named below.

## Layout

| Folder | What it is | State |
| --- | --- | --- |
| `backend/` | Laravel 12 API | Blank skeleton, nothing written yet |
| `frontend/` | Expo / React Native app | Blank `blank-typescript` scaffold |
| `web/` | AI Studio React prototype | Complete UI, all AI responses faked |
| `runtime/` | Dev-runtime tooling docs (native-sim) | Reference only, ships nothing |

## Stack versions, and why they are pinned there

- **Laravel 12.69.2** (`laravel/framework: ^12.0`), PHP 8.2.12 from XAMPP. Laravel 13 requires
  PHP ^8.3, so 12 is the ceiling until PHP is upgraded. 12 also matches `qla-dev/backend`.
- **Expo SDK 57.0.24**, React Native 0.86.3, React 19.2.3, TypeScript 6.0.3. SDK 58 exists only
  as `58.0.0-preview.3`; recheck `npm view expo dist-tags` before assuming it went stable.
  `qla-dev/fitness` is on the same 57 line.
- Node 26.3.0, npm 11.16.0, pnpm 10.33.4, Composer 2.10.1. No bun.

## Database safety — mandatory

House rule across all qla-dev repos; `qla-dev/backend/AGENTS.md` is the canonical copy.

- Never run `migrate:fresh`, `migrate:reset`, `migrate:refresh`, `db:wipe`, destructive
  rollbacks, truncation or mass deletion.
- Never run seeders or `migrate --seed` unless the user asks for that exact operation after
  being told which database it hits. Do not use `--force` to bypass production safeguards.
- Before any command that can write, verify the effective driver, host, port and database name
  with a read-only check. Do not trust `.env` alone — account for `.env.testing`, process env
  and cached config. A missing `.env.testing` is a hard stop for `--env=testing`.
- Run backend tests only with `DB_CONNECTION=sqlite DB_DATABASE=:memory:` set explicitly.
- The backend runs on **MySQL** now: `abc_doctor` on the local MariaDB (XAMPP, root, no
  password). `backend/database/database.sqlite` is still on disk but nothing points at it.
  Other databases share that server — `hajp`, `mahala`, `mojguru`, `snovi` — so a command
  that writes is never safe to run blind. Verify the effective database first, every time.

## What `web/` actually does

Important: **no AI calls exist.** `@google/genai` is a dependency but is imported nowhere, and
`GEMINI_API_KEY` is read nowhere.

- `web/src/services/AIService.ts` delegates to a skill and adds a 450 ms fake latency.
- `web/src/skills/definitions/*.ts` return hardcoded markdown chosen by keyword matching on the
  user's message (`lower.includes('simply')`, etc.). Seven skills: medical tutor, quiz generator,
  flashcard generator, clinical case, exam coach, triage, patient simulator.
- `web/src/skills/PromptBuilder.ts` composes a real system prompt from `SkillContext` (topic,
  quiz question, patient case, triage scenario, selected text) — built, then discarded unused.
- Each skill's real system prompt lives in its `systemInstructions` string. The matching
  `web/skills/*.md` file is referenced only as `markdownDoc: '/skills/x.md'` for display, so
  **prompt text is duplicated** between the `.md` and the `.ts`. Pick one when wiring the API.
- Content lives in `web/src/data/*.ts` (~1560 lines): topics, quizzes, flashcards, patient
  cases, triage scenarios. This is the seed data for the real database.

## Reference repos — local, read-only, never clone into this repo

| Remote | Local path |
| --- | --- |
| `qla-dev/backend` | `../smartfrieght/backend` |
| `qla-dev/pathtrck` | `../smartfrieght/frontend` |
| `qla-dev/fitness` | `../fitness` |

### `qla-dev/backend` — the closest model for ABC Doctor's API

Laravel 12 + Sanctum, PHP 8.2. The AI agent system there is the template for ABC Doctor's skills.

- `app/Http/Controllers/Api/CrudController.php` — abstract base giving index/store/show/update/
  destroy from `modelClass()`, `rules()`, `relations()`, `searchColumns()`, plus overridable
  `applyFilters`/`applyOrdering`/`configureQuery`. Most controllers are ~30 lines because of it.
- Response envelope is `{message, data, meta, errors}` everywhere, via `EntityResource`.
- `agents/lena/` — markdown skills on disk, one folder per mode (`booking`, `tracking`, `hs`,
  `legal`, …), each with `AGENT.md` and `skills/*.md`; `agents/lena/skills/` holds shared skills
  loaded by every mode. Files carry `---\nname:\ndescription:\n---` frontmatter and a closing
  `## Name` section with `bs`/`en`/`de` display names.
- `app/Services/LenaSkillCatalog.php` — globs those paths into API rows; `LenaModeInstructions::split`
  separates prompt body from the `## Name` block. Read this before designing skill loading.
- `resources/resources.json` per folder lists citations/links shown in the UI; **never injected
  into the prompt**. Good separation to copy.
- `app/Services/OpenRouter*.php` — how model calls are actually made (dispatch assistant, load
  scanner, image generator). `AiCallLogger.php` logs them.
- `agents/lena/AGENTS.md` — skill-training workflow: every training iteration is a new timestamped
  markdown record under `<skill>/training/`, never an edit to history.

### `qla-dev/pathtrck` — the web client patterns

React 19 + Vite + Tailwind 4, same `react-example` package name as `web/`.

- `src/services/api.ts` — typed `ApiEnvelope<T>` client mirroring the backend envelope.
- `src/hooks/useApiList.ts`, `src/lib/cn.ts`, `src/i18n.ts`.
- `dev:all` script runs Vite and `php ../backend/artisan serve` together via concurrently.

### `qla-dev/fitness` — the Expo app patterns

Expo 57, better-auth, TanStack Query, Jest, `src/{screens,navigation,stores,services,hooks}`.
Its `validate` script chains typecheck, lint, i18n audit, knip and format check. `docs/` covers
background sync, healthkit, i18n foundation, user flows.

## Commands

```bash
# backend
php artisan serve                 # in backend/
php artisan about                 # verify boot
# frontend
npx expo start                    # in frontend/
npx tsc --noEmit                  # typecheck (clean as of scaffold)
npx expo-doctor                   # 21/21 at scaffold time
# web
npm run dev                       # in web/, port 3000
```

## Open decisions

- `frontend/app.json` still says `name`/`slug` = `frontend`. No bundle identifier set.
- Whether `web/` survives as the web client or is replaced by a pathtrck-style client.
- Where skills finally live: markdown on the backend (the Lena model) or TS in the clients.
- Nothing is committed yet; the scaffolds are untracked.
