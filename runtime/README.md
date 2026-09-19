# Runtime

Dev-runtime tooling and reference material for ABC Doctor. Nothing here ships with the app.

## React Native Feel

<https://reactnativefeel.com/>

A commercial subscription toolkit for React Native / Expo (~$19.99/mo for all products, as
advertised on the site). **Not installed, not tried, not paid for** — evaluated from the site only.
Three products:

- **Chat** — production-ready AI chatbot for React Native and Expo: streaming, tools, voice,
  attachments, auth. Directly relevant to ABC Doctor, which is an AI tutor chat at its core.
- **gpt-live-1** — OpenAI voice model for full-duplex conversation without separate STT/TTS
  vendors. Relevant to the patient-simulator and oral-exam skills.
- **Sim** — cloud iOS simulator, below.

Before adopting any of it: it is a third-party SDK and a recurring cost, and its Chat product
overlaps with what the Laravel backend would otherwise own. Compare against `qla-dev/backend`'s
own OpenRouter services before committing.

### native-sim

<https://reactnativefeel.com/sim>

Streams a real iOS Simulator running on GitHub's infrastructure to the browser, so the Expo app
in `frontend/` could be exercised on iOS without a Mac. Agent-device proxy support means a coding
agent can drive the simulator.

```bash
npm i -g native-sim
native-sim up --public --minutes 45
```

- Compiles on a GitHub runner; native build cached by fingerprint, warm start ~7 minutes.
- Build artifacts stored as GitHub release assets.
- Site states free on public repos, ~$0.062/min on private. How that relates to the $19.99/mo
  subscription is unclear from the site — check before running anything.
- Sessions protected by a session key.

Using it requires pushing `frontend/` to GitHub first, spends runner minutes, and publishes build
artifacts as release assets. Ask before the first run.

## Reference repositories

Read-only references, already cloned elsewhere on this machine. Do not clone them into this repo.

| Purpose | Local path | Remote |
| --- | --- | --- |
| Laravel API patterns, AI agent/skill system | `../smartfrieght/backend` | `qla-dev/backend` |
| React + Vite web client, API client patterns | `../smartfrieght/frontend` | `qla-dev/pathtrck` |
| Expo/React Native app, i18n, native modules | `../fitness` | `qla-dev/fitness` |

## Stack decisions

- **backend/** — Laravel 12 (`php ^8.2`). Laravel 13 requires PHP ^8.3; the local XAMPP PHP is
  8.2.12. Laravel 12 also matches `qla-dev/backend`, which keeps its patterns directly portable.
- **frontend/** — Expo SDK 57 (`expo ~57.0.24`, React Native 0.86.3). SDK 58 is still
  `58.0.0-preview.3`, not stable. `qla-dev/fitness` is on the same SDK 57 line.
- **web/** — the existing AI Studio React prototype, kept as-is for now.
