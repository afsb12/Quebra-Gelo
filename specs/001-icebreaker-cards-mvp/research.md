# Research: Quebra-Gelo MVP — Baralho de Perguntas

Phase 0 output for [plan.md](./plan.md). Each item resolves an open choice from the user's plan
input, the spec or the constitution.

## R1. Project bootstrap and SDK versions

- **Decision**: Scaffold with `npx create-expo-app@latest` using the TypeScript template, on the
  latest stable Expo SDK at scaffold time. Install every native-facing library with
  `npx expo install` so versions match the SDK. Keep the New Architecture enabled (Expo default).
- **Rationale**: Constitution mandates Expo Managed Workflow. `expo install` avoids version drift
  between React Native, Reanimated and Gesture Handler, which is the most common source of native
  crashes in Managed projects.
- **Alternatives considered**: Pinning versions by hand (fragile); bare workflow / prebuild
  customization (forbidden without constitutional amendment).

## R2. Navigation: Expo Router vs React Navigation

- **Decision**: Expo Router (file-based) with typed routes enabled. Route files live in `src/app/`
  and are thin: each one renders a screen container from `src/screens/`.
- **Routes**: `/` (Home), `/deck/[categoryId]` (DeckView), `/favorites` (Favorites).
- **Rationale**: The user listed both as acceptable. Expo Router is the Expo default, gives typed
  route params for free (Principle III) and needs no navigator boilerplate. Keeping route files as
  one-line wrappers preserves the Screens layer from Principle IV.
- **Alternatives considered**: React Navigation native stack directly — more boilerplate and
  manual param typing for the same result. The user's plan named only `Home` and `DeckView`; the
  spec's P3 story requires a third route for the favorites list.

## R3. Content storage: `mockData.ts` vs `data.json`

- **Decision**: Content lives in `src/data/data.json` (`{ categories: Category[], questions:
  Question[] }`). `src/data/types.ts` declares the domain types; `src/data/content.ts` imports the
  JSON, narrows it to the typed shape, and exposes lookups (`getCategories`, `getCategory`,
  `getQuestionsByCategory`, `getQuestion`). A Jest test validates the JSON against the rules in
  [contracts/content-schema.md](./contracts/content-schema.md).
- **Rationale**: The feature description named a local `data.json`, and the constitution requires
  content as validated data separate from UI. The user's plan mentioned `src/data/mockData.ts`
  with empty/test arrays; that is replaced by the real JSON because spec FR-004 requires ≥ 20
  original questions per category in this feature. A TS wrapper still provides strict types.
- **Alternatives considered**: A `.ts` data file (typed at compile time but mixes content with
  code and hides content edits in code diffs); a schema library such as zod (extra dependency;
  the validation is simple enough to write as a test — Principle "YAGNI").

## R4. State and persistence

- **Decision**: Two Zustand stores:
  - `useFavoritesStore` — favorites (`questionId` + `savedAt`), toggle/remove/isFavorite;
    persisted with the `persist` middleware and `createJSONStorage(() => AsyncStorage)`.
  - `useProgressStore` — per-category deck state (shuffled order + cursor), discard/reshuffle;
    **in memory only** (no `persist`), so it survives leaving the deck screen and backgrounding
    but resets when the app process is closed (clarification 2026-10-31).
  Shuffling (Fisher–Yates) and "next card" logic are pure functions in `src/data/deck.ts`, called
  by the store, so they are unit-testable without React.
- **Rationale**: Constitution fixes Zustand + AsyncStorage. FR-016 keeps progress only while the
  app is open; FR-021 requires favorites to persist. Storing only IDs keeps persisted favorites
  valid when question texts are edited.
- **Persisted state versioning**: the favorites store sets `version: 1`; on rehydrate, IDs that no
  longer exist in `data.json` are dropped.
- **Alternatives considered**: One combined store (couples unrelated concerns); MMKV (faster, but
  not required for this data volume and adds a native module); persisting progress (rejected by
  clarification: closing the app should start fresh).

## R5. Card physics: flip + swipe

