# ABC Doctor — build checklist

Frontend first. Backend proceeds in parallel. Nothing here is built yet.

## Locked decisions

- **Primary blue: `#007AFF` light / `#0A84FF` dark** — putni-nalozi's iOS system blue. The web
  prototype's cyan-500 is dropped.
- **Dark is AMOLED** (`#000000` background), default on launch. Light theme second. Three modes
  (`system` / `light` / `dark`), as both native apps do it.
- **Expo Router** with `(tabs)`, native tabs on iOS, classic tabs on Android.
- **i18n from the first component** — fitness's i18next setup, English canonical.
- **All packages from fitness except the three Health ones** (`@kingstinct/react-native-healthkit`,
  `expo-health-connect`, `react-native-health-connect`).
- **All five upgrades are in scope.**

- **Auth: Laravel Sanctum**, same as freightbook. No better-auth.
- **Languages: `bs`, `en`, `de`** — same set as freightbook. English canonical.

## Phase 1 — foundation

- [ ] Install Expo Router + navigation: `expo-router`, `react-native-screens`,
      `react-native-safe-area-context`, `react-native-gesture-handler`, `react-native-reanimated`,
      `react-native-worklets`, `react-native-pager-view`
- [ ] Install UI/native: `expo-glass-effect`, `expo-blur`, `expo-symbols`, `@expo/ui`,
      `@expo/material-symbols`, `lucide-react-native`, `react-native-svg`, `expo-image`,
      `expo-linear-gradient`, `@gorhom/bottom-sheet`, `react-native-toast-message`,
      `@shopify/flash-list`
- [ ] Install media/sensors: `expo-camera`, `expo-audio`, `expo-speech`, `expo-haptics`,
      `expo-image-picker`, `expo-image-manipulator`
- [ ] Install pickers: `@react-native-community/datetimepicker`, `react-native-ui-datepicker`
- [ ] Install state/data: `zustand`, `@tanstack/react-query`, `zod`,
      `@react-native-async-storage/async-storage`, `react-native-mmkv`, `expo-sqlite`,
      `expo-secure-store`
- [ ] Install AI/chat: `@assistant-ui/react-native`, `@assistant-ui/react-ai-sdk`,
      `react-native-enriched-markdown`, `remend`, `react-native-keyboard-controller`
- [ ] Install scheduling/background: `ts-fsrs`, `expo-notifications`, `expo-background-task`,
      `expo-task-manager`
- [ ] Install charts: `@shopify/react-native-skia`, `victory-native`
- [ ] Install i18n: `i18next`, `react-i18next`, `expo-localization`
- [ ] Install platform extras: `expo-widgets`, `@bacons/apple-targets`, `expo-constants`,
      `expo-device`, `expo-application`, `expo-updates`, `expo-splash-screen`, `expo-system-ui`,
      `expo-navigation-bar`, `expo-font`, `expo-asset`, `expo-linking`, `expo-web-browser`,
      `expo-clipboard`, `expo-sharing`, `expo-file-system`, `expo-network`, `expo-keep-awake`
- [ ] `theme/colors.ts` + `theme/ThemeProvider.tsx` ported, blue swapped, AMOLED default
- [ ] `theme/styles.ts` — `createGlobalStyles(c)` with screen/title/subtitle/separator/sectionLabel
- [ ] i18next: `src/localization/locales/<lang>/translation.json`, `localeRegistry.json`,
      English fallback, `useLanguage()` context
- [ ] Folder skeleton: `app/`, `components/common/`, `components/<domain>/`, `theme/`, `i18n/`,
      `lib/`, `services/`, `context/`, `stores/`

## Phase 2 — component library

Ported from putni-nalozi + freightbook native (present in both, so they are the stable core):

- [ ] `AppButton` — tones `primary` / `dark` / `secondary` / `ghost` / `danger` / `success`,
      sound + haptics inside the component
- [ ] `AppCard`, `AppField`, `List`, `ListItem`, `SectionHeader`, `SegmentedControl`
- [ ] `CustomBottomSheet`, `ActionBottomSheet`, `EmptyState`, `FooterCta`, `CheckRow`, `OptionRow`
- [ ] `AppDateField`, `ErrorBoundary`
- [ ] Glass: `GlassPanel` (freightbook) + `LiquidGlassSurface` (fitness), with
      `isLiquidGlassAvailable()` falling back to `expo-blur` below iOS 26
