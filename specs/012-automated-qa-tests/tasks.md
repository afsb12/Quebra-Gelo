---

description: "Task list for automated QA gates and core regression coverage"
---

# Tasks: Testes Automatizados e Prevenção de Regressão (QA)

**Input**: Design documents from `/specs/012-automated-qa-tests/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/quality-gates.md,
contracts/coverage-map.md, quickstart.md

**Tests**: this feature *is* tests — test tasks are the deliverable (spec FR-006…FR-018).

**Organization**: US1 pre-commit gate (P1), US3 core rule coverage (P1), US4 card interactions (P2),
US2 PR check (P2). US3 comes right after US1 because the gate only protects what is covered.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [ ] T001 Run `npm run typecheck`, `npm run lint`, `npm test -- --ci` in the worktree and confirm all green (baseline); note the wall-clock time of `npm test -- --ci` and `npm run typecheck` for SC-003
- [ ] T002 Install the hook tooling as devDependencies with `npx expo install husky lint-staged -- --save-dev` (updates package.json and package-lock.json)

---

## Phase 2: Foundational

- [ ] T003 Add `clearMocks: true` to jest.config.js so mock call counts (haptics) never leak between tests (research R7); run `npm test -- --ci` and confirm still green
- [ ] T004 [P] Create typed gesture helpers in src/test-utils/gestures.ts over `react-native-gesture-handler/jest-utils`: `swipeCard(translationX: number, velocityX = 0)` (drives the gesture with testID `swipe-card-pan` through BEGAN → ACTIVE → update → END with `translationX`/`velocityX`) and `tapCard()` (gesture `swipe-card-tap`), both wrapped in RNTL `act`; no `any` (use jest-utils generics / `unknown`)
- [ ] T005 In src/components/SwipeCard.tsx add `testID: 'swipe-card-pan'` to the `usePanGesture` config and `testID: 'swipe-card-tap'` to the `useTapGesture` config (no behaviour change, FR-019)

**Checkpoint**: gestures addressable from tests; suite green.

---

## Phase 3: User Story 1 - Bloquear commits que quebram o jogo (Priority: P1) 🎯 MVP

**Goal**: every commit runs lint on staged files, full typecheck and the full suite; any failure aborts.

**Independent Test**: quickstart §2 — mutate `goBack`, commit is aborted naming the failing test;
revert, commit succeeds.

- [ ] T006 [US1] In package.json add `"prepare": "husky"` to scripts and a `"lint-staged"` block: `"*.{js,jsx,ts,tsx}": "eslint --max-warnings=0"` (if existing warnings make `--max-warnings=0` fail on untouched files, use plain `eslint` and note it in research.md)
- [ ] T007 [US1] Run `npx husky init` (or `npm run prepare`) and write .husky/pre-commit with, in order, `npx lint-staged`, `npm run typecheck`, `npm test -- --ci` (contract quality-gates.md, fail-fast); confirm `git config core.hooksPath` is `.husky/_`
- [ ] T008 [US1] Verify US1 per quickstart §2: apply the FR-008 mutation in src/data/deck.ts, attempt a commit, confirm it is aborted with the failing test named, revert; also the `any` lint variant on a scratch staged file; record the outcome in quickstart.md
- [ ] T009 [US1] Time `sh .husky/pre-commit` and record it in quickstart.md §3 (must be ≤ 60 s, SC-003; if over, add `--maxWorkers=50%` to the hook's test step and re-measure)

**Checkpoint**: the gate is live — every following commit is verified by it.

---

## Phase 4: User Story 3 - Cobertura garantida das regras core (Priority: P1)

**Goal**: each core rule FR-006…FR-011 has a named test that fails under a simple mutation.

**Independent Test**: quickstart §4 mutations for FR-006…FR-011 each make ≥ 1 test fail.

- [ ] T010 [P] [US3] In src/data/__tests__/deck.test.ts add `shuffle › reorders: seeded runs differ from the input order (012)`: for 50 seeded sources every result is a permutation of the input (same length, same sorted ids, no duplicates) and at least one result differs from the input order; plus one fixed seed whose result `not.toEqual` the input
- [ ] T011 [P] [US3] In src/data/__tests__/deck.test.ts add `navigation › advance is +1 and goBack is −1, never below the first card (012)`: from cursor 2, `goBack` → 1 → 0, a further `goBack` keeps 0 (same object), `advance` from 0 → 1
- [ ] T012 [P] [US3] In src/screens/__tests__/HomeScreen.test.tsx add `a launch after closing it reads the stored flag and does not show the tutorial (012)`: close the tutorial ("Pular"), unmount, reset the store to `hasSeenTutorial: false`, `await useOnboardingStore.persist.rehydrate()` (simulated relaunch reading AsyncStorage `quebra-gelo/onboarding`), render HomeScreen again and assert no `tutorial-backdrop`. (The existing "Pular" test already asserts the stored `{ hasSeenTutorial: true, tutorialVersion: 2 }`; the existing "is not shown once seen" test sets state directly, not via storage — analyze finding A1.)
- [ ] T013 [US3] Run quickstart §4 mutations for FR-006, FR-007, FR-008, FR-009, FR-010, FR-011 one at a time (`npx jest <file>`), confirm ≥ 1 failure each, revert; strengthen any test that does not fail

**Checkpoint**: data/state rules protected.

---

## Phase 5: User Story 4 - Interações da carta testadas como o jogador as faz (Priority: P2)

**Goal**: real gesture simulation for left/right/below-threshold, tap reveal in mixed mode, haptics once.

**Independent Test**: SwipeCard and DeckScreen gesture tests pass; quickstart §4 FR-012…FR-014
mutations each make ≥ 1 test fail.

- [ ] T014 [US4] In src/components/SwipeCard.tsx extract the release decision into an exported pure worklet `resolveSwipeRelease({ translationX, velocityX, screenWidth, canGoBack }): SwipeDirection | null` with the data-model.md table ("`|translationX| > 0.3 × screenWidth`" decides by sign; else "`|velocityX| > 800`" decides by velocity sign; `right` with `!canGoBack` → `null`; otherwise `null`) and call it from `onDeactivate` (behaviour unchanged)
- [ ] T015 [P] [US4] In src/components/__tests__/SwipeCard.test.tsx add `resolveSwipeRelease (012)` table tests: passed left, passed right with/without `canGoBack`, flick left/right below distance, below both thresholds → `null`, exactly at 30 % → `null`
- [ ] T016 [P] [US4] In src/components/__tests__/SwipeCard.test.tsx add gesture-driven tests `(012)` using src/test-utils/gestures.ts: `swipeCard(-200)` with screenWidth 400 → `onSwipeConfirmed('left')` and `onDiscard('left')` once; `swipeCard(200)` with `canGoBack` → `'right'`; `swipeCard(200)` without `canGoBack` → neither callback; `swipeCard(-50)` → neither; `tapCard()` → `onFlip('up')`
- [ ] T017 [US4] In src/screens/__tests__/DeckScreen.test.tsx add `DeckScreen — gestures (012)`: in a category deck, flip with `tapCard()`, `swipeCard(-width)` shows the next question and "Carta 2 de N"; `swipeCard(+width)` brings the previous question back face up; `swipeCard(-10)` keeps the same card
- [ ] T018 [US4] In src/screens/__tests__/DeckScreen.test.tsx (mixed block) add `tapping the card reveals the question and its origin badge (012)`: face down the label is the mixed face-down label and no `category-badge-title`; after `tapCard()` the question text and origin badge title are shown
- [ ] T019 [US4] In src/screens/__tests__/DeckScreen.test.tsx add `haptics (012)`: `tapCard()` → `impactAsync` called exactly once with `Light`; left swipe → once with `Medium`; right swipe → once with `Medium`; below-threshold drag → `impactAsync` not called; reshuffle button → `notificationAsync` exactly once with `success` (reuse the reshuffle block setup)
- [ ] T020 [US4] Run quickstart §4 mutations for FR-012, FR-013, FR-014, confirm ≥ 1 failure each, revert

**Checkpoint**: interactions protected end to end.

---

## Phase 6: User Story 2 - Barrar PRs quebrados (Priority: P2)

**Goal**: every PR (any base) and push to `main` runs typecheck, lint and tests on GitHub.

**Independent Test**: quickstart §5 — PR shows the CI status.

- [ ] T021 [US2] Create .github/workflows/ci.yml per contracts/quality-gates.md: `on: pull_request` (any branch) and `push: branches: [main]`; `concurrency: { group: ci-${{ github.ref }}, cancel-in-progress: true }`; job `checks` on `ubuntu-latest` with `actions/checkout@v4`, `actions/setup-node@v4` (`node-version: 24`, `cache: npm`), steps `npm ci`, `npm run typecheck`, `npm run lint`, `npm test -- --ci`; `timeout-minutes: 10`
- [ ] T022 [US2] After pushing the branch and opening the PR, confirm the CI check runs and reports on the PR (if the push of the workflow is rejected for missing `workflow` token scope, report it — research R3)

---

## Phase 7: Polish & Cross-Cutting

- [ ] T023 [P] Update specs/012-automated-qa-tests/contracts/coverage-map.md: replace every "(new)" with the final test names and set Status to **implemented**
- [ ] T024 [P] Document the gates in CLAUDE.md (Commands: hook runs lint-staged → typecheck → tests on every commit, activated by `npm install`; CI on PRs; `--no-verify` is not the normal path) and in README.md
- [ ] T025 Run the suite 10× in a row per quickstart §1 (SC-004) and the full gates `npm run typecheck && npm run lint && npm test -- --ci`; mark tasks complete

---

## Dependencies & Execution Order

- Setup (T001–T002) → Foundational (T003–T005) → US1 (T006–T009) → US3 (T010–T013) and US4
  (T014–T020) → US2 (T021–T022) → Polish (T023–T025).
- US3 and US4 are independent of each other (different rules); both need T003; US4 needs T004–T005.
- T014 before T015; T004+T005 before T016–T019; T017–T019 edit the same file → sequential.
- US2 depends only on Setup; it is last because it is verified on push.

## Parallel Example

```text
T004 (src/test-utils/gestures.ts)  ‖  T005 (SwipeCard testIDs)
T010, T011 (deck.test.ts — same file, do sequentially)  ‖  T012 (HomeScreen.test.tsx)
T015, T016 (SwipeCard.test.tsx)  ‖  T017–T019 (DeckScreen.test.tsx)
T023 ‖ T024
```

## Implementation Strategy

1. **MVP = US1**: the gate over the existing ~30-file suite already blocks most regressions.
2. Add US3 (rule gaps) then US4 (gesture/haptics) — each commit passes through the new gate.
3. US2 last: CI on the PR.