- **Decision**:
  - Gestures via Gesture Handler v2 API: `Gesture.Pan()` and `Gesture.Tap()` composed with
    `Gesture.Exclusive(pan, tap)` inside a `GestureDetector`. Pan activates only after
    `activeOffsetX([-10, 10])`, so short movements resolve as taps (spec edge case "toque ×
    deslize").
  - Flip: shared value `rotation` (0 → 180) animated with `withTiming`/`withSpring`; front/back
    faces use `interpolate` on `rotateY` with `backfaceVisibility: 'hidden'` and `perspective`.
  - Swipe: `translateX` follows the finger, rotation `interpolate`d from `translateX` (±15°).
    On end: discard if `|translateX| > 30% of screen width` or `|velocityX| > 800`; discard flies
    off with `withTiming` toward the gesture direction; otherwise `withSpring` back to 0.
  - All work runs in worklets; the JS callback (`onDiscard`) is invoked once via `runOnJS` /
    `scheduleOnRN` (depending on the installed Reanimated version) after the exit animation
    completes. A `isAnimating` shared value blocks new gestures while an exit/flip is running
    (spec edge case "gestos rápidos").
  - Reduced motion: `useReducedMotion()` from Reanimated switches flip/discard to short opacity
    transitions (FR-019).
- **Rationale**: Principle II requires physics on the UI thread at 60 fps; this is the canonical
  Reanimated + Gesture Handler pattern and the user's Step 3.
- **Alternatives considered**: Legacy `PanGestureHandler` component API (named in the user's plan;
  deprecated in favor of the `Gesture` builder API, same capability); third-party swipe-deck
  libraries (less control, extra dependency).

## R6. Haptics timing

- **Decision**: `expo-haptics`, wrapped in `src/hooks/useHaptics.ts`:
  - Flip → `impactAsync(ImpactFeedbackStyle.Light)`.
  - Discard confirmed (threshold passed on release) → `impactAsync(ImpactFeedbackStyle.Medium)`.
  - Snap-back → no haptic. Drag start → no haptic.
  - Calls are fire-and-forget and swallow errors (devices without a vibration motor, spec edge
    case).
- **Rationale**: The user's plan said "no início do drag e no release"; the spec (FR-014 and
  acceptance scenario 1.4) and constitution Principle II tie haptics to flip and discard, and
  require no discard feedback on snap-back. Following the spec avoids vibrating on every drag
  that is then cancelled.
- **Alternatives considered**: Haptic on drag start (noisy; contradicts scenario 1.4 intent);
  selection feedback when crossing the threshold mid-drag (nice-to-have; deferred).

## R7. Styling and dark theme

- **Decision**: NativeWind for screens and static UI components; `StyleSheet` + Reanimated
  animated styles for the `Card` component (performance-critical, per constitution). Design tokens
  (colors, spacing, font sizes, category palette) live in `src/theme/` and are shared by the
  Tailwind config and `StyleSheet` code. The app ships a **single dark theme**
  (`userInterfaceStyle: "dark"` in app config); no light/dark toggle.
- **Rationale**: The user's Step 5 asks for native dark mode and typography/contrast tuning; the
  spec excludes a *dedicated* dark-mode toggle. One always-dark theme meets both, halves the
  contrast-testing surface, and suits the low-light settings (bars, nights) where the game is
  played. Category colors are checked for WCAG AA contrast against the dark background and the
  card text color.
- **Alternatives considered**: Following the system theme (doubles design/testing for the MVP);
  StyleSheet everywhere (allowed, but constitution sets NativeWind as default).

## R8. Testing and quality gates

- **Decision**: `jest-expo` preset + `@testing-library/react-native`. Unit tests for
  `src/data/deck.ts`, `src/data/content.ts`, both stores (with AsyncStorage mock), and the content
  validation test. Component tests for `CategoryTile`, `FavoriteButton`, `FavoriteListItem` and the
  `DeckView` screen's end-of-deck/back flow (gestures exercised via accessibility actions, not
  simulated physics). ESLint via `eslint-config-expo` + `@typescript-eslint/no-explicit-any:
  error`. `tsc --noEmit` script.
- **Rationale**: Constitution quality gates. Gesture physics are verified manually on device
  (quickstart), because simulated pan tests are brittle and add little confidence.
- **Alternatives considered**: Detox/Maestro E2E (valuable later; too heavy for MVP).

## R9a. Favorite control placement

- **Decision**: A fixed `FavoriteButton` below the card, outside the gesture area, toggles the
  favorite; it is disabled while the card is face down. The revealed card face shows a
  non-interactive star indicator when the question is favorited (clarification 2026-10-31).
- **Rationale**: Keeping the only interactive star outside the `GestureDetector` removes any
  tap/pan conflict on the card, while the on-card indicator keeps the state visible.
- **Alternatives considered**: Star button inside the card (needs gesture exclusion zones);
  button only, no indicator (state less visible on the card).

## R9. Accessibility of the card

- **Decision**: The card is an `accessible` element whose label is the question (revealed) or
  "Carta de <categoria>, virada para baixo"; it exposes `accessibilityActions`: `activate`
  (virar), `favoritar`, `pular`. Screen-reader users never need gestures.
- **Rationale**: FR-023.

## R10. Content authoring

- **Decision**: 20 original pt-BR questions per category (160 total), written during
  implementation, inclusive per constitution, max 200 characters each. Category icons use
  `@expo/vector-icons` (bundled with Expo, offline) — the `icon` field stores the icon name.
  IDs follow `<categoryId>-NNN` (e.g., `casual-001`) and are never reused.
- **Rationale**: FR-001–FR-004; vector icons are already part of the Expo SDK, so no new
  dependency.
