# Data Model: Re-embaralhar as cartas restantes (008)

No new persisted data, no new store. The existing in-memory `DeckProgress` is reused.

## DeckProgress (existing, `src/data/types.ts`)

| Field | Type | Meaning |
|---|---|---|
| `order` | `string[]` | Permutation of the deck's question IDs (category, or filtered mixed deck) |
| `cursor` | `number` | Index of the card on the table; `order.length` = completed |

### Derived views (new, pure functions in `src/data/deck.ts`)

| Name | Definition |
|---|---|
| shown prefix | `order.slice(0, cursor + 1)` — already discarded cards + card on the table |
| remaining queue | `order.slice(cursor + 1)` — cards not yet shown |
| `remainingCount(deck)` | `max(0, order.length - cursor - 1)` |
| `canReshuffleRemaining(deck)` | `remainingCount(deck) >= 2` |

### Transition: `reshuffleRemaining(deck, random?) → DeckProgress`

Preconditions / invariants (all asserted by unit tests):

1. If `!canReshuffleRemaining(deck)` → returns **the same object** (`===`).
2. Otherwise the result `next` satisfies:
   - `next.cursor === deck.cursor`
   - `next.order.length === deck.order.length`
   - `next.order.slice(0, cursor + 1)` equals `deck.order.slice(0, cursor + 1)` (element-wise)
   - `next.order.slice(cursor + 1)` is a permutation of `deck.order.slice(cursor + 1)`
   - `next.order.slice(cursor + 1)` differs from `deck.order.slice(cursor + 1)` in at least one position
3. Input is never mutated.

### State lifecycle (per deck, in `useProgressStore`)

```text
(missing) --ensureDeck--> active(cursor=0)
active --discard--> active(cursor+1) | completed
active --reshuffleRemaining--> active(same cursor, new tail)      [new, 008]
active|completed --reshuffle--> active(cursor=0, full new order)  [existing restart]
any --resetDeck--> (missing)                                      [mix filter changed, 006]
```
