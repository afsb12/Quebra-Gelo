---

description: "Task list for 001-icebreaker-cards-mvp (implemented together with 002-card-visual-design)"
---

# Tasks: Quebra-Gelo MVP — Baralho de Perguntas

**Input**: Design documents from `/specs/001-icebreaker-cards-mvp/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/app-interfaces.md,
contracts/content-schema.md, quickstart.md. Visual components come from
[002 tasks](../002-card-visual-design/tasks.md) (`CardBack`, `CardFront`, `MiniCard`, theme
helpers), per the "Amendments to the 001 design" in
[002 plan](../002-card-visual-design/plan.md). This list **replaces** 001's `CardFace` and
`CategoryTile` with those components, so no throwaway UI is built.

**Tests**: Included — the constitution requires tests for data-layer logic and content
validation; quickstart.md lists the automated checks.

**Organization**: Grouped by spec.md user stories: US1 Jogar um baralho (P1), US2 Escolher o
contexto na tela inicial (P2), US3 Favoritar perguntas (P3).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1, US2, US3
- Paths relative to repository root; single Expo project with `src/`
- "002/Txxx" refers to a task in specs/002-card-visual-design/tasks.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Scaffold the Expo project and tooling

- [X] T001 Scaffold the Expo app in a temporary sibling folder with `npx create-expo-app@latest quebra-gelo-tmp --template blank-typescript`, then copy its files (package.json, package-lock.json, app.json, tsconfig.json, babel config, App/entry files, assets/) into the repository root without overwriting `.claude/`, `.specify/`, `Assets/`, `specs/`, `CLAUDE.md`, `README.md` or `.gitignore` (merge `.gitignore` entries instead), delete the temp folder, run `npm install`, remove the blank `App.tsx` in favor of Expo Router routes under src/app/, and set `"main": "expo-router/entry"` in package.json
- [X] T002 Install runtime dependencies with `npx expo install expo-router react-native-reanimated react-native-worklets react-native-gesture-handler expo-haptics @react-native-async-storage/async-storage react-native-safe-area-context react-native-screens zustand nativewind tailwindcss`; if the installed Reanimated major is < 4, skip `react-native-worklets` and use `runOnJS` instead of `scheduleOnRN`; ensure the Babel config ends with the matching plugin (`react-native-worklets/plugin` for Reanimated 4, `react-native-reanimated/plugin` for 3); record versions in package.json
- [X] T003 Configure app.json: name "Quebra-Gelo", `orientation: "portrait"`, `userInterfaceStyle: "dark"`, `experiments.typedRoutes: true`, scheme `quebragelo`, keep New Architecture enabled
- [X] T004 [P] Set `"strict": true`, `noImplicitAny`, path alias `@/*` → `src/*` in tsconfig.json
- [X] T005 [P] Configure ESLint flat config with `eslint-config-expo` and `@typescript-eslint/no-explicit-any: "error"` in eslint.config.js
- [X] T006 [P] Configure Jest with the `jest-expo` preset, `@testing-library/react-native`, setup file jest.setup.ts (AsyncStorage mock from `@react-native-async-storage/async-storage/jest/async-storage-mock`, Reanimated mock) in jest.config.js
- [X] T007 [P] Configure NativeWind (babel preset, metro `withNativeWind`, `global.css` with Tailwind directives, `content: ['./src/**/*.{ts,tsx}']`) in babel.config.js, metro.config.js, tailwind.config.js and global.css
- [X] T008 Add scripts `"start": "expo start"`, `"typecheck": "tsc --noEmit"`, `"lint": "eslint ."`, `"test": "jest"` in package.json
- [X] T009 Create folders `src/app`, `src/screens`, `src/components`, `src/data`, `src/store`, `src/hooks`, `src/theme`, `src/i18n` (with `.gitkeep` where empty) per plan.md
- [X] T010 Run 002/T001–T003 (svg, fonts, splash, svg Jest mock) now so the visual stack is in place

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Domain types, content, pure deck logic, stores, i18n, navigation shell, theme

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Tests (write first, ensure they fail)

