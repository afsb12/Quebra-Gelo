# Contract: Quality Gates (012)

## Local — pre-commit (`.husky/pre-commit`)

Activated by `npm install` / `npm ci` through `"prepare": "husky"` (FR-003).

| # | Step                     | Command                 | Scope                                   |
|---|--------------------------|-------------------------|-----------------------------------------|
| 1 | Lint staged files        | `npx lint-staged`       | staged `*.{js,jsx,ts,tsx}` → `eslint`  |
| 2 | Type check               | `npm run typecheck`     | whole project (`tsc --noEmit`)          |
| 3 | Tests + content validation | `npm test -- --ci`    | whole Jest suite                        |

- Any non-zero exit aborts the commit; later steps do not run.
- Budget: whole hook ≤ 60 s on a typical dev machine (SC-003).
- `git commit --no-verify` remains possible (Git feature) but is not the normal path; CI still blocks.

## Remote — GitHub Actions (`.github/workflows/ci.yml`)

Triggers: `pull_request` (any base branch, opened/synchronize/reopened) and `push` to `main`.

| Step            | Command              |
|-----------------|----------------------|
| Install         | `npm ci`             |
| Type check      | `npm run typecheck`  |
| Lint            | `npm run lint`       |
| Tests + content | `npm test -- --ci`   |

- Runner `ubuntu-latest`, Node 24, npm cache; superseded runs on the same ref are cancelled.
- The run's status is shown on the PR; a failing step is visible by name in the log (FR-005).
- Result within 10 min of the push (SC-005).
