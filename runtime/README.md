# Runtime

Dev-runtime tooling and reference material for ABC Doctor. Nothing here ships with the app.

## native-sim — cloud iOS simulator

<https://reactnativefeel.com/sim>

Streams a real iOS Simulator running on GitHub's infrastructure to the browser, so the
Expo app in `frontend/` can be exercised on iOS without a Mac.

```bash
npm i -g native-sim
native-sim up --public --minutes 45
```

- Builds are compiled on a GitHub runner; the native build is cached by fingerprint, so a
  warm start is roughly 7 minutes.
- Build artifacts are stored as GitHub release assets.
- Free on public repos; private repos are billed per minute (~$0.062/min at time of writing).
- Sessions are protected by a session key.
- Supports an agent-device proxy, so a coding agent can drive the simulator directly.

Check the site for current pricing and flags before relying on any number above.

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
