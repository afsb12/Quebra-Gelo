# Data Model: Modo "Tudo Misturado" (004)

## DeckId (new)

```ts
export const MIXED_DECK_ID = 'mixed' as const;
export type DeckId = CategoryId | typeof MIXED_DECK_ID;
```

- `isDeckId(value: string): value is DeckId` — true for the 8 category IDs and `'mixed'`.
- `'mixed'` is never a `CategoryId`; questions still belong to exactly one category.

## Deck question list (pure, `src/data/content.ts`)

| Function | Returns |
|---|---|
| `getAllQuestions()` | every bundled question, in content order |
| `getDeckQuestionIds(deckId)` | category deck → that category's question IDs; `'mixed'` → all question IDs |

## DeckProgress (existing) — now keyed by DeckId

`useProgressStore.decks: Partial<Record<DeckId, DeckProgress>>`

- `ensureDeck(deckId)`: create `createDeck(getDeckQuestionIds(deckId))` if missing (resume otherwise).
- `discard(deckId)`, `reshuffle(deckId)`: unchanged semantics.
- Independent keys → mixed progress never affects category progress (and vice versa).
- In memory only (no `persist`): resets when the app process ends.

State transitions (per deck): `missing → active(cursor 0) → active(cursor n) → completed(cursor = length) → (reshuffle) active(cursor 0)`.

## useDeck(deckId) result

| Field | Type | Notes |
|---|---|---|
| `deckId` | `DeckId` | |
| `title` | `string` | category title, or `strings.mixed.title` ("Tudo Misturado") |
| `deckCategory` | `Category \| undefined` | `undefined` in mixed mode |
| `current` | `Question \| undefined` | `undefined` when completed |
| `currentCategory` | `Category \| undefined` | category of `current` (badge source) |
| `position` | `{ index, total }` | |
| `ready`, `discard`, `reshuffle` | | unchanged |

## Visual identity of the mixed deck (`src/theme/brand.ts`)

- `BRAND_SYMBOL`: `{ offset: 0.42, radius: 0.24, stroke: 0.085, colors: { background: '#16131C', outline: '#F7F0E3', accent: '#FF6B4A' } }` (side = 1) — must equal `scripts/icon/symbol.ts` `SYMBOL`.
- `MIXED_VISUAL: DeckCompleteVisual` = `{ color: surface, onColor: textPrimary, icon: 'shuffle-variant' }`.
