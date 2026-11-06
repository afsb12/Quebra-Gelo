# Contract: content for `primeiros-encontros`

The app's only external interface touched by this feature is the bundled content file
(`src/data/data.json`) and the category ordering it shares with `CATEGORY_IDS`.

## C1. Category object (index 1 of `categories`)

```json
{
  "id": "primeiros-encontros",
  "title": "Primeiros Encontros",
  "icon": "glass-flute",
  "color": "#FF8A80",
  "description": "Perguntas leves e instigantes para quebrar o gelo e descobrir afinidades."
}
```

Exactly these five keys (test #3). `icon` replaces the 🥂 of the request (research R1); `color` replaces the requested `#FF9F43` (research R2).

## C2. Order

`categories.map(c => c.id)` MUST equal `CATEGORY_IDS`, with `primeiros-encontros` right after
`casual`. Home grid, mix filter sheet and `activeMixCategories` all follow this order.

## C3. Questions

- 20 objects `{ "id", "categoryId", "text" }`, exactly these keys (test #5).
- `id` matches `^primeiros-encontros-\d{3}$`, at least 20, numbered from 001 without gaps.
- `text` rules: see [data-model.md](../data-model.md#question-entries) and research R3/R4.
- Placed in the `questions` array after the last `casual-*` entry.

## C4. Visual

`CATEGORY_INK['primeiros-encontros'] = '#D71100'`; palette tables in `content.test.ts` (PALETTE)
and `categoryVisual.test.ts` (TABLE: color `#FF8A80`, onColor `dark`, ink `#D71100`).

## C5. Backward compatibility

- Existing category IDs, question IDs, colors and order among themselves: unchanged.
- Persisted favorites and mix-filter exclusions: read as before; new category defaults to on.
