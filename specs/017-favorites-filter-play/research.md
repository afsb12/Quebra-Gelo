# Research: Favoritos com Filtro e Baralho de Favoritas

## R1. Where the favorites deck gets its questions

- **Decision**: `getDeckQuestionIds('favorites', _, favoriteIds)` keeps only IDs of existing
  questions; `progress.newDeck` passes `useFavoritesStore.getState().favorites.map(f => f.questionId)`.
- **Rationale**: keeps `ensureDeck`/`reshuffle` call sites unchanged and the composition testable as a
  pure function; both stores are Data layer.
- **Alternatives**: a new `ensureDeck` option (touches every call site); building the deck in the
  screen (business rule in a screen — rejected by IV).

## R2. Fresh deck on each start

- **Decision**: FavoritesScreen calls `resetDeck('favorites')` before `router.push` (FR-002); the
  deck screen's `ensureDeck` then builds it from the current list. Reshuffle rebuilds it the same way.

## R3. Card mode

- **Decision**: `SwipeCard mode="mixed"` for the favorites deck (neutral back, origin badge, labels
  without category while face down); `canChangeMood` stays mixed-only.

## R4. Filter state

- **Decision**: local `useState<CategoryId | 'all'>` in FavoritesScreen; derived chips = categories
  with favorites in content order; if the selected category has no entries, the effective filter is
  'all' (computed, no effect needed).
- **Rationale**: browsing state, not worth persisting (FR-008).
