# Implementation Plan: Testes Automatizados e Prevenção de Regressão (QA)

**Branch**: `012-automated-qa-tests` | **Date**: 2026-11-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/012-automated-qa-tests/spec.md`

## Summary

Turn the existing Jest suite into an enforced gate and close the core-coverage gaps. Locally, Husky 9 +
lint-staged run ESLint on staged files, a full typecheck and the full test suite before every commit
(activated by `npm install` via `prepare`). Remotely, a GitHub Actions workflow runs typecheck, lint
and tests on every PR and every push to `main`. In the suite, the real swipe gesture is driven through
Gesture Handler 3 jest-utils (`getByGestureTestId`) instead of only accessibility actions; the release
decision is extracted as a pure `resolveSwipeRelease` function; haptics are asserted "exactly once"
per interaction; shuffle variation and the tutorial "stored on device" check are added; a rule → test
map documents coverage. No player-visible change.

## Technical Context

**Language/Version**: TypeScript 6 (strict), Node 24 for tooling

**Primary Dependencies**: Expo SDK 58, React Native 0.88, Jest 30 + jest-expo 58, RNTL 14, Gesture
Handler 3.3 (jest-utils), Reanimated 4.7 mock, Worklets 0.13 mock. **New devDependencies**: `husky`
(^9), `lint-staged` (^16) — tooling only, not bundled in the app.

**Storage**: N/A (tests use the AsyncStorage jest mock)

**Testing**: Jest (`npm test`), RNTL; gesture simulation via `react-native-gesture-handler/jest-utils`

**Target Platform**: developer machines (Windows/macOS/Linux, Git hook via `sh`) and GitHub Actions
`ubuntu-latest`

**Project Type**: mobile-app (Expo managed) — this feature touches tooling and tests only

**Performance Goals**: pre-commit hook ≤ 60 s (SC-003); CI result ≤ 10 min (SC-005)

**Constraints**: deterministic suite (10/10 runs green, SC-004); zero behaviour change (FR-019)

**Scale/Scope**: ~30 test files today; ~3 files extended, 2 config files, 1 hook, 1 workflow, 1 tiny
production refactor (`SwipeCard` release decision + gesture `testID`s)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / rule | Status | Notes |
|---|---|---|
| I. Zero Fricção (no backend, offline, no tracking) | ✅ | Husky/lint-staged/CI are dev tooling; nothing ships in the bundle, no network at runtime. |
| II. Imersão Tátil (gestures with physics on UI thread, haptics on flip/discard) | ✅ | Gesture logic unchanged; `resolveSwipeRelease` is a `'worklet'` pure function called inside `onDeactivate`, so it still runs on the UI thread. Tests now *prove* haptics on flip/discard. |
| III. Tipagem Estrita (strict, no `any`) | ✅ | New tests and helper are fully typed; jest-utils generics used instead of `any`; typecheck now enforced pre-commit. |
| IV. Arquitetura Limpa | ✅ | `resolveSwipeRelease` stays in the UI component (gesture physics, like `resistX`), no store/data import. Business rules remain in `src/data`/`src/store`. |
| Stack: no eject, StyleSheet/NativeWind not mixed | ✅ | No native change; `SwipeCard` keeps StyleSheet only. |
| New dependencies justified (YAGNI) | ✅ | `husky` + `lint-staged` explicitly requested; no alternative fulfils FR-001/FR-003 with less. |
| Quality flow: data-layer logic tested; content JSON validated; merge gates | ✅ | This feature *enforces* those gates locally and on PRs. |
| Conteúdo e Experiência | ✅ | No content or UI change. |

**Post-design re-check**: ✅ unchanged — the design adds no runtime dependency, no UI change and only a
behaviour-preserving extraction in `SwipeCard`.

## Project Structure

### Documentation (this feature)

```text
specs/012-automated-qa-tests/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── quality-gates.md     # pre-commit + CI steps
│   └── coverage-map.md      # core rule → test (FR-018)
├── checklists/requirements.md
└── tasks.md                 # /speckit-tasks
```

### Source Code (repository root)

```text
package.json                 # + prepare: husky, + lint-staged config, + devDeps husky/lint-staged
.husky/pre-commit            # lint-staged → typecheck → test --ci
.github/workflows/ci.yml     # PR (any base) + push main: npm ci, typecheck, lint, test
jest.config.js               # + clearMocks: true
src/components/SwipeCard.tsx # + export resolveSwipeRelease (pure worklet); gesture testIDs
src/components/__tests__/SwipeCard.test.tsx   # + resolveSwipeRelease table, gesture-driven swipes
src/screens/__tests__/DeckScreen.test.tsx     # + gesture swipes, tap reveal (mixed), haptics once
src/screens/__tests__/HomeScreen.test.tsx     # + tutorial flag stored on device after close
src/data/__tests__/deck.test.ts               # + shuffle variation across seeded sources
src/test-utils/gestures.ts   # typed helpers: swipeCard(dx, vx), tapCard() over jest-utils
CLAUDE.md / README.md        # document hooks, CI and "no --no-verify" policy
```

**Structure Decision**: single Expo app; tests stay co-located in `__tests__` folders. Shared gesture
helpers go in `src/test-utils/` (imported only by tests; excluded from nothing because it has no
runtime import from app code).

## Complexity Tracking

No constitution violations.
