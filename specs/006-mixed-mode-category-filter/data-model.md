# Data Model: Mixed-mode category filter (006)

## Pure rules (`src/data/mixFilter.ts`)

| Export | Signature | Rule |
|---|---|---|
| `MIN_MIX_CATEGORIES` | `2` | minimum active categories |
| `activeMixCategories` | `(excluded, all: readonly CategoryId[]) => CategoryId[]` | `all` minus `excluded`, in `all` order |
| `isValidMixSelection` | `(active: readonly CategoryId[]) => boolean` | `active.length >= 2` |
| `sanitizeExcluded` | `(value: unknown, all) => CategoryId[]` | keep known, unique IDs; if the result leaves < 2 active → `[]` |
| `sameSelection` | `(a, b) => boolean` | set equality |

## MixFilterState (`src/store/mixFilter.ts`)

| Field | Type | Persisted |
|---|---|---|
| `excluded` | `CategoryId[]` | yes (`[]` = all on) |
| `save(active)` | `(active: readonly CategoryId[]) => boolean` | — |

- Key `quebra-gelo/mix-filter`, `version: 1`, `partialize` → `{ excluded }`, `merge` → `sanitizeExcluded`.
- `save`: invalid → `false`, no change. Valid → store `all − active`; if the active set changed,
  `useProgressStore.getState().resetDeck('mixed')`; returns `true`.
- Hooks: `useMixFilterHydrated()`, `useMixCategories(): CategoryId[]` (active, memoized).

## Progress store changes

- `ensureDeck(deckId, mixCategories?)`, `reshuffle(deckId, mixCategories?)` → `createDeck(getDeckQuestionIds(deckId, mixCategories))`.
- `resetDeck(deckId)` → removes the deck (next `ensureDeck` builds a fresh one).

## Content

`getDeckQuestionIds('mixed', mixCategories?)` → IDs of questions whose `categoryId ∈ mixCategories`
(all categories when omitted). Category decks ignore the argument.
