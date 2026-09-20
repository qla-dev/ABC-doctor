# ABC Doctor — package list

Target: **Expo SDK 57** (`expo ~57.0.24`, React Native 0.86.3, React 19.2.3).

Install `expo-*` packages with `npx expo install <name>` so the SDK-correct version is chosen —
do not pin them by hand. Versions below are what `qla-dev/fitness` ships on the same SDK line,
listed for reference.

Excluded on instruction: `@kingstinct/react-native-healthkit`, `expo-health-connect`,
`react-native-health-connect`. Also excluded: `@workspace/shared` (a pnpm workspace package,
not portable) and `react-native-ble-plx` (no use here).

## Navigation & runtime core

| package | version | why |
| --- | --- | --- |
| `expo-router` | ~57.0.8 | file-based routing, `(tabs)`, `NativeTabs`, `Stack.Toolbar` |
| `react-native-screens` | ~4.26.0 | native screen primitives |
| `react-native-safe-area-context` | ~5.7.0 | insets |
| `react-native-gesture-handler` | ~2.32.0 | gestures (card swipe) |
| `react-native-reanimated` | 4.5.1 | animation (card flip) |
| `react-native-worklets` | 0.10.1 | required by Reanimated 4 |
| `react-native-pager-view` | 8.0.2 | swipeable decks |

## UI & native chrome

| package | version | why |
| --- | --- | --- |
| `expo-glass-effect` | ~57.0.1 | liquid glass (iOS 26) |
| `expo-blur` | ~57.0.2 | glass fallback below iOS 26 |
| `expo-symbols` | ~57.0.2 | SF Symbols |
| `@expo/material-symbols` | ^0.1.1 | Android symbol parity |
| `@expo/ui` | ~57.0.12 | native UI primitives |
| `lucide-react-native` | ^0.562.0 | Android tab/icon set |
| `react-native-svg` | 15.15.4 | icons, rings, charts |
| `expo-image` | ~57.0.4 | image rendering + caching |
| `expo-linear-gradient` | ~57.0.1 | gradients |
| `@gorhom/bottom-sheet` | ^5.2.14 | sheets |
| `react-native-toast-message` | ^2.3.3 | toasts |
| `@shopify/flash-list` | 2.3.2 | fast lists (handbook, decks) |

## Media & sensors

| package | version | why |
| --- | --- | --- |
| `expo-camera` | ~57.0.4 | capture slides/pages → flashcards |
| `expo-audio` | ~57.0.4 | click sounds, voice capture |
| `expo-speech` | ~57.0.3 | text to speech |
| `expo-haptics` | ~57.0.2 | tactile feedback in primitives |
| `expo-image-picker` | ~57.0.16 | pick from library |
| `expo-image-manipulator` | ~57.0.16 | crop/resize before upload |

## Pickers

| package | version | why |
| --- | --- | --- |
| `@react-native-community/datetimepicker` | 9.1.0 | native date/time (both native apps use it) |
| `react-native-ui-datepicker` | ^3.1.2 | calendar UI |

## Storage, state & data

| package | version | why |
| --- | --- | --- |
| `expo-sqlite` | ~57.0.2 | **offline-first store**: handbook, decks, quiz bank, review log |
| `react-native-mmkv` | 4.3.2 | fast key/value (prefs, session, flags) |
| `react-native-nitro-modules` | ^0.35.5 | required by MMKV 4 |
| `@react-native-async-storage/async-storage` | 2.2.0 | theme/language keys, as both apps do |
| `expo-secure-store` | ~57.0.3 | auth token |
| `zustand` | ^5.0.12 | client state |
| `@tanstack/react-query` | ^5.90.20 | server cache, retries, offline queue |
| `zod` | ^4.3.6 | API + form validation |

## AI chat

