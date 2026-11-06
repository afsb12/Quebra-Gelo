# Data Model: Navegação direcional (009)

## DeckProgress (in memory, `src/data/types.ts`)

| Field | Type | Meaning |
|---|---|---|
| `order` | `string[]` | Permutation of the deck's question IDs |
| `cursor` | `number` | Index of the card on the table; `order.length` = completed |
| `furthest` | `number` | **New.** Highest index ever shown, `0 ≤ furthest ≤ max(0, order.length - 1)` |

Invariants: `cursor ≤ furthest + 1`. While a card is on the table, `cursor ≤ furthest`.

### Transitions (pure functions, `src/data/deck.ts`)

| Function | Result |
|---|---|
| `createDeck(ids)` | `{ order: shuffle(ids), cursor: 0, furthest: 0 }` |
| `advance(d)` | `cursor = min(cursor + 1, len)`, `furthest = max(furthest, min(cursor + 1, len - 1))` |
| `canGoBack(d)` | `0 < cursor < len` |
| `goBack(d)` | `canGoBack` ? `{ ...d, cursor: cursor - 1 }` : `d` (same object) |
| `remainingCount(d)` | `max(0, len - furthest - 1)` (never-shown cards) |
| `reshuffleRemaining(d)` | reorders `order.slice(furthest + 1)`; prefix, `cursor` and `furthest` unchanged (008 rules otherwise) |

### Store (`useProgressStore`)

```text
active --discard--> cursor+1 (furthest grows only on new cards)
active --goBack----> cursor-1 (no-op on card 1)                         [new]
active --reshuffleRemaining--> same cursor/furthest, new never-shown tail [008, scope narrowed]
any --reshuffle / resetDeck--> fresh deck (history cleared)
```

## Onboarding flag (persisted, AsyncStorage `quebra-gelo/onboarding`)

| Field | Type | Meaning |
|---|---|---|
| `hasSeenTutorial` | `boolean` | The **current** tutorial was closed |
| `tutorialVersion` | `number` | **New.** Version that was closed; current = `2` |

Stored `{ version: 1, state: { hasSeenTutorial: true, tutorialVersion: 2 } }`. A stored state with
no `tutorialVersion` or a different one counts as not seen.
