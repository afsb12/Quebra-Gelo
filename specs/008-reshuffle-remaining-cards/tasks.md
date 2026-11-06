---

description: "Task list for the in-game reshuffle of the remaining cards"
---

# Tasks: Re-embaralhar as Cartas Restantes Durante o Jogo

**Input**: Design documents from `/specs/008-reshuffle-remaining-cards/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/deck-reshuffle.md, quickstart.md

**Tests**: included. The constitution requires automated tests for data-layer logic (drawing,
progress), and FR-017 asks for the reshuffle rule to be tested without rendering.

**Organization**: tasks grouped by user story (US1 reshuffle the queue, US2 confirmation feedback,
US3 discreet button in harmony with the table).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: user story the task belongs to

---

## Phase 1: Setup

- [ ] T001 Run `npm run typecheck`, `npm run lint` and `npm test` on the branch and confirm all green before any change (baseline; no files changed)

---

## Phase 2: Foundational

**Purpose**: strings and the test mock used by every story.

- [ ] T002 [P] Add to the `deck` group in src/i18n/strings.ts: `reshuffleLabel: 'Embaralhar as próximas cartas'` and `reshuffled: 'Cartas embaralhadas'`
- [ ] T003 [P] Extend the `expo-haptics` mock in jest.setup.ts with `notificationAsync: jest.fn(() => Promise.resolve())` and `NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' }`

**Checkpoint**: `npm test` still green.

---

## Phase 3: User Story 1 - Re-embaralhar a fila no meio do jogo (Priority: P1) 🎯 MVP

**Goal**: one tap reorders only the cards not shown yet. The card on the table, its face, the
counter and the seen cards stay the same, and the order is always new when 2 or more cards remain.

**Independent Test**: discard 3 cards, tap the button. Card 4 and "Carta 4 de N" don't change, the
next cards are exactly the unseen ones in a different order, and none of the first 3 come back.

### Tests for User Story 1 (write first, see them fail)

- [ ] T004 [P] [US1] Add a `describe('reshuffleRemaining')` block to src/data/__tests__/deck.test.ts (use the existing `seeded` helper and `IDS`) asserting the data-model invariants: (a) with `cursor = 3` on 20 IDs, `next.cursor === 3`, `next.order.length === 20`, `next.order.slice(0, 4)` equals the old prefix, `next.order.slice(4)` is a permutation of the old tail and differs from it in at least one position; (b) the input deck is not mutated; (c) with exactly 2 remaining cards the tail is swapped; (d) with a constant random source (`() => 0` and `() => 0.999999`) the tail still differs (rotation fallback, research R2); (e) with 0 or 1 remaining cards and with a completed deck (`cursor === order.length`) it returns the **same object** (`toBe`); (f) `remainingCount` and `canReshuffleRemaining` return 17/true at cursor 2 of 20, 1/false at cursor 18, 0/false at cursor 19 and at 20; (g) over 200 seeded runs with cursor 0 on 4 IDs, every result differs from the input tail
- [ ] T005 [P] [US1] Add tests to src/store/__tests__/progress.test.ts: `reshuffleRemaining('futuro')` after two `discard`s keeps `cursor` 2, the first 3 IDs and the set of IDs; on a missing deck it is a no-op (no deck created); on the mixed deck built with `['futuro', 'profundo']` the order keeps length 11 and only those categories' IDs; on a deck with < 2 remaining cards the `decks` object reference is unchanged
- [ ] T006 [P] [US1] Add tests to src/hooks/__tests__/useDeck.test.ts: after one `discard`, `reshuffleRemaining()` keeps `current.id` and `position`; `canReshuffleRemaining` is true at card 1 and false on the second-to-last and last cards (discard `total - 2` and `total - 1` times); after reshuffling, discarding to the end shows each unseen ID exactly once and none seen before (collect IDs)

### Implementation for User Story 1

