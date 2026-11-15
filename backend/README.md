<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## Patient simulation

New `patient_simulator` conversations accept `case_setup` with `specialty` (`Cardiology`, `Surgery`,
or `any`), `gender` (`M`, `F`, or `any`), `ageBand` and `difficulty`. `PatientCases` selects from the
existing clinical templates in `resources/patient-cases.json`, adapts demographics, and stores an
immutable snapshot in `conversations.patient_case`. Template edits affect only new conversations.
The API exposes display data as `patient`; the diagnosis and private history stay in the model prompt.

`MarkInstructions` supplies the same saved facts and patient-role rules to text and Realtime.
Voice conversations have no separately generated text greeting. The Realtime session endpoint returns
ordered history for the client to restore, including any earlier written greeting. Old conversations
without snapshots keep their historical dialogue; they are not silently assigned new cases.

Deployment requires the additive `2026_11_15_000001_add_patient_case_to_conversations` migration
before the updated mobile client. Verify the effective database connection before running migrations
as described in the repository's `AGENTS.md`. No data backfill or seeding is needed.

## Regression tests

The committed `.env.testing` contains only local test configuration. From this directory:

```sh
APP_ENV=testing DB_CONNECTION=sqlite DB_DATABASE=:memory: DB_URL= vendor/bin/phpunit
```

The patient tests refuse to migrate unless the effective database is SQLite `:memory:`. They run
normal migrations into a new in-memory database, with no resets, destructive rollbacks or seeders.
OpenAI and OpenRouter calls are faked; unexpected HTTP calls are rejected. Tests verify case
persistence, matching prompts and UI data, role reminders, resumed history, single greetings,
idempotent transcript saves, legacy conversations and demographic consistency. They verify our
state and request construction, not probabilistic behavior of a live model.

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Workflow practice and administration

The doctor-facing frontend is `../../abc-doctor-mobile` (React Native). Laravel serves the API and the Filament admin at `/admin`; neither `web/` nor `frontend/` is part of this feature.

Runtime setup requires the intended database configuration and an `APP_KEY`. Verify the effective database driver, host, port and name before applying the additive migrations. Do not use reset/fresh/seed operations. Deployment uses the shared MariaDB database. The workflow migrations were applied on 2026-11-15 after a private backup; three workflows and nine starter cases were imported and published.

After configuring the environment:

```bash
composer install
php artisan migrate
php artisan practice:admin admin@example.com
php artisan queue:work --timeout=180 --tries=2
```

`practice:admin` asks for a name and password privately, refuses to modify an existing account, and creates the initial administrator. Set `OPENAI_API_KEY` for voice and `OPENROUTER_API_KEY` for drafting/review/evaluation. Use `QUEUE_CONNECTION=database` and `DB_QUEUE_RETRY_AFTER=240` (or a larger value); run the worker continuously. Composer publishes Filament assets automatically. Use HTTPS outside local development.

In **Workflows**, click **Add starter examples**. This creates three workflow drafts and nine case drafts without overwriting existing records. Review the content and references, publish each workflow and its cases, and create doctor accounts in **Users**. There is no public account registration. Existing Mark skill editing is available under **Mark Skills**; old unrestricted conversation-inspection pages have been retired. Unowned legacy conversations remain inaccessible until a deliberate ownership migration is designed.

Admins can create/edit/duplicate content, draft with AI, review cases with AI, preview a saved case with browser voice, publish saved drafts, and archive content. Changes to drafts do not affect published selection; each practice attempt freezes the workflow and case it started with. The browser preview uses the same case instructions, action recording and evaluator as mobile practice and requires microphone access on localhost or HTTPS.

Doctors sign in in React Native, open **Voice practice**, enable workflows, and select one or choose **Surprise me**. They read the opening brief, start/resume the voice encounter, then finish for private feedback. Closing a call alone pauses practice. Results remain reachable through conversation history's **Practice brief and feedback** link. Account logout revokes the mobile token; tokens expire after 30 days.

AI answers unscripted questions using the authored case and conversation history. Compatible improvised details belong to the attempt, never the scenario definition. Rubrics assess meaning and valid alternatives, not exact phrases. Significant actions and stage changes are recorded; prerequisites and alternate routes are plain-language author instructions, interpreted by AI rather than a deterministic clinical state machine. The evaluator cites transcript excerpts, computes equal-weight criterion credit (met=1, partial=0.5), excludes non-applicable criteria and marks uncertain/incomplete evidence provisional. AI is not guaranteed contradiction-free and does not certify physical procedural skill.

Voice requires a native development build supporting the existing WebRTC modules. Configure `EXPO_PUBLIC_API_URL` on the mobile app to point to this backend. Live voice verification requires a valid OpenAI key. The key supplied for the 2026-11-15 deployment returned an expired-key response and must be replaced.

Verification:

```bash
DB_CONNECTION=sqlite DB_DATABASE=:memory: php artisan test
# In ../../abc-doctor-mobile:
npm test
npm run typecheck
```

The backend tests exercise ownership, selection preferences, hidden data, stable publication snapshots, idempotent events/import, late transcripts, evaluation evidence and Filament form creation. Mobile tests cover call restoration, transcript ordering/retries and function-call success/failure. Run representative clinical conversations against the configured model before publishing locally adapted content.