- [X] T011 [P] Write the content validation test implementing the 10 rules of contracts/content-schema.md (top level exactly `categories` + `questions`; exactly the 8 IDs `casual, profundo, casais, happy-hour, dilemas, viagens, nostalgia, futuro` in that order; `title` non-empty "≤ 30", `description` non-empty "≤ 80", `color` matching `^#[0-9A-Fa-f]{6}$` and pairwise distinct; `icon` exists in the glyph map; question fields exactly `id`, `categoryId`, `text`; IDs unique and matching `^<categoryId>-\d{3}$`; `categoryId` exists; `text` "trimmed, non-empty and ≤ 200 characters"; "≥ 20 questions" per category; no duplicate normalized text) in `src/data/__tests__/content.test.ts`
- [X] T012 [P] Write tests for `shuffle` (permutation, deterministic with injected `random`), `createDeck` (`order` is a permutation, `cursor = 0`), `advance` (cursor + 1, never beyond `order.length`), `currentQuestionId` (undefined when completed), `isCompleted`, and "não repete perguntas" (walking a full deck yields every ID exactly once) in `src/data/__tests__/deck.test.ts`
- [X] T013 [P] Write tests for the favorites store: `toggle` adds `{ questionId, savedAt }` / removes; `remove`; `isFavorite`; persisted under key `quebra-gelo/favorites` with `version: 1`; on rehydrate "entries whose `questionId` no longer exists are dropped", in `src/store/__tests__/favorites.test.ts`
- [X] T014 [P] Write tests for the in-memory progress store: `ensureDeck` creates a shuffled deck only if missing (calling twice keeps the same order/cursor — resume), `discard` advances, `reshuffle` creates a new order with `cursor 0`, and the store has no `persist`, in `src/store/__tests__/progress.test.ts`

### Implementation

- [X] T015 [P] Define and export `CategoryId` (`'casual' | 'profundo' | 'casais' | 'happy-hour' | 'dilemas' | 'viagens' | 'nostalgia' | 'futuro'`), `Category { id; title; icon; color; description }`, `Question { id; categoryId; text }`, `Favorite { questionId; savedAt }`, `DeckProgress { order: string[]; cursor: number }` in src/data/types.ts
- [X] T016 Create src/data/data.json with the 8 categories in order (titles: Descontraído, Profundo, Casais, Happy Hour, Dilemas, Viagens e Aventuras, Nostalgia e Infância, Futuro e Sonhos; short pt-BR descriptions ≤ 80 chars; colors/icons from 002/T011) and an empty `questions` array (questions are authored in US1)
- [X] T017 Implement `content.ts`: import data.json, narrow it from `unknown` to typed `Category[]`/`Question[]` with type guards (no `any`), and export `getCategories`, `getCategory(id: string)`, `getQuestionsByCategory(id: CategoryId)`, `getQuestion(id: string)`, `isCategoryId(value: string): value is CategoryId` in src/data/content.ts
- [X] T018 [P] Implement pure `shuffle` (Fisher–Yates, optional `random`), `createDeck`, `advance`, `currentQuestionId`, `isCompleted` in src/data/deck.ts (makes T012 pass)
- [X] T019 [P] Implement `useFavoritesStore` with Zustand `persist` + `createJSONStorage(() => AsyncStorage)`, name `quebra-gelo/favorites`, `version: 1`, `onRehydrateStorage`/`merge` filtering IDs not returned by `getQuestion`, and a `hasHydrated` flag in src/store/favorites.ts (makes T013 pass)
- [X] T020 [P] Implement `useProgressStore` (no `persist`) with `decks: Partial<Record<CategoryId, DeckProgress>>`, `ensureDeck`, `discard`, `reshuffle` using deck.ts in src/store/progress.ts (makes T014 pass)
- [X] T021 [P] Create centralized pt-BR UI strings (home title, favorites title/empty state, buttons "Embaralhar de novo", "Escolher outra categoria", "Favoritar", "Remover dos favoritos", accessibility labels/actions "virar", "favoritar", "pular", "Carta de {categoria}, virada para baixo") in src/i18n/strings.ts
- [X] T022 Run 002/T004–T015 (theme tokens, color helpers, category visuals, geometry, palette in data.json, extended content test, Outfit loading + splash gate in src/app/_layout.tsx, NativeWind tokens)
- [X] T023 Build the root layout: `GestureHandlerRootView`, Expo Router `Stack` with dark header styling (`tokens.appBackground`), import `global.css`, keep the 002 font/splash gate and wait for `useFavoritesStore` hydration in src/app/_layout.tsx
- [X] T024 [P] Create thin route files that only render screen containers: src/app/index.tsx → `HomeScreen`, src/app/deck/[categoryId].tsx → `DeckScreen` (reads typed `categoryId`, redirects to `/` when `!isCategoryId(...)`), src/app/favorites.tsx → `FavoritesScreen`
- [X] T025 Run `npm run typecheck && npm run lint && npx jest src/data src/store src/theme` — all green except content rule "≥ 20 questions" (expected to fail until US1 content tasks)

