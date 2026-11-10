# Data Model: Testes Automatizados e Prevenção de Regressão (012)

No app data changes. The feature's "entities" are development artefacts.

## Quality Gate

| Field    | Values                                                                 |
|----------|------------------------------------------------------------------------|
| trigger  | `pre-commit` (local, Husky) · `pull_request` / `push main` (GitHub Actions) |
| steps    | ordered list of checks; see [contracts/quality-gates.md](contracts/quality-gates.md) |
| outcome  | `pass` → commit/PR proceeds · `fail` → commit aborted / PR status red   |

Rule: a step failure stops the remaining steps (fail-fast) and the output names the failing test,
file or lint rule (FR-005).

## Core Rule

| Field  | Description                                                         |
|--------|---------------------------------------------------------------------|
| id     | spec requirement (FR-006 … FR-014)                                 |
| rule   | behaviour that must not regress (e.g. "voltar na primeira carta não muda nada") |
| tests  | ≥ 1 named test that fails when the rule is mutated (SC-002)          |

## Swipe Release Decision (pure function, R5)

Input: `translationX: number`, `velocityX: number`, `screenWidth: number`, `canGoBack: boolean`.
Output: `'left' | 'right' | null` (`null` = spring back).

| Condition                                                                | Output   |
|--------------------------------------------------------------------------|----------|
| `|translationX| > 0.3 × screenWidth`, sign negative                        | `left`   |
| `|translationX| > 0.3 × screenWidth`, sign positive, `canGoBack`         | `right`  |
| not passed, `|velocityX| > 800`, sign of velocity decides (same back rule)| `left` / `right` |
| direction `right` and `!canGoBack`                                       | `null`   |
| neither passed nor flicked                                               | `null`   |

These are the existing 009 thresholds; extraction must not change them.
