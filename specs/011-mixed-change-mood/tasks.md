---

description: "Task list for the change-mood button in the mixed deck"
---

# Tasks: "Mudar o Clima" no Modo Misturado

**Input**: Design documents from `/specs/011-mixed-change-mood/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/change-mood.md, quickstart.md

**Tests**: included (constitution: data-layer logic MUST be tested before or with the implementation).

**Organization**: US1 change the mood (mixed deck), US2 availability rules, US3 no button in
category decks (removal of 008).

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [ ] T001 Run `npm run typecheck`, `npm run lint`, `npm test` and confirm all green (baseline)

---

## Phase 2: Foundational

- [ ] T002 In src/i18n/strings.ts add `deck.changeMoodLabel: 'Mudar o clima: próxima carta de outra categoria'` and `deck.moodChanged: 'Clima trocado'` (keep `reshuffleLabel`/`reshuffled` until T014 removes their last users); in src/hooks/useHaptics.ts add `changeMood` (same `Haptics.notificationAsync(Success)` pattern, JSDoc "when the mood is changed in the mixed deck (011)")

**Checkpoint**: typecheck green.

---

## Phase 3: User Story 1 - Mudar o clima no modo misturado (Priority: P1) 🎯 MVP

**Goal**: in the mixed deck, a face-up card can be swapped for a never-shown card of another
category, chosen with equal odds per category; history and no-repeat preserved.

**Independent Test**: flip, tap "Mudar o clima" repeatedly; each new card's category differs from
the previous one; swiping right brings back the replaced card.

### Tests for User Story 1

- [ ] T003 [US1] In src/data/__tests__/deck.test.ts add `describe('changeMood (011)')` with a `categoryOf` built from ids like `a1`, `b1`, `c1` (category = first letter): (1) the new current card has a different category, cursor and furthest both +1; (2) history `order[0..furthest_before]` is unchanged and the id multiset is the same; (3) the other tail cards keep their relative order; (4) odds: 1 000 calls with `Math.random`-like seeded generator over a tail with categories `b` ×10, `c` ×1, `d` ×1 and current `a` → each of b/c/d chosen in 25–42% (SC-002); (5) property: from a 4-category deck of 12, any random sequence of `advance`/`goBack`/`changeMood` (300 steps, seeded) visits every id exactly once in `order` and never repeats a shown id (SC-003); (6) returns the same object when not at the frontier (after `goBack`), when every tail card has the current category, on the last card and on a completed deck; `canChangeMood` mirrors those cases; (7) ids with `categoryOf` → `undefined` are never chosen. Confirm the suite FAILS (functions missing)
- [ ] T004 [P] [US1] Create src/components/__tests__/ChangeMoodButton.test.tsx: renders `testID="change-mood-button"` with role button and label `'Mudar o clima: próxima carta de outra categoria'`; calls `onPress` once when enabled; never calls it when `disabled` (and exposes `accessibilityState.disabled`)

### Implementation for User Story 1

- [ ] T005 [US1] In src/data/deck.ts add `export type CategoryOf = (questionId: string) => string | undefined`, `moodCategories`, `canChangeMood` and `changeMood(deck, categoryOf, random = Math.random)` exactly as data-model.md "Transition": tail = `order.slice(furthest + 1)`; categories = distinct defined `categoryOf(id)` of the tail, minus `categoryOf(current)`, in first-appearance order; pick `categories[Math.floor(random() * n)]`; move its first tail card to index `furthest + 1`; return `advance(...)`; return `deck` itself when `canChangeMood` is false (at frontier = `cursor === furthest && cursor < order.length`). JSDoc citing 011 R2/R3. T003 passes
- [ ] T006 [US1] In src/store/progress.ts add action `changeMood(deckId)` using `changeMood(deck, (id) => getQuestion(id)?.categoryId)` (import `getQuestion` from '../data/content'); same-state no-op when missing or unchanged. Add tests in src/store/__tests__/progress.test.ts with the existing content mock (categories casual/profundo/casais/futuro): on the mixed deck, flip-independent store call changes category of the current card, keeps history; no-op on a missing deck (extend the mock's `getQuestion`, already present)
- [ ] T007 [US1] In src/hooks/useDeck.ts add `canChangeMood: boolean` (false for category decks; mixed: `current !== undefined && canChangeMood(active, categoryOfQuestion)`) and `changeMood: () => void` (store `changeMood(deckId)` only when mixed). Add tests in src/hooks/__tests__/useDeck.test.ts: mixed deck → `canChangeMood` true at start and the current category changes after `changeMood`; category deck → always false and `changeMood` leaves the deck unchanged
- [ ] T008 [P] [US1] Create src/components/ChangeMoodButton.tsx per contracts C3 and research R6: 44pt translucent disc (`rgba(34, 30, 43, 0.6)`), icon `weather-partly-cloudy` size 24 in `tokens.colors.iceBlue`, opacity 0.4 when disabled, `hitSlop={8}`; on press call `onPress` then (unless `useReducedMotion()`) animate scale `withSequence(withTiming(1.2, {duration: 150}), withTiming(1, {duration: 150}))` on the icon via `useSharedValue` `.get()/.set()`; StyleSheet only. T004 passes
- [ ] T009 [US1] In src/screens/DeckScreen.tsx (mixed deck only) render `<ChangeMoodButton disabled={face === 'down' || !canChangeMood} onPress={handleChangeMood} />` in the slot of the reshuffle button; `handleChangeMood`: guard, `setFace('down')`, `changeMood()`, `haptics.changeMood()`, bump the toast nonce, `AccessibilityInfo.announceForAccessibility(strings.deck.moodChanged)`; HintLine toast text becomes `strings.deck.moodChanged`
- [ ] T010 [US1] In src/screens/__tests__/DeckScreen.test.tsx add `describe('DeckScreen — change the mood (011)')` for `deckId="mixed"`: after flipping, pressing `change-mood-button` shows a new face-down card (favorite disabled) whose category differs from the previous card's, counter +1, `Haptics.notificationAsync('success')` once; toast "Clima trocado" for 2 s, announced, no stacking (fake timers, same pattern as the old 008 toast test); after `previous` the replaced card is back face up

**Checkpoint**: change mood works end to end in the mixed deck.

---

## Phase 4: User Story 2 - Botão só quando faz sentido (Priority: P2)

**Goal**: disabled face down, while reviewing, and with no other category left.

**Independent Test**: DeckScreen tests below.

- [ ] T011 [US2] In the 011 block of src/screens/__tests__/DeckScreen.test.tsx add: disabled while face down (pressing does nothing: no haptic, counter unchanged); disabled after `previous` and enabled again after `skip` back to the newest card once flipped; with the mix filter set to 2 categories (`useMixFilterStore`) and the progress store seeded so the remaining tail is only the current card's category (set `decks.mixed` directly), the button is disabled after flipping; hidden on "Fim do Baralho"

---

## Phase 5: User Story 3 - Categorias sem o botão (Priority: P2)

**Goal**: no shuffle or mood button in category decks; 008 reshuffle removed everywhere.

**Independent Test**: category deck shows only the favorite button; quickstart grep is empty.

- [ ] T012 [US3] In src/screens/__tests__/DeckScreen.test.tsx replace the whole `describe('DeckScreen — reshuffle the remaining cards (008)')` block with a test that a category deck (`dilemas`) renders neither `reshuffle-button` nor `change-mood-button`, before and after flipping
- [ ] T013 [US3] In src/screens/DeckScreen.tsx remove `ReshuffleButton`, `handleReshuffle` and the `canReshuffleRemaining`/`reshuffleRemaining` wiring; category decks render only the favorite button (keep the two flex spacers so it stays centered)
- [ ] T014 [US3] Remove 008: delete src/components/ReshuffleButton.tsx and src/components/__tests__/ReshuffleButton.test.tsx; in src/data/deck.ts delete `remainingCount`, `canReshuffleRemaining`, `MAX_SHUFFLE_ATTEMPTS`, `sameOrder`, `reshuffleRemaining`; in src/store/progress.ts delete the `reshuffleRemaining` action; in src/hooks/useDeck.ts delete `canReshuffleRemaining`/`reshuffleRemaining`; in src/hooks/useHaptics.ts delete `reshuffle`; in src/i18n/strings.ts delete `deck.reshuffleLabel`/`deck.reshuffled`; delete the 008 tests in src/data/__tests__/deck.test.ts, src/store/__tests__/progress.test.ts and src/hooks/__tests__/useDeck.test.ts (keep "Embaralhar de novo"/`reshuffle` and its tests). Check src/components/__tests__/Consistency.test.tsx and src/components/DeckComplete.tsx still compile

---

## Phase 6: Polish & Cross-Cutting

- [ ] T015 Run quickstart: `npm run typecheck`, `npm run lint`, `npm test`, and the `git grep` for 008 leftovers (expect no output)
- [ ] T016 Bump version to 1.5.0 (versionCode 6) in app.json, package.json, package-lock.json; mark tasks complete in this file

---

## Dependencies & Execution Order

- T001 → T002 → US1 (T003 → T005 → T006 → T007; T004 → T008; T009 → T010) → US2 (T011) → US3 (T012 → T013 → T014) → Polish.
- US2 depends on US1's button; US3 is independent of US1 in behavior but edits the same screen,
  so it runs after it.

### Parallel Opportunities

- T004 and T008 (button test + component) can run in parallel with T003/T005 (data layer).

## Parallel Example: User Story 1

```bash
Task: "T003 changeMood tests in src/data/__tests__/deck.test.ts"
Task: "T004 ChangeMoodButton tests in src/components/__tests__/ChangeMoodButton.test.tsx"
```

## Implementation Strategy

### MVP

T001–T010: the mood button working in the mixed deck.

### Incremental Delivery

US1 → US2 (availability) → US3 (removal of 008) → polish. Commit after each story.
