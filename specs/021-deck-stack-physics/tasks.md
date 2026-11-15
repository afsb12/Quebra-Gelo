# Tasks: Física da Pilha de Cartas

**Input**: `/specs/021-deck-stack-physics/` · **Tests**: included.

## Phase 1: Setup

No setup needed.

## Phase 2: Foundational

- [ ] T001 `src/components/DeckStack.tsx`: `StackPose`, `STACK_SLOTS` (R1 table), worklets `stackSlotPose(slot)` (linear, clamped to [0, 3]) and `stackVisibility(slot, remaining)`; unit tests in new `src/components/__tests__/DeckStack.test.tsx` (exact poses at slots 0–3, midpoint 0.5 and 1.5 incl. the tilt flip, clamping, visibility near the end)
- [ ] T002 `src/components/SwipeCard.tsx`: worklet `stackDragProgress(tx, screenWidth)` (0…1 at 30 %, 0 for right drags); tests in `src/components/__tests__/SwipeCard.test.tsx`

## Phase 3: User Story 1 - O monte acompanha o dedo (P1) 🎯 MVP

- [ ] T003 [US1] `src/components/DeckStack.tsx`: props `remaining` + optional `progress`; `min(3, remaining + 1)` `Animated.View` layers (farthest first) with `useAnimatedStyle` from `stackSlotPose(i − p)` × `stackVisibility`; testIDs `deck-stack-card` / `deck-stack-incoming` (R2); null when `remaining = 0`; stays decorative; move the old DeckStack test out of `DeckActionBar.test.tsx` into `DeckStack.test.tsx` (rest poses, counts 2/1/0, hidden from accessibility, progress 1 = promoted poses)
- [ ] T004 [US1] `src/components/SwipeCard.tsx`: optional `stackProgress`; `onUpdate` writes `stackDragProgress` (unless blocked/animating); spring-back also springs it to 0; reduced motion pins it to 0
- [ ] T005 [US1] `src/screens/DeckScreen.tsx`: `useSharedValue(0)` → `DeckStack progress` + `SwipeCard stackProgress`; `remaining = max(0, total − index)`

## Phase 4: User Story 2 - Avançar promove o monte (P1)

- [ ] T006 [US2] `src/components/SwipeCard.tsx`: left exit (gesture and imperative `swipe('left')`) animates `stackProgress` to 1 with the exit timing; mount settles it with `withSpring(0)`; tests: a left swipe past the threshold leaves the progress at 1 before `onDiscard`, a short drag springs it back to 0

## Phase 5: User Story 3 - Voltar devolve a carta ao monte (P2)

- [ ] T007 [US3] `src/components/SwipeCard.tsx`: `enterFrom?: 'left'` — mounts at `−0.6 × screenWidth`, springs to 0; `stackProgress` 1 → spring 0; ignored under reduced motion
- [ ] T008 [US3] `src/screens/DeckScreen.tsx`: `enterFrom` state set to `'left'` after a right discard and cleared on left discard / change mood; test in `src/screens/__tests__/DeckScreen.test.tsx` (after "Anterior" the card gets `enterFrom="left"`)

## Phase 6: User Story 4 - A primeira carta não tem para onde voltar (P1)

- [ ] T009 [US4] Tests: on the first card a right drag (`swipeCard(+200)`) leaves `stackProgress` at 0 (SwipeCard) and the stack at rest poses (DeckScreen)

## Phase 7: Polish

- [ ] T010 Run `npm run typecheck`, `npm run lint`, `npm test`; fix failures
- [ ] T011 If `specs/012-automated-qa-tests/contracts/coverage-map.md` points at the moved DeckStack test, update it
- [ ] T012 Run `graphify update .`

## Dependencies

T001 → T003; T002 → T004 → T006 → T007; T003 + T004 → T005 → T008; T009 after T005.
