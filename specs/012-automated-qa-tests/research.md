# Research: Testes Automatizados e Prevenção de Regressão (012)

## R1 — Pre-commit hook tooling

- **Decision**: Husky 9 + lint-staged, installed as devDependencies, with `"prepare": "husky"` in
  `package.json` so `npm install` / `npm ci` activates the hooks (FR-003). The hook lives in
  `.husky/pre-commit` (plain POSIX sh, run by Git for Windows' bundled `sh` on this machine).
- **Rationale**: the request names Husky + lint-staged; Husky 9 has no runtime, needs no per-hook
  shim and works on Windows/macOS/Linux; `prepare` is the documented zero-config activation.
- **Alternatives considered**: `simple-git-hooks` (lighter, but not what was asked); a hand-written
  `.git/hooks/pre-commit` (not versioned, not activated by install — violates FR-003).
- **Note**: Husky sets `core.hooksPath=.husky/_` in the repository config, which is shared by every
  worktree/checkout. On branches that do not yet contain `.husky/`, the path does not exist and Git
  simply runs no hook, so older branches keep committing as before (spec edge case).

## R2 — What the hook runs, and in which order

- **Decision**: `npx lint-staged` (ESLint on staged `*.{js,jsx,ts,tsx}`) → `npm run typecheck` →
  `npm test -- --ci`. Fail-fast: the first failing step aborts the commit (`set -e` semantics of the
  hook). Content validation is part of the Jest suite (`src/data/__tests__/content.test.ts`).
- **Rationale**: cheapest first (lint on a few files), then whole-project types, then the full suite,
  matching the clarification (lint staged + full typecheck + full tests). `--ci` disables snapshot
  writing and interactive watch behaviour, so a commit never silently updates expectations.
- **Alternatives considered**: `jest --findRelatedTests` on staged files (faster, but the request
  requires `npm test` and related-test detection misses content/JSON regressions); typecheck only in
  CI (rejected in clarification).
- **Budget**: SC-003 asks ≤ 60 s. Measured baseline on this machine is recorded in `quickstart.md`
  during implementation; if over budget, the first lever is Jest `--maxWorkers=50%`, not dropping steps.

## R3 — Repository check on PRs (CI)

- **Decision**: GitHub Actions workflow `.github/workflows/ci.yml`, triggers `pull_request` (any base
  branch) and `push` to `main`; `ubuntu-latest`, Node 24 (same major as local), `actions/setup-node`
  with npm cache, `npm ci`, then `typecheck`, `lint`, `test -- --ci`. `concurrency` cancels
  superseded runs of the same ref.
- **Rationale**: the repo is on GitHub (`afsb12/Quebra-Gelo`); Actions is free for this use and shows
  status directly on the PR (FR-004/FR-005). Running each gate as its own step makes the failing gate
  obvious in the PR log.
- **Alternatives considered**: EAS Workflows (builds-oriented, needs an Expo account); running only
  `npm test` (merge gates also require types and lint).
- **Risk**: pushing files under `.github/workflows/` requires a token with the `workflow` scope. If the
  stored git credential lacks it, the push is rejected; the fallback is to report it and let the user
  push that file (or add the scope) — the local hook still works independently.
- **Constitution**: dev tooling only; nothing ships in the app, no backend or tracking (Princípio I).

## R4 — Simulating the real swipe gesture in Jest

- **Decision**: give the hook gestures in `SwipeCard` stable test identifiers
  (`testID: 'swipe-card-pan'`, `'swipe-card-tap'` in the `usePanGesture` / `useTapGesture` configs) and
  drive them in tests with `getByGestureTestId` + `fireGestureHandler` (or `createGestureController`)
  from `react-native-gesture-handler/jest-utils`, sending `translationX`/`velocityX` payloads.
- **Rationale**: Gesture Handler 3.3 jest-utils support hook (`SingleGesture`) gestures and call the
  real `onUpdate`/`onDeactivate`/`onActivate` worklets, so the actual threshold logic is exercised
  (FR-013, clarification: gesture simulation is mandatory). `testID` on a gesture config is a no-op in
  production (FR-019).
- **Alternatives considered**: keep using accessibility actions only (they bypass the gesture — the
  gap this feature closes); `fireEvent` touch events (Gesture Handler does not listen to RN responder
  events in Jest).

## R5 — Pure release decision

- **Decision**: extract the `onDeactivate` decision into an exported worklet-safe pure function in
  `SwipeCard.tsx` (next to `resistX`):
  `resolveSwipeRelease({ translationX, velocityX, screenWidth, canGoBack }) → 'left' | 'right' | null`
  (`null` = spring back). `onDeactivate` calls it; behaviour is unchanged.
- **Rationale**: lets the thresholds (30 % of the screen width, 800 pt/s flick, blocked right on the
  first card) be tested exhaustively and cheaply, as a complement to R4 (clarification Q3).
- **Alternatives considered**: a new file under `src/data` (it is gesture physics, not game data; it
  stays with the component like `resistX`).

## R6 — "Shuffle actually reorders" without flakiness

- **Decision**: add a test that, over 50 seeded random sources, the shuffled order differs from the
  input in at least one run and every run is a permutation (no loss, no duplicates); plus a check with
  a fixed seed that the result differs from the input order.
- **Rationale**: a legitimate Fisher-Yates can return the original order; seeded sources make the test
  deterministic (FR-017) while still catching a no-op shuffle.

## R7 — Determinism and animation timing

- **Decision**: keep the existing global mocks (`react-native-reanimated/mock`, worklets mock,
  Gesture Handler `jestSetup`, haptics, AsyncStorage). The Reanimated mock invokes animation callbacks
  immediately (`withTiming`/`withSpring` call `callback(true)`), so exit animations complete instantly;
  tests that depend on timeouts (toasts) already use `jest.useFakeTimers()`. Add
  `clearMocks: true` to `jest.config.js` so haptics call counts never leak between tests (needed for
  "exactly once" assertions, FR-014).
- **Verification**: SC-004 — run the suite 10× in a row (`for` loop in quickstart) with zero failures.

## R8 — Haptics "exactly once"

- **Decision**: assert at screen level (`DeckScreen`) with gesture simulation: tap → `impactAsync`
  called once with `Light`; left swipe and right swipe → once with `Medium` each; "Mudar o clima" button (replaced reshuffle in 011) →
  `notificationAsync` once with `success`; snap-back → no haptic.
- **Rationale**: haptics are wired in the screen (`useHaptics` → `onFlip`, `onSwipeConfirmed`,
  reshuffle), so only a screen-level test proves the full chain.

## R9 — Tutorial persistence at screen level

- **Decision**: the existing "Pular" test already reads AsyncStorage
  (`quebra-gelo/onboarding`) after closing; add a relaunch test that rehydrates from storage and renders
  HomeScreen (the "is not shown once seen" test sets state directly). The store field is literally
  `hasSeenTutorial`, plus `tutorialVersion` (009).

## R10 — Coverage map

- **Decision**: `contracts/coverage-map.md` lists each core rule (FR-006…FR-014) → test file + test
  name. Existing tests are reused (FR-020); new tests are marked `(012)` in their names, following the
  project convention.
