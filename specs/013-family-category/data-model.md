# Data Model: Nova Categoria "Família"

No new entities or fields. Existing types in `src/data/types.ts` gain one value.

## CategoryId (extended)

`CATEGORY_IDS` becomes (order = display order):

```text
casual, primeiros-encontros, profundo, casais, happy-hour, dilemas, viagens, nostalgia, familia, futuro
```

Effects through the type system: `CategoryId` gains `'familia'`;
`CATEGORY_INK: Record<CategoryId, string>` and the test `TABLE: Record<CategoryId, …>` must have
the key (compile error otherwise); `isCategoryId` / `isDeckId` accept it; `getQuestionsByCategory`
indexes it.

## Category entry

| Field | Value | Rule |
|---|---|---|
| `id` | `familia` | in `CATEGORY_IDS`, index 8 (R5) |
| `title` | `Família` | ≤ 30 chars (7) |
| `icon` | `home-heart` | exists in MaterialCommunityIcons (R1) |
| `color` | `#27AE60` | `#RRGGBB`, unique; ΔE ≥ 25 from every other back (R2) |
| `description` | `Histórias, memórias e risadas com quem é do seu sangue (ou do seu coração).` | ≤ 80 chars (75) (R8) |

Derived visual (`getCategoryVisual`): `color #27AE60`, `onColor = onColorDark` (6.00:1),
`ink #007A15` (from `CATEGORY_INK`, 4.88:1 on cream; ΔE ≥ 25 from every other ink).

## Question entries

| Field | Rule |
|---|---|
| `id` | `familia-001` … `familia-030`, consecutive, unique, never reused |
| `categoryId` | `familia` |
| `text` | pt-BR, trimmed, 1–200 chars, ends with `?`, no yes/no opener, unique (normalized) across all categories, passes test 15 (R4) |

Count: exactly 30 (test #9), five per theme of FR-007 (R3).

## Persisted state (unchanged)

- Favorites: `questionId` + `savedAt`; new IDs simply become favoritable.
- Mix filter: `excluded: CategoryId[]`; the new ID is absent → on (R6).
- Deck progress: in memory only.
