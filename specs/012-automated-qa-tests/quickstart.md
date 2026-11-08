# Quickstart: validating 012 (automated QA gates)

## Prerequisites

- Node 24, npm, Git (Git for Windows ships the `sh` that runs the hook).
- `npm ci` — also activates the hook via `prepare` (check: `git config core.hooksPath` → `.husky/_`).

## 1. Suite is green and deterministic (SC-004)

```bash
npm run typecheck && npm run lint && npm test -- --ci
for i in 1 2 3 4 5 6 7 8 9 10; do npx jest --ci --silent || { echo "FAIL run $i"; break; }; done
```

Expected: all green, 10/10 runs pass. Verified 2026-11-08: 10/10 (248 tests).

## 2. Pre-commit blocks a broken rule (US1, SC-001)

1. In `src/data/deck.ts`, make `goBack` ignore the first-card guard (e.g. always `cursor - 1`).
2. `git add -A && git commit -m "test: should be blocked"` → commit **aborted**, output names the
   failing `goBack … first card` test(s).
3. Revert the mutation; commit again → commit created with no extra step.

Verified 2026-11-08: commit aborted, `deck.test.ts` and `progress.test.ts` (2 tests) failed, "husky -
pre-commit script failed (code 1)".

Lint variant (acceptance 4): add `const x: any = 1;` to a staged `.ts` file → commit aborted by
lint-staged naming `@typescript-eslint/no-explicit-any` — verified 2026-11-08.

## 3. Hook time budget (SC-003)

```bash
time sh .husky/pre-commit
```

Expected ≤ 60 s. Measured 2026-11-08 (Windows 11, warm Jest cache): **~21 s** for the whole hook
(typecheck ~14 s cold; the first Jest run on a fresh clone has no cache and took ~74 s, later runs ~10–20 s).

## 4. Mutation checks (SC-002)

For each rule in [contracts/coverage-map.md](contracts/coverage-map.md), apply the mutation, run
`npx jest <file>`, confirm ≥ 1 failure, revert:

| Rule | Mutation |
|------|----------|
| FR-006 | `shuffle` returns `[...items]` unchanged |
| FR-007 | `MIN_MIX_CATEGORIES = 1` |
| FR-008 | `canGoBack` returns `deck.cursor >= 0` |
| FR-009 | `toggle` never removes |
| FR-010 | `markSeen` does not persist |
| FR-011 | mix filter `partialize` drops `excluded` |
| FR-012 | mixed mode passes `showOriginBadge={false}` |
| FR-013 | `DISCARD_RATIO = 2` (no drag ever passes) |
| FR-014 | `onSwipeConfirmed` not wired in `DeckScreen` |

## 5. CI (US2, SC-005)

Push the branch and open a PR: the "CI" check runs typecheck, lint and tests and reports on the PR
within 10 minutes.

## 6. No player-visible change (SC-006)

Run the app (`npm start`): swipe, flip, back, reshuffle and the tutorial behave exactly as in 1.4.0.

### Mutation results (2026-11-08)

| Rule | Failing tests under the mutation |
|------|----------------------------------|
| FR-006 (shuffle swap removed) | 1 — `shuffle › reorders … (012)` (only the new test catches a no-op shuffle) |
| FR-007 (`MIN_MIX_CATEGORIES = 1`) | 4 |
| FR-008 (`canGoBack` allows cursor 0) | 4 |
| FR-009 (`toggle` never removes) | 1 |
| FR-010 (persisted flag always `false`) | 3 |
| FR-011 (persisted `excluded` always `[]`) | 1 |
| FR-012 (`showOriginBadge={false}`) | 2 |
| FR-013 (`DISCARD_RATIO = 2`) | 7 |
| FR-013 (first-card right release no longer blocked) | 3 |
| FR-014 (discard haptic unwired) | 2 |
| FR-014 (flip haptic fired twice) | 1 |

Note: in Jest the Reanimated mock recreates shared values on every render, so tests flip a card
with one tap only (a second tap would start from the initial face — a mock artefact, not app
behaviour).
