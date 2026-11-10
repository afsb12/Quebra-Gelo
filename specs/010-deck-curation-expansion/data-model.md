# Data Model: Expansão e Curadoria Psicológica do Baralho

No type changes. `Question` and `Category` in `src/data/types.ts` stay as they are.

## Question (unchanged shape)

| Field | Type | Rule |
|---|---|---|
| `id` | string | `^<categoryId>-\d{3}$`; per category exactly `001…030`, no gaps (R1) |
| `categoryId` | `CategoryId` | one of the 9 existing categories |
| `text` | string | pt-BR, trimmed, ends with `?`, ≤ 200 chars (target ≤ 120), open question (R2), unique after normalization across the whole deck |

### Lifecycle of an existing question (001–020)

```text
reviewed ──► kept        (same text, or a tiny naturalness fix)
         └─► rewritten   (same ID, same theme, new open/natural wording)
```

Never removed, never reassigned to another theme. New questions (021–030) are created once.

## Category (unchanged)

The 9 categories, their titles, descriptions, colors, icons and order are untouched. Each gets a
**tone intent** (spec FR-008) that guides writing but is not stored.

## Review record (documentation only, `content-review.md`)

| Column | Meaning |
|---|---|
| ID | question ID |
| Ação | `mantida` · `reescrita` · `nova` |
| Assunto | one topic tag, used for the ≥ 6 topics / ≤ 5 per topic rule (R3) |
| Texto | final text (for reviewed ones, the previous text is shown for rewrites) |

## Volumes

| | Before | After |
|---|---|---|
| Questions per category | 20 | 30 |
| Total questions | 180 | 270 |
| Mixed deck (all categories) | 180 | 270 |
