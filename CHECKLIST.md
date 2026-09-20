# ABC Doctor — build checklist

Status as of 2026-09-20. Boxes reflect what is on disk, not what was intended.

**Phases 1-4 are complete** bar the custom quiz modal. Phase 5 and the backend remain.

**Done:** foundation, navigation, all screens, persistence, native config, EAS builds.
**Not done:** the backend, and five of the six upgrades.

## Locked decisions

- **Primary blue: `#007AFF` light / `#0A84FF` dark** — putni-nalozi's iOS system blue.
- **Dark is AMOLED** (`#000000`). Three modes (`system`/`light`/`dark`), defaulting to `system`
  as fitness's `themeService` does — the OS dark appearance resolves to the same palette as
  picking Dark by hand, so there is one dark appearance, not two.
- **Expo Router.** Native tabs where the glass APIs exist and the user leaves the toggle on;
  the fallback tab bar everywhere else — Android, iOS before 26, and the toggle turned off.
- **Auth: Laravel Sanctum**, same as freightbook. No better-auth.
- **Languages: `bs`, `en`, `de`**, English canonical.
- **Bundle id `abc.qla.dev`**, matching `radni.qla.dev` and `freightbook.qla.dev`.
- **All packages from fitness except the three Health ones.**
- **All six upgrades in scope.**

## Phase 1 — foundation ✅

- [x] Navigation, UI, media, picker, state, AI-chat, scheduling, chart, i18n and platform
      packages installed — 73 in total, listed in [PACKAGES.md](PACKAGES.md)
- [x] `theme/colors.ts` + `theme/ThemeProvider.tsx`, blue swapped, AMOLED default
- [x] `theme/styles.ts` — `createGlobalStyles(c)`
- [x] i18next in `bs`/`en`/`de`, English fallback, `useLanguage()` context
- [x] Folder skeleton
- [x] `localeRegistry.json` — the shipping contract; aliases (hr/sr → bs) are data, not code
- [x] `services/storage.ts` — MMKV-backed persistence

## Phase 2 — component library ✅ 23 of 23

- [x] `AppButton` (6 tones, sound + haptics inside the component)
- [x] `AppCard`, `List`, `ListItem`, `SectionHeader`, `SegmentedControl`, `EmptyState`
- [x] `GlassPanel` with `isLiquidGlassAvailable()` → `expo-blur` → tinted view
- [x] `ProgressRing`, `Badge`, `FlashcardFlipCard`, `QuizOptionRow`
- [x] `lib/sound.ts`, taken from freightbook verbatim
- [x] `AppField` with error state, `AppDateField` with the iOS/Android split
- [x] `CustomBottomSheet`, `ActionBottomSheet`, `FooterCta`, `CheckRow`, `OptionRow`
- [x] `ErrorBoundary` — themeless on purpose, it must render when providers are what failed
- [x] `HighYieldStars`, `CategoryChip` (colour hashed from the name, stable across screens)

## Phase 3 — navigation shell ✅

- [x] `app/_layout.tsx` — ThemeProvider, LanguageProvider, QueryClientProvider
- [x] `app/(tabs)/_layout.tsx` — `NativeTabs` / `Tabs`, chosen by `useNativeIOSTabsActive()`
- [x] Five tabs: Home, Handbook, Quiz, Simulator, AI Doctor
- [x] SF Symbol pairs per tab, lucide on Android
- [x] `blurEffect` systemMaterial, `tintColor` blue
- [x] `role="search"` on Handbook
- [x] Per-tab native stacks (`components/navigation/TabStack.tsx`) — a stack, not a tab, is what
      can own a header; `(home)` is a group so its index stays at `/`
- [x] Three chrome modes kept in step — glass native, iOS fallback, Android — switched on the
      device and the preference (`lib/nativeTabBarPreference.ts`), never on `Platform.OS`
- [x] `headerBackButtonDisplayMode: 'minimal'` — chevron only, no route-group label
- [x] Pushed routes: `/flashcards`, `/triage`, `/progress`, `/topic/[id]`, `/quiz/player`
- [x] Root-level surfaces outside the tabs: `/chat`, `/voice`, `/simulation`
- [x] Header buttons are real bar-button items — `unstable_headerLeftItems`/`RightItems` through
      `hooks/useScreenHeader.ts`; `FallbackTabHeader` draws the bar where the system draws none
- [x] AuthProvider — Sanctum token in SecureStore, not MMKV

## Phase 4 — screens ✅

- [x] Home, Handbook, topic detail, Quiz, quiz player, Flashcards, Triage, AI Doctor, Progress
- [x] Home carries no large title: the greeting is the screen's heading, and `ABC Doctor` enters
      the bar on scroll via `nativeTitle` and a threshold, as fitness's SettingsScreen does
- [x] Patient simulator rebuilt as setup + consultation (see Phase 5)
- [x] Seed data ported as typed fixtures (1871 lines)
- [x] **Storage** — MMKV holds progress, bookmarks, quiz history, notes, the FSRS review log
      and the streak. Home, Progress and Settings read stored values, not fixtures.
- [x] Settings screen: theme, language, stats, reset
- [ ] Custom quiz modal — the one Phase 4 item left

