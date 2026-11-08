# Data Model: "Mudar o Clima" no Modo Misturado

## DeckProgress (unchanged shape)

| Field | Meaning |
|---|---|
| `order: string[]` | permutation of the deck's question ids |
| `cursor: number` | index of the card on the table; `order.length` = completed |
| `furthest: number` | highest index ever shown; history = `order[0..furthest]` (009) |

Derived (011):

- **tail** = `order.slice(furthest + 1)` — never-shown cards.
- **at frontier** = `cursor === furthest && cursor < order.length`.

## New pure functions (`src/data/deck.ts`)

```ts
type CategoryOf = (questionId: string) => string | undefined;

/** Categories (≠ current card's) that still have never-shown cards, in tail order. */
moodCategories(deck: DeckProgress, categoryOf: CategoryOf): string[]

/** At the frontier and moodCategories(...) is not empty. */
canChangeMood(deck: DeckProgress, categoryOf: CategoryOf): boolean

/** Moves the first tail card of a randomly chosen mood category to furthest + 1, then advances.
 *  Returns `deck` itself when canChangeMood is false. */
changeMood(deck: DeckProgress, categoryOf: CategoryOf, random?: () => number): DeckProgress
```

### Transition

```text
before: order = [h0 … hF | t0 t1 … tk]   cursor = furthest = F   (card hF on the table)
pick  : c = categories[floor(random * n)], i = first index with categoryOf(t_i) === c
after : order = [h0 … hF | t_i t0 … (without t_i) … tk]   cursor = furthest = F + 1
```

Invariants: same multiset of ids; history `order[0..F]` unchanged; `categoryOf(order[F+1]) !==
categoryOf(hF)`.

## Removed

`reshuffleRemaining`, `canReshuffleRemaining`, `remainingCount` (008).

## UI state (screen only)

`face: 'up' | 'down'` — the button is enabled only when `face === 'up'` and `canChangeMood`.
After a change, `face` is set to `'down'` for the new card.