**Checkpoint**: Foundation ready

---

## Phase 3: User Story 1 - Jogar um baralho de perguntas (Priority: P1) 🎯 MVP

**Goal**: Pick a category and play: face-down card, tap to flip, swipe left/right to discard with
physics and haptics, no repeats, resume while the app is open, "Fim do Baralho" at the end.

**Independent Test**: Offline, open any category, flip and discard all cards: questions belong to
the category, never repeat, vibrate on flip/discard, snap-back without vibration, end screen with
both options; leaving and returning (app still open) resumes.

### Tests for User Story 1 ⚠️

- [X] T026 [P] [US1] Write hook tests for `useDeck(categoryId)`: returns `category`, `current`, `position { index, total }`; `discard()` advances; `current` is `undefined` after the last card; `reshuffle()` restarts; returning to the same category keeps progress, in `src/hooks/__tests__/useDeck.test.ts`
- [X] T027 [P] [US1] Write a screen test for `DeckScreen` using accessibility actions (not gestures): "pular" advances to the next question; after the last card `DeckComplete` shows "Embaralhar de novo" (restarts) and "Escolher outra categoria" (navigates to `/`), in `src/screens/__tests__/DeckScreen.test.tsx`

### Content for User Story 1

- [X] T028 [US1] Write 20 original pt-BR questions for `casual` (IDs `casual-001`…`casual-020`, text "trimmed, non-empty, ≤ 200 chars", welcoming and inclusive — no assumptions about gender, orientation, religion, marital status, finances or family structure; nothing copied from commercial games) in src/data/data.json
- [X] T029 [US1] Write 20 questions for `profundo` (`profundo-001`…`profundo-020`, same rules) in src/data/data.json
- [X] T030 [US1] Write 20 questions for `casais` (`casais-001`…`casais-020`, same rules; inclusive of any couple) in src/data/data.json
- [X] T031 [US1] Write 20 questions for `happy-hour` (`happy-hour-001`…`happy-hour-020`, same rules; no pressure to drink) in src/data/data.json
- [X] T032 [US1] Write 20 questions for `dilemas` (`dilemas-001`…`dilemas-020`, same rules) in src/data/data.json
- [X] T033 [US1] Write 20 questions for `viagens` (`viagens-001`…`viagens-020`, same rules; no assumption that the player has traveled) in src/data/data.json
- [X] T034 [US1] Write 20 questions for `nostalgia` (`nostalgia-001`…`nostalgia-020`, same rules; no pressure to reveal painful memories) in src/data/data.json
- [X] T035 [US1] Write 20 questions for `futuro` (`futuro-001`…`futuro-020`, same rules) in src/data/data.json; then run `npx jest src/data` — all content rules pass

### Implementation for User Story 1

- [X] T036 [P] [US1] Implement `useHaptics()` returning `{ flip, discard }`: flip → `impactAsync(ImpactFeedbackStyle.Light)`, discard → `impactAsync(ImpactFeedbackStyle.Medium)`, fire-and-forget with errors swallowed, in src/hooks/useHaptics.ts
- [X] T037 [P] [US1] Implement `useDeck(categoryId)` on top of `useProgressStore` (`ensureDeck` on mount) and content.ts, returning `{ category, current, position, discard, reshuffle }` in src/hooks/useDeck.ts (makes T026 pass)
- [X] T038 [US1] Run 002/T016–T018 and 002/T022–T025 (CategoryPattern, CardBack, CardFront and their tests) so both card faces exist
- [X] T039 [US1] Implement `SwipeCard` per contracts/app-interfaces.md: props `{ question, category, visual, isFavorite, onFlip(face), onDiscard(direction), onToggleFavorite }`; `Gesture.Exclusive(pan, tap)` in a `GestureDetector`; pan `activeOffsetX([-10, 10])`; `translateX` follows the finger with rotation interpolated ±15°; on end discard if "|translateX| > 30% of screen width or |velocityX| > 800", flying off with `withTiming` toward the gesture direction, else `withSpring` back to 0; flip via shared `rotation` 0 ↔ 180 with `rotateY`, `perspective`, `backfaceVisibility: 'hidden'`, back = `CardBack variant="full"`, front = `CardFront`; an `isAnimating` shared value ignores gestures during flip/exit; `onDiscard` called exactly once via `scheduleOnRN` (Reanimated 4) or `runOnJS` (Reanimated 3), per T002, after the exit animation; reset to face `down` when `question.id` changes; `useReducedMotion()` → opacity transitions instead of rotation/fly-off; accessibility label = question (revealed) or "Carta de {categoria}, virada para baixo", `accessibilityActions` `activate` (virar), `favorite` (favoritar), `skip` (pular → `onDiscard('right')`); StyleSheet + animated styles only; size and shadow per 002/T019, in src/components/SwipeCard.tsx
- [X] T040 [P] [US1] Implement `DeckComplete` (`{ category, visual, onReshuffle, onChooseAnother }`) with "Fim do Baralho" title and the two buttons from strings.ts, category color per 002/T034, in src/components/DeckComplete.tsx
- [X] T041 [US1] Implement `DeckScreen`: `useDeck`, `getCategoryVisual`, `getCardGeometry` (reserve header + favorite button height), track `face` state from `onFlip`, call `useHaptics().flip` on flip and `.discard` in `onDiscard`, render `SwipeCard` while `current` exists, otherwise `DeckComplete` (`onChooseAnother` → `router.replace('/')`); no scoreboard/timer; header shows category title and back button, in src/screens/DeckScreen.tsx (makes T027 pass)
- [X] T042 [US1] Add a temporary minimal list of categories (plain pressables) to src/screens/HomeScreen.tsx so US1 is reachable before US2; it is replaced in T046

