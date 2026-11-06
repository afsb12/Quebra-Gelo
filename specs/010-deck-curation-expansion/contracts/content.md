# Contract: bundled questions after 010

The only interface touched is `src/data/data.json` (`questions` array). `categories` is unchanged
byte for byte.

## C1. Counts and IDs

- Exactly 30 questions per category, 270 in total.
- For each category `c`, the IDs are exactly `c-001 … c-030` (no gaps, no extras).
- Order in the array: by category in `CATEGORY_IDS` order, then by ID (readability only; the app
  shuffles).

## C2. Text rules (enforced by `content.test.ts`)

| # | Rule | Source |
|---|---|---|
| 5 | exactly `id`, `categoryId`, `text` | existing |
| 6 | IDs unique, `^<cat>-\d{3}$` | existing |
| 8 | trimmed, non-empty, ≤ 200 chars | existing |
| 9 | exactly 30 per category, IDs `001…030` | changed (was ≥ 20) |
| 10 | no duplicate normalized text | existing |
| 11 | `primeiros-encontros` date-safe | existing, now for 30 |
| 12 | every text ends with `?` | new |
| 13 | no yes/no opener unless alternatives with ` ou ` | new (research R2) |
| 14 | `happy-hour` workplace-safe term list | new (research R4) |

## C3. Backward compatibility

- Every ID present before 010 still exists and keeps its category (FR-003, FR-016).
- A rewritten question keeps its theme, so a favorite still shows "the same" question in new words.
- Mixed-mode filter, favorites and progress formats unchanged; no migration.
