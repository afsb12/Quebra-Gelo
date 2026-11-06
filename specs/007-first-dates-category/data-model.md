# Data Model: Nova Categoria "Primeiros Encontros"

No new entities or fields. Existing types in `src/data/types.ts` gain one value.

## CategoryId (extended)

`CATEGORY_IDS` becomes (order = display order):

```text
casual, primeiros-encontros, profundo, casais, happy-hour, dilemas, viagens, nostalgia, futuro
```

Effects through the type system: `CategoryId` gains `'primeiros-encontros'`;
`CATEGORY_INK: Record<CategoryId, string>` must have the key (compile error otherwise);
`isCategoryId` / `isDeckId` accept it; `getQuestionsByCategory` indexes it.

## Category entry

| Field | Value | Rule |
|---|---|---|
| `id` | `primeiros-encontros` | in `CATEGORY_IDS`, index 1 |
| `title` | `Primeiros Encontros` | ≤ 30 chars (19) |
| `icon` | `glass-flute` | exists in MaterialCommunityIcons (R1) |
| `color` | `#FF9F43` | `#RRGGBB`, unique among categories (R2) |
| `description` | `Perguntas leves e instigantes para quebrar o gelo e descobrir afinidades.` | ≤ 80 chars (73) |

Derived visual (`getCategoryVisual`): `color #FF9F43`, `onColor = onColorDark`, `ink #AE5500`.

## Question entries

| Field | Rule |
|---|---|
| `id` | `primeiros-encontros-001` … `-020`, unique, never reused |
| `categoryId` | `primeiros-encontros` |
| `text` | pt-BR, trimmed, 1–200 chars, ends with `?`, unique (normalized) across all categories, passes R4 |

Count: exactly 20 (≥ 20 required by test #9).

## Persisted state (unchanged)

- Favorites: `questionId[]` + `savedAt`; new IDs simply become favoritable.
- Mix filter: `excluded: CategoryId[]`; the new ID is absent → on (R6).