**Checkpoint**: The core game is playable offline — MVP

---

## Phase 4: User Story 2 - Escolher o contexto na tela inicial (Priority: P2)

**Goal**: Home shows the 8 categories as mini card backs in a grid (2 columns at 320pt), each
with name and description, leading to its deck in one tap.

**Independent Test**: Open the app: exactly 8 categories in order with icon, color, name and
description; readable on a 320pt phone by scrolling; each opens its own deck.

### Tests for User Story 2 ⚠️

- [X] T043 [P] [US2] Write a screen test: `HomeScreen` renders exactly 8 `MiniCard`s in the data.json order with titles and descriptions, pressing one navigates to `/deck/<id>`, and a "Favoritos" entry exists, in `src/screens/__tests__/HomeScreen.test.tsx`

### Implementation for User Story 2

- [X] T044 [US2] Run 002/T028 and 002/T030 (MiniCard test + component)
- [X] T045 [P] [US2] Add a header entry/button to Favorites (`router.push('/favorites')`, label from strings.ts) in src/screens/HomeScreen.tsx
- [X] T046 [US2] Replace the temporary list with a scrollable 2-column grid of `MiniCard` using `getCardGeometry(...).miniWidth` and 16pt gaps, `onPress` → `router.push('/deck/' + id)`, title from strings.ts, NativeWind styling, in src/screens/HomeScreen.tsx (makes T043 pass)

**Checkpoint**: US1 + US2 work; ≤ 2 taps from launch to first card

---

## Phase 5: User Story 3 - Favoritar perguntas (Priority: P3)

**Goal**: A fixed star button below the card (disabled while face down) toggles favorites; the
card shows a star indicator; Favorites screen lists saved questions newest first with removal
and an empty state; favorites survive app restarts.

**Independent Test**: Favorite questions from two categories, kill and reopen the app, open
Favorites: all present newest first with category; remove one; empty state when none.

### Tests for User Story 3 ⚠️

- [X] T047 [P] [US3] Write component tests: `FavoriteButton` shows label "Favoritar"/"Remover dos favoritos" by `active`, is not pressable when `disabled`; `EmptyState` renders title/message, in `src/components/__tests__/FavoriteButton.test.tsx`
- [X] T048 [P] [US3] Write tests for `useFavoriteQuestions()`: joins favorites with questions/categories, sorted by `savedAt` desc, skipping unknown IDs, in `src/hooks/__tests__/useFavoriteQuestions.test.ts`

### Implementation for User Story 3