- [ ] T007 [US1] In src/data/deck.ts add and export `remainingCount(deck)` (`Math.max(0, order.length - cursor - 1)`), `canReshuffleRemaining(deck)` (`remainingCount >= 2`) and `reshuffleRemaining(deck, random = Math.random)`. If it cannot reshuffle, return `deck` itself. Otherwise shuffle `order.slice(cursor + 1)` with the existing `shuffle`; if the result equals the old tail element-wise, retry up to 8 times total, then fall back to rotating the old tail left by one. Return `{ order: [...prefix, ...tail], cursor }` and never mutate the input. Add a JSDoc pointing to data-model.md (makes T004 pass)
- [ ] T008 [US1] In src/store/progress.ts add `reshuffleRemaining: (deckId: DeckId) => void` to `ProgressState` and implement it: if the deck is missing, or `reshuffleRemaining(deck)` returns the same object, return `state` unchanged; otherwise replace that deck. Update the interface doc comment to separate it from `reshuffle` (full restart) (makes T005 pass)
- [ ] T009 [US1] In src/hooks/useDeck.ts add `canReshuffleRemaining: boolean` (`current !== undefined && canReshuffleRemaining(active)`) and `reshuffleRemaining: () => void` (a `useCallback` calling the store action with `deckId`) to `UseDeckResult`, with the JSDoc from contracts/deck-reshuffle.md (makes T006 pass)
- [ ] T010 [P] [US1] In src/hooks/useHaptics.ts add `reshuffle: () => void` to `UseHapticsResult` (JSDoc: system "success" notification pattern) and implement it as fire-and-forget `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined)` (FR-010)
- [ ] T011 [P] [US1] Create src/components/ReshuffleButton.tsx (StyleSheet only, no `className`) exporting `ReshuffleButtonProps { disabled: boolean; onPress: () => void }`: a `Pressable` with `testID="reshuffle-button"`, `accessibilityRole="button"`, `accessibilityLabel={strings.deck.reshuffleLabel}`, `accessibilityState={{ disabled }}`, `disabled={disabled}`, `hitSlop={8}`, a 44×44 round touch target, and the MaterialCommunityIcons `shuffle-variant` icon (size 24, `tokens.colors.iceBlue`)
- [ ] T012 [US1] In src/screens/DeckScreen.tsx, while `current` is set, turn the favorite area into a row `[View flex-1][FavoriteButton][View flex-1 items-end min-w-11 → ReshuffleButton]` with `w-full flex-row items-center px-3`, keeping the tap hint below it. Wire `disabled={!canReshuffleRemaining}` and a `handleReshuffle` `useCallback` that calls `reshuffleRemaining()` and then `haptics.reshuffle()` only when `canReshuffleRemaining`. Leave `face` state untouched, so the card keeps its side (FR-003)
- [ ] T013 [US1] Add tests to src/screens/__tests__/DeckScreen.test.tsx: on "dilemas", skip twice, flip the card (`activate`), press `reshuffle-button` → the same question text is still shown, "Carta 3 de N" is unchanged, the favorite button is still enabled (card still face up), and `Haptics.notificationAsync` was called once with `'success'`; after skipping to the second-to-last card the button is disabled, and pressing it calls no haptic; after the last card, "Fim do Baralho" shows and `queryByTestId('reshuffle-button')` is null

**Checkpoint**: US1 is fully usable. The button reshuffles, vibrates, disables near the end and hides at "Fim do Baralho"; `npm test` is green.

---

## Phase 4: User Story 2 - Confirmação clara da ação (Priority: P2)

**Goal**: the tap is visibly and audibly confirmed: a one-turn spin (none under reduced motion),
a "Cartas embaralhadas" pill that disappears after ~2 s and doesn't stack, and a screen-reader
announcement.

**Independent Test**: tap the button. The icon spins, the pill replaces the hint for ~2 s and the
hint comes back, the screen reader announces it, and a second tap during the toast restarts the
2 s with no second pill.

### Tests for User Story 2

- [ ] T014 [P] [US2] Create src/components/__tests__/HintLine.test.tsx: with only `hint` it renders the hint text and no `deck-toast`; with `toast="Cartas embaralhadas"` it renders `deck-toast` with that text and not the hint
- [ ] T015 [P] [US2] Create src/components/__tests__/ReshuffleButton.test.tsx: it renders with the label "Embaralhar as próximas cartas"; an enabled press calls `onPress` once; while disabled it is `toBeDisabled()` and a press doesn't call `onPress`

### Implementation for User Story 2

- [ ] T016 [P] [US2] Create src/components/HintLine.tsx (StyleSheet only) exporting `HintLineProps { hint: string; toast?: string }`: a fixed-height row (28 pt, centered) that shows the hint `Text` (body font, 14, `textSecondary`) or, when `toast` is set, an `Animated.View` pill `testID="deck-toast"` (`surface` background, `iceBlue` text, rounded, `pointerEvents="none"`) whose opacity fades 0→1 in 150 ms with `withTiming` on a shared value (research R7). Keep the same row height in both states so nothing moves
- [ ] T017 [US2] Add the spin to src/components/ReshuffleButton.tsx: a `useSharedValue(0)` rotation; on an enabled press, `set(0)` then `set(withTiming(360, { duration: 400 }))` unless `useReducedMotion()`; apply it with `useAnimatedStyle` (`rotate: \`${deg}deg\``) on an `Animated.View` around the icon (FR-012)
- [ ] T018 [US2] In src/screens/DeckScreen.tsx replace the hint `Text` with `<HintLine hint={strings.deck.tapHint} toast={toastVisible ? strings.deck.reshuffled : undefined} />`. Add `const [toastNonce, setToastNonce] = useState(0)`, plus a `useEffect` on `toastNonce` that, when it is > 0, sets a 2000 ms `setTimeout` that resets it to 0 and clears on cleanup (each new nonce restarts the 2 s; no stacking). `toastVisible = toastNonce > 0`. In `handleReshuffle` (enabled branch) bump the nonce and call `AccessibilityInfo.announceForAccessibility(strings.deck.reshuffled)` (FR-011, FR-015)
- [ ] T019 [US2] Add tests to src/screens/__tests__/DeckScreen.test.tsx with `jest.useFakeTimers()`: a press shows `deck-toast` "Cartas embaralhadas" and hides the tap hint; `AccessibilityInfo.announceForAccessibility` (spy) is called with "Cartas embaralhadas"; a second press at 1500 ms keeps a single `deck-toast`, which is still visible at 3000 ms and gone at 3600 ms, and the hint "Toque para virar · deslize para pular" is back

