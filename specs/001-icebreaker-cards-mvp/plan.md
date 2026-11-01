# Implementation Plan: Quebra-Gelo MVP — Baralho de Perguntas

**Branch**: `001-icebreaker-cards-mvp` | **Date**: 2026-10-31 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-icebreaker-cards-mvp/spec.md`

## Summary

Build the first version of Quebra-Gelo: an offline Expo app where the user picks one of 8
thematic categories on Home, then plays a deck of face-down cards — tap to flip (physics-based
flip), swipe left/right to discard (spring physics) — with haptic feedback on flip and discard,
no repeats until the deck is done, per-category progress kept while the app is open, a "Fim do
Baralho" screen, and a persisted local favorites list toggled by a fixed star button below the card.
Content (8 categories, ≥ 20 original questions each) ships in a validated `data.json`. The work
follows the user's 5-step outline (setup → state/navigation → card → screens → polish), adjusted
where the spec/constitution require it (see "Deviations from the user's outline").

## Technical Context

**Language/Version**: TypeScript (strict), React Native via the latest stable Expo SDK at scaffold
time (versions pinned by `npx expo install`)

**Primary Dependencies**: Expo (Managed Workflow), Expo Router, React Native Reanimated, React
Native Gesture Handler, expo-haptics, NativeWind, Zustand, @react-native-async-storage/async-storage,
@expo/vector-icons

**Storage**: Bundled `src/data/data.json` (read-only content); AsyncStorage via Zustand `persist`
for favorites; deck progress in an in-memory Zustand store

**Testing**: Jest (`jest-expo` preset) + React Native Testing Library; ESLint (`eslint-config-expo`,
`no-explicit-any: error`); `tsc --noEmit`

**Target Platform**: Android and iOS phones, portrait, ≥ 320pt wide; runs in Expo Go during
development

**Project Type**: mobile-app (single Expo project, no backend)

**Performance Goals**: flip/swipe at 60 fps on mid-range phones; Home visible ≤ 2 s after launch;
first question revealed < 10 s for a new user

**Constraints**: fully offline from first launch; no login/network/analytics; animations on the UI
thread; no eject from Managed Workflow

**Scale/Scope**: 3 screens, ~8 UI components, 2 stores, 8 categories × ≥ 20 questions (≥ 160)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Rule (constitution v2.1.0) | Plan compliance | Status |
|---|---|---|
| I. Zero Fricção — no login/backend, ≤ 1 onboarding screen, ≤ 2 taps to first card | Home → category tap → card; no onboarding, no network code | PASS |
| I. All content bundled, offline from first run; no data collection/tracking | `data.json` bundled; icons from bundled vector set; no analytics deps | PASS |
| II. Gesture physics with Gesture Handler + Reanimated, UI-thread, 60 fps | R5: `Gesture` API + shared values/worklets; `runOnJS` only for final callback | PASS |
| II. Haptics via expo-haptics on flip and discard; reduced motion simplified | R6 + `useReducedMotion` (FR-019) | PASS |
| III. Strict TS, no `any`, typed entities/props/stores/route params | strict tsconfig, ESLint rule, typed routes, contracts in app-interfaces.md | PASS |
| IV. Data / UI / Screens layers, top-down deps, pure business logic | `src/data`+`src/store`+`src/hooks` / `src/components` / `src/screens` (+ thin `src/app` routes); deck logic pure in `deck.ts` | PASS |
| Stack: NativeWind default, StyleSheet only in perf-critical, never mixed per component | NativeWind everywhere except `SwipeCard`/`CardBack`/`CardFront` (StyleSheet + animated styles) | PASS |
| Stack: Zustand; `persist` for data that survives restarts (v2.1.0) | Favorites persisted (R4); progress in memory as allowed for session state (FR-016) | PASS |
| New dependencies justified | All are constitution-mandated or Expo defaults (Router, vector-icons); no extras | PASS |
| Conteúdo: one card at a time, no scoreboard/timer/ads; categories; no repeats; skip any card | FR-009–FR-018 mapped in design | PASS |
| Conteúdo: original, inclusive pt-BR; centralized UI strings; a11y labels | R10; `src/i18n/strings.ts` (pt-BR); R9 | PASS |
| Quality: Jest for data layer, content validation test, tsc + lint + tests gates | R8; quickstart commands | PASS |

**Post-design re-check (after Phase 1)**: PASS — data-model, contracts and quickstart introduce no
new dependencies or layer violations. Note: the `src/app/` directory (Expo Router convention) is
part of the Screens layer and contains only route wrappers.

## Deviations from the user's outline

| User outline | Plan | Reason |
|---|---|---|
| `src/data/mockData.ts` with empty/test arrays | `src/data/data.json` (real content) + `types.ts` + `content.ts` | Feature input named `data.json`; constitution requires validated data files; FR-004 requires ≥ 20 real questions per category |
| Routes `Home` and `DeckView` only | Plus `/favorites` | Spec US3 / FR-022 |
| Zustand + AsyncStorage for favorites | Plus an in-memory Zustand store for deck progress | Spec FR-016 (resume while app is open) |
| Favorite button inside the card or as FAB (open question) | Fixed star button below the card + non-interactive star indicator on the card | Clarification 2026-10-31 (FR-020) |
| `PanGestureHandler` | `Gesture.Pan()` / `Gesture.Tap()` (v2 API) | Same capability; legacy component API is deprecated |
| Haptics at drag start and release | Haptics on flip and on confirmed discard only | Spec FR-014 / scenario 1.4 (no feedback on snap-back) |
| "Dark mode nativo" | Single always-dark theme, no toggle | Satisfies polish request while spec excludes a dedicated dark-mode toggle |

## Project Structure

> **Superseded by 002**: `CardFace` is replaced by `CardBack` + `CardFront` (+ `CategoryPattern`),
> and `CategoryTile` by `MiniCard`. See
> [002 plan — Amendments](../002-card-visual-design/plan.md#amendments-to-the-001-design).

### Documentation (this feature)

```text
specs/001-icebreaker-cards-mvp/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   ├── content-schema.md   # data.json rules
│   └── app-interfaces.md   # routes, data-layer API, component props
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit-tasks — not created here)
```

### Source Code (repository root)

```text
app.json                     # Expo config (name, dark userInterfaceStyle, portrait, typed routes)
package.json                 # scripts: start, typecheck, lint, test
tsconfig.json                # strict
babel.config.js / metro.config.js / tailwind.config.js / global.css   # NativeWind
eslint.config.js
jest.config.js