- [X] T049 [P] [US3] Implement `FavoriteButton` (`{ active: boolean; disabled: boolean; onPress(): void }`) — star icon filled/outlined, NativeWind, accessible label from strings.ts, in src/components/FavoriteButton.tsx
- [X] T050 [P] [US3] Implement `EmptyState` (`{ title: string; message: string }`) in src/components/EmptyState.tsx
- [X] T051 [P] [US3] Implement `useFavoriteQuestions()` in src/hooks/useFavoriteQuestions.ts (makes T048 pass)
- [X] T052 [US3] In `DeckScreen`, render `FavoriteButton` below the card outside the gesture area, `disabled={face === 'down'}`, `active={isFavorite(current.id)}`, `onPress` → `toggle(current.id)`; pass `isFavorite` to `SwipeCard` (indicator via `CardFront`) and wire the `favorite` accessibility action to the same toggle, in src/screens/DeckScreen.tsx
- [X] T053 [US3] Implement `FavoriteListItem` (`{ question, category, visual, onRemove }`) with category color/icon per 002/T033 and a remove button, in src/components/FavoriteListItem.tsx
- [X] T054 [US3] Implement `FavoritesScreen`: list from `useFavoriteQuestions()` newest first, `onRemove` → `remove(id)`, `EmptyState` with the strings.ts message explaining how to favorite when empty, in src/screens/FavoritesScreen.tsx
- [X] T055 [US3] Run 002/T029 (consistency tests) and make them pass

**Checkpoint**: All stories functional

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T056 [P] Update CLAUDE.md "Current state" with the real commands (`npm start`, `npm run typecheck`, `npm run lint`, `npm test`, `npx jest <file>`, `npx jest -t "<name>"`) and remove the "no application code" note
- [ ] T057 [P] Ensure every interactive element has a pt-BR accessibility label/role (cards, buttons, mini cards, list items) across src/components/ and src/screens/
- [ ] T058 Run 002/T036–T039 (docs, gates, visual manual scenarios, 60 fps check)
- [ ] T059 Run `npm run typecheck`, `npm run lint`, `npm test` — all green (merge gate)
- [ ] T060 Run manual scenarios 1–10 of specs/001-icebreaker-cards-mvp/quickstart.md on a physical phone in airplane mode, plus: measure cold-start time from tap on the app icon to the Home grid being visible on a mid-range Android (release/preview build, 3 runs, target ≤ 2 s per SC-007) and confirm flip/discard feel instantaneous (SC-003); record results under a "Results" heading in specs/001-icebreaker-cards-mvp/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** → **Foundational (Phase 2)**, which includes 002 Phases 1–2 (T010, T022)
- **US1 (Phase 3)**: after Foundational; includes 002 US1/US2 card faces (T038)
- **US2 (Phase 4)**: after Foundational + 002/T018 (`CardBack`, needed by `MiniCard`); independent of US1 except the temporary list (T042) it replaces
- **US3 (Phase 5)**: after Foundational; T052 edits `DeckScreen` from US1, so run after T041
- **Polish (Phase 6)**: after the desired stories

### Within Each Story

- Tests first (must fail), then hooks/helpers, then components, then screen wiring
- Commit after each task or logical group (project preference)

### Parallel Opportunities

- Setup: T004–T007
- Foundational tests T011–T014 together; T015, T018–T021 in parallel after types; T024 alongside T023
- US1: T026/T027 together; T036/T037/T040 together (content tasks T028–T035 share data.json → sequential)
- US3: T047/T048 together; T049/T050/T051 together

---

## Parallel Example: Phase 2

```bash
Task: "Content validation test in `src/data/__tests__/content.test.ts"`
Task: "Deck logic tests in `src/data/__tests__/deck.test.ts"`
Task: "Favorites store tests in `src/store/__tests__/favorites.test.ts"`
Task: "Progress store tests in `src/store/__tests__/progress.test.ts"`
```

## Parallel Example: User Story 1

```bash
Task: "useHaptics in src/hooks/useHaptics.ts"
Task: "useDeck in src/hooks/useDeck.ts"
Task: "DeckComplete in src/components/DeckComplete.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 + Phase 2 (with 002 foundation)
2. Phase 3: content + card + deck screen
3. **STOP and VALIDATE** on device (quickstart scenarios 2–6)

### Incremental Delivery

1. Foundation → US1 (playable game) → US2 (Home grid) → US3 (favorites) → Polish
2. Each story keeps the app working; validate after each

---

## Notes

- 002 tasks are executed at the points marked "Run 002/…"; mark them done in both files
- In this combined flow, 002/T019–T021, 002/T026–T027, 002/T031 and 002/T035 are covered by
  001/T039, T041, T046, T052–T054 (components are built with the final visuals directly), and
  002/T032 (delete `CategoryTile`) has nothing to delete — mark them done when those 001 tasks are
- Quote constraints exactly as written; do not improvise thresholds, colors or sizes
- Avoid mixing NativeWind and StyleSheet inside one component; no `any`