## Phase 5 — upgrades ⚠️ 1 of 6

- [x] **Patient simulator** (added mid-flight, not in the original list) — setup screen with
      difficulty, specialty, sex, age band and randomise; consultation where the patient opens
      unprompted; free-text questions answered from history clues by word overlap; examine and
      investigations post findings. `generateCase()` returns the shape a backend call will.
- [~] **FSRS** — schedules, persists and resumes; the queue is what is due. No notification
      and no background recompute yet.
- [~] **Widgets** — WidgetKit target written (cards due + streak, App Group `group.abc.qla.dev`),
      registered as a config plugin. **Never compiled.** No Live Activity, no Watch, no Android
      Glance widget. Nothing writes the values the widget reads.
- [ ] **Voice patient simulator** — orb animates, nothing listens or speaks
- [ ] **Camera → flashcards** — `expo-camera` installed, imported nowhere
- [ ] **Offline-first SQLite** — `expo-sqlite` installed, imported nowhere
- [ ] **Streaming tutor** — `remend`, `assistant-ui` and `enriched-markdown` all unused

## Phase 6 — backend ⚠️ the messaging protocol only

MySQL (`abc_doctor` on local MariaDB), not the sqlite file the installer left behind.
Nina — not Lena — is the agent. Four skills, each declaring `supports_text` / `supports_voice`,
with `parent_id` waiting for the first sub-skill.

- [x] `{message, data, meta, errors}` envelope on every route
- [x] `nina_skills`, `conversations`, `messages`; the four skills ship as data in the migration
      rather than a seeder, so a fresh database is one `migrate` away from usable
- [x] `POST /api/messages` returns both turns at once; modality is checked server-side against
      the skill's flags, not trusted to the client that drew the picker
- [~] `NinaResponder` writes a reply of the right shape but **calls no model**. Swapping in a
      real call is one method; nothing above that class changes.
- [ ] Auth. Left out on purpose — Sanctum belongs with the first real user, not the first
      message. Nothing here is safe beyond localhost.
- [ ] `CrudController` base
- [ ] Models + migrations: topics, quizzes, flashcards, cases, conversations, messages, ai_call_logs
- [ ] Lena architecture: `agents/<name>/` tree, `LenaSkillCatalog`, `LenaModeInstructions::split`,
      `LenaSkillSelector`, `LenaSkillUsage`, `LenaSkillResources`, `AiCallLogger`
- [ ] `LenaRealtimeSession` for voice; speech + transcription endpoints
- [ ] Doctor modes: patient simulator, consultation, triage, tutor

## Phase 7 — native config and delivery ✅ (not in the original plan)

- [x] 18 config plugins registered with their permission strings
- [x] Android permissions: camera, audio, vibrate, notifications, boot, exact alarm, internet
- [x] iOS entitlements: App Group; Info.plist usage strings
- [x] `expo-build-properties`: Android SDK 36 / min 26, iOS 16.4
- [x] EAS project `@qla-dev/abc-doctor-mobile`, `eas.json` with 4 profiles
- [x] Builds: iOS simulator, Android APK, iOS device
- [x] `.easignore` — `.git` object ACLs under `C:\Users\Public` break the upload scan
- [x] native-sim workflow for streaming an iOS simulator from CI

## The blunt measure

Imported somewhere: `ts-fsrs`, React Query, MMKV, `zustand`, secure-store, bottom-sheet and the
Expo runtime set. Still installed, documented and **unused**: `zod`, SQLite, notifications,
camera, FlashList, Skia, victory-native, `remend`, assistant-ui, enriched-markdown.

## Next, in the order that matters

1. **A real model call** — the protocol, the schema and both clients are done; `NinaResponder`
   is the one seam left before anything Nina says is hers.
2. **SQLite for the review log** — MMKV holds prefs and progress now, but the FSRS log wants a
   real table before it grows.
3. **Custom quiz modal** — the one Phase 4 box still open.
4. The untouched upgrades: voice, camera → flashcards, streaming tutor.

## Risks

- `NativeTabs` is imported from `expo-router/unstable-native-tabs` — the path may move.
- Native header items take only SF Symbols or images, never a component. `Stack.Toolbar` is not
  used at all — the items go on through `unstable_headerLeftItems`/`RightItems`.
- **A large title inside a tab-based stack needs `collapsable={false}`** on every wrapper between
  the screen and its scroll view. react-native-screens links the two by walking `subviews[0]`
  (`RNSScrollViewFinder`), so a wrapper Fabric is free to flatten breaks the chain — and a bar with
  no link gets no scroll updates, leaving the title pinned and the bar unpainted. expo/expo#40717.
- `expo-router/unstable-native-tabs` exposes no tab-bar height hook, unlike
  `react-native-bottom-tabs`' `useBottomTabBarHeight` that fitness uses. Content pinned above the
  bar goes by `insets.bottom`, which `UITabBarController` already grows by its bar's height.
- The widget's Swift has never been compiled. If it fails, drop `@bacons/apple-targets` from
  `plugins` and rebuild.
- TypeScript is pinned to 5.9.3 against Expo's expected 6.0.3, with `expo.install.exclude` set.
  Expo's own tooling requires `^5`, and 6.0.3 breaks `npm ci` on CI.