**Checkpoint**: US1 + US2 green. The confirmation works with and without reduced motion.

---

## Phase 5: User Story 3 - Botão discreto e em harmonia com a mesa (Priority: P3)

**Goal**: minimal ice-blue button with a translucent dark background, AA contrast in both states,
no overlap at 320 pt even with large fonts, and pressing it never flips or discards the card.

**Independent Test**: on a 320 pt device with large fonts, the button sits bottom-right on the
favorite row with no overlap. Pressing it with the card face down leaves the card face down and
the counter unchanged.

### Tests for User Story 3

- [ ] T020 [P] [US3] Add a test to src/screens/__tests__/DeckScreen.test.tsx: with the card face down, pressing `reshuffle-button` leaves the favorite button disabled (card still face down) and "Carta 1 de N" unchanged (FR-013)

### Implementation for User Story 3

- [ ] T021 [US3] Style src/components/ReshuffleButton.tsx per research R6: background `rgba(34, 30, 43, 0.6)` (surface at 60 %), no border, and `opacity: 0.4` when disabled (same convention as `FavoriteButton`)
- [ ] T022 [P] [US3] In src/components/FavoriteButton.tsx let the button shrink in a tight row: add `shrink` to the `Pressable` classes and `numberOfLines={1}` + `className="shrink ..."` to the label `Text`, so at 320 pt with a large font it truncates instead of overlapping the reshuffle button (research R8). Keep testID, labels and states unchanged, and confirm src/components/__tests__/FavoriteButton.test.tsx still passes

**Checkpoint**: all stories complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T023 Bump the app version for the new build: `version` 1.1.0 → 1.2.0 in app.json and package.json (and both entries in package-lock.json), `android.versionCode` 2 → 3 in app.json
- [ ] T024 Run the quickstart gates (`npm run typecheck`, `npm run lint`, `npm test`) and fix any failure; check the React Compiler lint (use `.get()/.set()` on shared values)
- [ ] T025 Mark the completed tasks `[X]` in specs/008-reshuffle-remaining-cards/tasks.md and record any deviation from the plan in its Notes section

---

## Dependencies & Execution Order

- **Setup (T001)** → **Foundational (T002–T003)** → user stories.
- **US1**: T004–T006 (tests, parallel) → T007 → T008 → T009. T010 and T011 can run in parallel
  with T007–T009. T012 needs T009–T011, and T013 needs T012.
- **US2** depends on US1's screen wiring (T012): T014/T015 [P] → T016 [P], T017 → T018 → T019.
- **US3** depends on T011/T012: T020 [P], T021 (same file as T017, so run after it), T022 [P].
- **Polish** after all stories.

## Parallel Example: User Story 1

```text
Task: "reshuffleRemaining tests in src/data/__tests__/deck.test.ts"        (T004)
Task: "store tests in src/store/__tests__/progress.test.ts"                (T005)
Task: "hook tests in src/hooks/__tests__/useDeck.test.ts"                  (T006)
Task: "useHaptics.reshuffle in src/hooks/useHaptics.ts"                    (T010)
Task: "ReshuffleButton in src/components/ReshuffleButton.tsx"              (T011)
```

## Implementation Strategy

1. **MVP**: Setup + Foundational + US1. The reshuffle works with a haptic; validate with T013 and
   quickstart steps 1–5.
2. **US2**: add the visual and screen-reader confirmation (quickstart 7–8).
3. **US3**: visual polish and the narrow-screen layout (quickstart 6, 9).
4. **Polish**: bump the version, run the gates, then build the APK.

## Notes

- A commit after each phase (Conventional Commits: `feat:`, `test:`, `chore:`).
- The existing `reshuffle` (end-of-deck restart) must keep its behavior; its tests must stay green.