- [ ] New for this app: `ProgressRing`, `Badge`, `FlashcardFlipCard`, `QuizOptionRow`,
      `HighYieldStars`, `CategoryChip`
- [ ] `lib/sound.ts` (`playClickSound`) + haptics wired into primitives, not call sites

## Phase 3 — navigation shell

- [ ] `app/_layout.tsx` — ThemeProvider, LanguageProvider, AuthProvider, QueryClientProvider
- [ ] `app/(tabs)/_layout.tsx` — `NativeTabs` (iOS) / `Tabs` (Android) split
- [ ] Five tabs: Home, Handbook, Quiz, Simulator, AI Doctor
- [ ] SF Symbol pairs per tab (`default` / `selected`), lucide equivalents on Android
- [ ] `blurEffect` = `systemMaterialDark` / `systemMaterialLight`, `tintColor` = blue
- [ ] `Stack.Toolbar.Button` header icons (theme toggle, search, profile)
- [ ] `role="search"` on the tab that gets the liquid search treatment
- [ ] Pushed routes: `/flashcards`, `/triage`, `/progress`, `/topic/[id]`, `/quiz/player`

## Phase 4 — screens

- [ ] Home, Handbook (+ `TopicDetailView`), Quiz (+ player, + custom modal), Flashcards,
      Patient Simulator (756 lines in web, the big one), Triage, AI Doctor, Progress
- [ ] Seed data ported as typed fixtures (~1560 lines: topics, quizzes, flashcards,
      patient cases, triage scenarios)
- [ ] Storage moved to MMKV/AsyncStorage keeping the four existing key semantics:
      progress, bookmarks, quiz history, notes

## Phase 5 — upgrades (all in scope)

- [ ] **FSRS** — `ts-fsrs` replaces the stubbed `handleRateCard`; real `again/hard/good/easy`
      scheduling; due-card queue; `expo-notifications` daily reminder; `expo-background-task`
      overnight recompute
- [ ] **Voice patient simulator** — `LenaRealtimeSession` repointed at patient personas,
      full-duplex history-taking, spoken grading
- [ ] **Widgets + Live Activities** — `@bacons/apple-targets`, using fitness's `targets/widget`,
      `targets/watch`, `targets/android-widget` as templates; cards-due widget, quiz-in-progress
      Live Activity, Watch flashcard review
- [ ] **Camera → flashcards** — `expo-camera` capture, backend extraction modeled on
      `OpenRouterLoadScanner`, returns generated cards + questions
- [ ] **Offline-first SQLite** — `expo-sqlite` holds the handbook, decks, quiz bank and review
      log so the whole app works without signal; `@tanstack/react-query` queues writes and syncs
      on reconnect
- [ ] **Streaming tutor** — `remend` + `react-native-enriched-markdown` + `@assistant-ui/react-native`
      so markdown renders correctly mid-stream

## Phase 6 — backend (parallel, simplest that works)

- [ ] Sanctum auth, `CrudController` base, `{message, data, meta, errors}` envelope
- [ ] Models + migrations: topics, quizzes, flashcards, cases, conversations, messages,
      ai_call_logs
- [ ] Lena architecture lifted whole: `agents/<name>/` markdown tree, `LenaSkillCatalog`,
      `LenaModeInstructions::split`, `LenaSkillSelector`, `LenaSkillUsage`, `LenaSkillResources`
      (`resources.json` never enters the prompt), `AiCallLogger`
- [ ] `LenaRealtimeSession` for voice; speech + transcription endpoints
- [ ] Doctor modes instead of freight: patient simulator, consultation, triage, tutor
- [ ] No freight MD skill content ported

Full install list with versions: [PACKAGES.md](PACKAGES.md).

## Risks

- `NativeTabs` is still imported from `expo-router/unstable-native-tabs` — the path may move.
- `Stack.Toolbar.Button` accepts only SF Symbols or images, never a component. freightbook
  pre-rasterizes its logo to PNG for this reason; any custom mark needs the same treatment.
- `@workspace/shared` in fitness is a pnpm workspace package — not portable, do not copy.
