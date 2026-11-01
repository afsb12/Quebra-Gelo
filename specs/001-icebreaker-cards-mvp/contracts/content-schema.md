# Contract: Content file `src/data/data.json`

The only content source of the app. Edited by content authors; validated by an automated test
(`src/data/__tests__/content.test.ts`) that MUST pass before merge. Entity rules:
[data-model.md](../data-model.md).

## Shape

```json
{
  "categories": [
    {
      "id": "casual",
      "title": "Descontraído",
      "icon": "emoticon-happy-outline",
      "color": "#F2A541",
      "description": "Perguntas leves para começar o papo sem pressão."
    }
  ],
  "questions": [
    { "id": "casual-001", "categoryId": "casual", "text": "…" }
  ]
}
```

(Example values are illustrative; real icon names, colors and texts are defined during
implementation.)

## Validation rules (each is one assertion in the content test)

1. Top level has exactly `categories` (array) and `questions` (array).
2. `categories` contains exactly the 8 IDs `casual, profundo, casais, happy-hour, dilemas,
   viagens, nostalgia, futuro`, in that order, with no duplicates.
3. Every category has non-empty `title` (≤ 30), `icon`, `description` (≤ 80) and `color` matching
   `^#[0-9A-Fa-f]{6}$`; colors are pairwise distinct.
4. Every `icon` exists in the chosen vector icon set's glyph map.
5. Every question has `id`, `categoryId`, `text` as strings; no extra fields.
6. Question IDs are unique and match `^<categoryId>-\d{3}$` for their own `categoryId`.
7. Every `categoryId` references an existing category.
8. Every `text` is trimmed, non-empty and ≤ 200 characters.
9. Every category has ≥ 20 questions.
10. No two questions have the same normalized text (case/accents/whitespace-insensitive).

## Change policy

- Adding questions: new IDs with the next free number; never renumber.
- Removing a question: delete it; its ID is never reused (persisted favorites referring to it are
  dropped on rehydrate).
- Content changes use `content:` commits and require content review (constitution).
