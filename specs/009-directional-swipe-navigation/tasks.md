---

description: "Task list for directional swipe navigation and the updated tutorial"
---

# Tasks: Navegação Direcional por Gestos e Tutorial Atualizado

**Input**: Design documents from `/specs/009-directional-swipe-navigation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/navigation.md, quickstart.md

**Tests**: included (constitution: data-layer logic must be tested; FR-017).

**Organization**: US1 directional navigation, US2 updated tutorial.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [ ] T001 Run `npm run typecheck`, `npm run lint`, `npm test` and confirm all green (baseline)

---

## Phase 2: Foundational

- [ ] T002 Add `furthest: number` to `DeckProgress` in src/data/types.ts (JSDoc: "Highest index ever shown, `0 ≤ furthest ≤ max(0, order.length - 1)`; history = `order[0..furthest]` (009)"). Set `furthest: 0` in `createDeck`, and in `advance` set `furthest: Math.max(deck.furthest, Math.min(deck.cursor + 1, deck.order.length - 1))` (never below 0), in src/data/deck.ts. Update every literal `DeckProgress` in tests (the `at()` helper in src/data/__tests__/deck.test.ts gets `furthest: Math.max(0, Math.min(cursor, order.length - 1))`)
- [ ] T003 Update strings in src/i18n/strings.ts: `deck.tapHint = 'Toque para virar · ← próxima · anterior →'`; `card.actions`: replace `skip: 'pular'` with `next: 'próxima'` and add `previous: 'voltar'`; `tutorial`: replace `hintSwipe` with `hintNext: 'Deslize para a esquerda para passar a carta'` and `hintBack: 'Deslize para a direita para voltar à carta anterior'`. Update the references in src/components/SwipeCard.tsx and src/components/TutorialOverlay.tsx and the hard-coded hint text in src/screens/__tests__/DeckScreen.test.tsx so that typecheck passes

**Checkpoint**: typecheck green, tests green except the expected text assertions updated in T003.

---

## Phase 3: User Story 1 - Avançar pela esquerda, voltar pela direita (Priority: P1) 🎯 MVP

**Goal**: left = next, right = previous card (face up), elastic block on card 1, replay of seen
cards in order, and the 008 reshuffle limited to never-shown cards.

**Independent Test**: 3 lefts, 2 rights → "Carta 2", the same card as before; 2 lefts replay cards
3 and 4; on card 1 a right drag changes nothing.

### Tests for User Story 1

- [ ] T004 [P] [US1] In src/data/__tests__/deck.test.ts add `describe('navigation (009)')`: `canGoBack` false at cursor 0 and when completed, true at cursor 1; `goBack` at cursor 0 returns the same object; from cursor 3 it gives cursor 2 and keeps `furthest` 3; after `goBack` twice, `advance` twice replays `order[2]`, `order[3]` and leaves `furthest` 3, then the next `advance` gives `furthest` 4; walking a 20-card deck with a random mix of advance/goBack (seeded) until completion shows every ID at least once and the first appearances follow `order`; `remainingCount` uses `furthest` (cursor 2, furthest 5 of 20 → 14); `reshuffleRemaining` at cursor 2 / furthest 5 keeps `order.slice(0, 6)` and reorders only `slice(6)`
- [ ] T005 [P] [US1] In src/store/__tests__/progress.test.ts add: `goBack` on a missing deck is a no-op; on card 1 it keeps the same `decks` reference; after two `discard`s it moves `cursor` to 1 and keeps `furthest` 2
- [ ] T006 [P] [US1] In src/hooks/__tests__/useDeck.test.ts add: `canGoBack` is false on card 1 and true after one `discard`; `goBack()` restores the previous `current.id` and `position.index`; `canReshuffleRemaining` counts only never-shown cards (after `total - 2` discards only 1 never-shown card is left, so it is false; after 5 `goBack`s it is still false even though many cards are ahead)
- [ ] T007 [P] [US1] Create src/components/__tests__/SwipeCard.test.tsx: `resistX` returns 0 for negatives, 10 for 50, 40 for 1000; with `canGoBack` the actions include `previous`, and without it they don't; the `skip` action calls `onDiscard('left')` and `onSwipeConfirmed('left')`; `previous` calls `onDiscard('right')`; with `initialFace="up"` the accessibility label is the question text (render inside `GestureHandlerRootView`)
- [ ] T008 [US1] In src/screens/__tests__/DeckScreen.test.tsx add `describe('directional navigation (009)')`: skip 3 times, then the `previous` action twice → "Carta 2 de N" and the question text equals `order[1]`, with the favorite button enabled (card face up); `skip` twice → `order[2]` then `order[3]` again; on card 1 the swipe card has no `previous` action; `Haptics.impactAsync` is called with `'medium'` on `previous`

### Implementation for User Story 1

- [ ] T009 [US1] In src/data/deck.ts add `canGoBack(deck)` (`deck.cursor > 0 && deck.cursor < deck.order.length`) and `goBack(deck)` (same object when it can't go back, else `{ ...deck, cursor: deck.cursor - 1 }`). Change `remainingCount` to `Math.max(0, order.length - furthest - 1)` and `reshuffleRemaining` to split at `furthest + 1` (prefix `order.slice(0, furthest + 1)`), keeping `cursor` and `furthest`. Update the JSDoc (makes T004 pass)
- [ ] T010 [US1] In src/store/progress.ts add `goBack: (deckId: DeckId) => void` (no-op when missing or `goBack(deck) === deck`) (T005)
- [ ] T011 [US1] In src/hooks/useDeck.ts add `canGoBack: boolean` (`current !== undefined && canGoBack(active)`) and `goBack: () => void` to `UseDeckResult` (T006)
- [ ] T012 [US1] In src/components/SwipeCard.tsx: export `resistX(tx) = Math.min(Math.max(tx, 0) * 0.2, 40)`; add props `canGoBack: boolean` and `initialFace?: CardFace` (default `'down'`); add a `canGoBackSV = useSharedValue(canGoBack)` synced in `useEffect`; initialize `rotation` to 180, `faceUp` to true and `face` to `'up'` when `initialFace === 'up'`. In `onUpdate`, when `!canGoBackSV.get() && translationX > 0` set `translateX` to `resistX(translationX)`. In `onDeactivate`, compute the direction from the translation (or velocity on a flick); if it is `'right'` and `!canGoBackSV.get()`, spring back and return. The `skip` action → `onSwipeConfirmed?.('left'); onDiscard('left')`; add a `previous` action (label `strings.card.actions.previous`) only when `canGoBack` → `onSwipeConfirmed?.('right'); onDiscard('right')`. Update the prop JSDoc ('left' = next, 'right' = previous) (T007)
- [ ] T013 [US1] In src/screens/DeckScreen.tsx: read `canGoBack`, `goBack` from `useDeck`; `handleDiscard(direction)` → `'right'`: `setFace('up'); goBack()`, `'left'`: `setFace('down'); discard()`; pass `canGoBack` and `initialFace={face}` to `SwipeCard` (T008)

**Checkpoint**: US1 fully testable; `npm test` green.

---

## Phase 4: User Story 2 - Tutorial ensina as duas direções (Priority: P2)

**Goal**: 4 directional hints; previous users see it once more.

**Independent Test**: fresh install → 4 hints in order next/back/flip/deck; old stored flag → shown once.

### Tests for User Story 2

- [ ] T014 [P] [US2] Update src/components/__tests__/TutorialOverlay.test.tsx: the `hints` table becomes `tutorial-hint-next`/`back`/`flip`/`deck` with the new texts, `toHaveLength(4)`, each text `≤ 55` characters; the reading order of `getAllByTestId(/^tutorial-hint-/)` is next, back, flip, deck; the `gesture-tap` icon is inside the card container
- [ ] T015 [P] [US2] Update src/store/__tests__/onboarding.test.ts: `markSeen` persists `{ version: 1, state: { hasSeenTutorial: true, tutorialVersion: 2 } }`; a stored `{ hasSeenTutorial: true }` with no `tutorialVersion` (old 005 build) shows the tutorial; a stored `{ hasSeenTutorial: true, tutorialVersion: 2 }` hides it; and update src/screens/__tests__/HomeScreen.test.tsx where it writes a stored "seen" state to include `tutorialVersion: 2`

### Implementation for User Story 2

- [ ] T016 [US2] In src/store/onboarding.ts export `TUTORIAL_VERSION = 2`; `PersistedOnboarding` gains `tutorialVersion: number`; `partialize` writes `{ hasSeenTutorial, tutorialVersion: TUTORIAL_VERSION }`; `readSeen` also requires `tutorialVersion === TUTORIAL_VERSION`; keep persist `version: 1` and the tolerant storage (T015)
- [ ] T017 [US2] In src/components/TutorialOverlay.tsx: replace the single swipe hint with a two-column row above the card: left `tutorial-hint-next` (`text-left`, `flex-1`) and right `tutorial-hint-back` (`text-right`, `flex-1`), `gap-4`. Keep the chevrons at the sides of the card, move the `gesture-tap` icon to the center (`justify-center`, no `pb-6`), and keep the flip hint below the card and the deck hint at the bottom. Update the component JSDoc to say "four short hints" (T014)

**Checkpoint**: US1 + US2 green.

---

## Phase 5: Polish

- [ ] T018 Bump the version to 1.3.0 in app.json, package.json and package-lock.json (root entries) and `android.versionCode` to 4
- [ ] T019 Run the gates (`npm run typecheck`, `npm run lint`, `npm test`) and fix any failure
- [ ] T020 Mark the tasks `[X]` in specs/009-directional-swipe-navigation/tasks.md and note deviations

---

## Dependencies & Execution Order

- T001 → T002, T003 (both touch tests; run in sequence) → US1 → US2 → Polish.
- US1: T004–T007 [P] → T009 → T010 → T011; T012 after T007; T013 after T011/T012 → T008 passes.
- US2 is independent of US1 except for the T003 strings: T014/T015 [P] → T016, T017.

## Parallel Example: User Story 1

```text
Task: "navigation tests in src/data/__tests__/deck.test.ts"   (T004)
Task: "store tests in src/store/__tests__/progress.test.ts"   (T005)
Task: "hook tests in src/hooks/__tests__/useDeck.test.ts"     (T006)
Task: "SwipeCard tests in src/components/__tests__/SwipeCard.test.tsx" (T007)
```

## Implementation Strategy

MVP = US1 (gesture semantics). Then US2 (tutorial), then polish + APK build.

## Notes

- Commit after each phase.
- The 008 tests that build `DeckProgress` literals need `furthest` (T002), but their expectations stay valid.