| package | version | why |
| --- | --- | --- |
| `@assistant-ui/react-native` | ^0.1.27 | chat UI primitives |
| `@assistant-ui/react-ai-sdk` | ^1.3.37 | streaming transport |
| `react-native-enriched-markdown` | 0.6.0 | markdown rendering |
| `remend` | 1.2.2 | self-healing markdown for partial streamed blocks |
| `react-native-keyboard-controller` | 1.21.9 | chat input behaviour |

## Scheduling & background

| package | version | why |
| --- | --- | --- |
| `ts-fsrs` | 5.4.2 | FSRS spaced repetition |
| `expo-notifications` | ~57.0.17 | due-card reminders |
| `expo-background-task` | ~57.0.16 | overnight scheduling recompute |
| `expo-task-manager` | ~57.0.16 | background task registration |

## Charts

| package | version | why |
| --- | --- | --- |
| `@shopify/react-native-skia` | 2.6.2 | chart rendering |
| `victory-native` | ^41.20.2 | chart components (Progress screen) |

## i18n

| package | version | why |
| --- | --- | --- |
| `i18next` | 25.8.18 | catalog + plurals |
| `react-i18next` | 16.5.8 | bindings |
| `expo-localization` | ~57.0.1 | device locale detection |

## Widgets & platform targets

| package | version | why |
| --- | --- | --- |
| `expo-widgets` | ~57.0.18 | home-screen widgets |
| `@bacons/apple-targets` | 4.0.6 | Live Activities, Watch target, widget extension |

## App plumbing

`expo-constants`, `expo-device`, `expo-application`, `expo-updates`, `expo-splash-screen`,
`expo-system-ui`, `expo-navigation-bar`, `expo-font`, `expo-asset`, `expo-linking`,
`expo-web-browser`, `expo-clipboard`, `expo-sharing`, `expo-file-system`, `expo-network`,
`expo-keep-awake`, `expo-crypto`, `expo-dev-client`, `expo-build-properties`

## Auth (decided: Sanctum)

Laravel Sanctum, matching `qla-dev/backend` and freightbook native:
no extra package beyond `expo-secure-store`. If social login is wanted, add
`expo-auth-session`, `expo-apple-authentication`, `expo-crypto`.

fitness instead uses `better-auth` + `@better-auth/expo` + `@better-auth/sso` (1.5.6). Only
relevant if we move auth off Laravel.

## Waiting on the next native build

`expo-speech-recognition` (~57.1.0) — on-device speech recognition, iOS `SFSpeechRecognizer`
and Android `SpeechRecognizer`, with `interimResults`. It is a native module, so it cannot be
added to a running dev build: install it, add `NSSpeechRecognitionUsageDescription` to
`ios.infoPlist`, and rebuild.

Why it is wanted even though live transcription already works: the composer's live text
currently comes from OpenAI over a socket (`lib/liveTranscribe.ts`), which costs realtime
minutes and needs a connection. An on-device engine is free, instant and works offline, which
makes it the better *preview* — the arrangement freightbook's Lena uses, where the local engine
types a guess while the accurate transcriber produces the text that is actually sent.

The catch is language: Apple recognises `hr-HR`, not Bosnian, so its guess will be rougher than
what `gpt-4o-transcribe` returns. It is a preview to be overwritten, not the final text. Check
`getSupportedLocales()` on the device before committing to it.

Where it would plug in: `lib/voiceNote.ts` already chooses an engine before anything starts
recording, precisely so a third one can be added without two things reading the same microphone.
An on-device preview would pair with the *recorded* path — local engine for the live text, the
file upload for the final — leaving the socket path as it is.

## Install order

1. `npx expo install` the `expo-*` and Expo-aware packages (Router, glass, camera, sqlite, …)
2. `npm i` the pure-JS ones (`ts-fsrs`, `zustand`, `zod`, `remend`, `@tanstack/react-query`, …)
3. `react-native-mmkv` after `react-native-nitro-modules`
4. `npx expo prebuild` once native targets (widgets, Live Activities) are added