src/
├── app/                     # Expo Router routes (Screens layer, thin wrappers only)
│   ├── _layout.tsx          # GestureHandlerRootView, Stack, dark theme, store hydration gate
│   ├── index.tsx            # → HomeScreen
│   ├── deck/[categoryId].tsx  # → DeckScreen
│   └── favorites.tsx        # → FavoritesScreen
├── screens/                 # containers: connect hooks/stores to components
│   ├── HomeScreen.tsx
│   ├── DeckScreen.tsx
│   └── FavoritesScreen.tsx
├── components/              # dumb UI (props only)
│   ├── MiniCard.tsx         # (002) Home grid item
│   ├── SwipeCard.tsx        # gestures + flip/swipe animations (StyleSheet)
│   ├── CardBack.tsx         # (002)
│   ├── CardFront.tsx        # (002)
│   ├── CategoryPattern.tsx  # (002)
│   ├── FavoriteButton.tsx
│   ├── DeckComplete.tsx
│   ├── FavoriteListItem.tsx
│   └── EmptyState.tsx
├── data/
│   ├── data.json            # categories + questions
│   ├── types.ts
│   ├── content.ts           # typed access + narrowing of data.json
│   ├── deck.ts              # pure shuffle/advance
│   └── __tests__/           # content.test.ts, deck.test.ts
├── store/
│   ├── favorites.ts
│   ├── progress.ts
│   └── __tests__/
├── hooks/
│   ├── useDeck.ts
│   ├── useFavoriteQuestions.ts
│   └── useHaptics.ts
├── theme/                   # colors, spacing, typography tokens (shared with tailwind.config)
└── i18n/
    └── strings.ts           # centralized pt-BR UI strings
```

**Structure Decision**: single Expo project at the repository root, following the user's folder
list (`components`, `screens`, `store`, `data`, `theme`) plus `hooks` (constitution data layer),
`i18n` (centralized strings) and `app` (Expo Router). Tests are colocated in `__tests__/` next to
the code they cover.

## Implementation phases (input for `/speckit-tasks`)

1. **Setup & architecture** — scaffold Expo TS app, strict tsconfig, ESLint, Jest, NativeWind,
   folder structure, dark theme tokens, `types.ts`, `data.json` skeleton with the 8 categories,
   content validation test.
2. **Data layer & navigation** — `content.ts`, `deck.ts` (tests first), persisted favorites store
   and in-memory progress store, Expo Router layout with three routes and favorites hydration gate.
3. **Card (UI & physics)** — `CardBack`/`CardFront` (002), `SwipeCard` (tap flip, pan swipe with spring/exit,
   gesture locking, reduced motion, a11y actions), `useHaptics`.
4. **Screens** — Home grid (US2), DeckScreen with "Fim do Baralho" state (US1), fixed
   FavoriteButton below the card + on-card star indicator + FavoritesScreen (US3); write the 160
   questions.
5. **Polish** — typography and contrast pass on the dark theme, 60 fps check on device,
   quickstart manual scenarios.

## Complexity Tracking

No constitution violations to justify.
