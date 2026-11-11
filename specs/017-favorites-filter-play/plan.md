# Implementation Plan: Favoritos com Filtro e Baralho de Favoritas

**Branch**: `017-favorites-filter-play` | **Date**: 2026-11-11 | **Spec**: [spec.md](./spec.md)

## Summary

A third deck kind joins the data layer: `FAVORITES_DECK_ID = 'favorites'` (`DeckId` union,
`isDeckId`). `getDeckQuestionIds(deckId, mixCategories, favoriteIds)` returns the favorite IDs that
still exist for it; the progress store's `newDeck` reads them from `useFavoritesStore.getState()`
(store → store, both Data layer), so `ensureDeck`/`reshuffle` signatures stay the same. `useDeck`
treats it like the mixed deck for visuals (no `deckCategory`, title "Favoritas") but never offers
"Mudar o clima"; `DeckScreen` renders it in the `mixed` card mode (neutral back + origin badge).
`FavoritesScreen` gets the count, single-select category chips (new dumb `FilterChips`), the
restyled `FavoriteListItem` (header row with `CategoryIcon` + name + remove star; no stripe) and a
footer "Jogar com as favoritas" that calls `resetDeck('favorites')` then opens the deck.

## Technical Context

**Language/Version**: TypeScript 6 strict, React 19 / RN 0.88
**Primary Dependencies**: Expo Router, Zustand (+ persist for favorites, unchanged format), NativeWind
**Storage**: favorites persisted as today; favorites-deck progress in memory only
**Testing**: Jest + RNTL 14 · **Target**: Android + iOS · **Type**: mobile app
**Constraints**: offline, no new persisted data, UI components dumb
**Scale/Scope**: types/content/progress/useDeck, DeckScreen, FavoritesScreen, 2 components, strings, tests

## Constitution Check

| Principle / rule | Status | Notes |
|---|---|---|
| I. Zero Fricção (offline, no data collection) | ✅ | Deck built from local favorites; nothing new stored |
| II. Imersão Tátil | ✅ | Reuses `SwipeCard` + haptics |
| III. Tipagem Estrita | ✅ | `DeckId` union grows; `isDeckId` narrows route params |
| IV. Arquitetura Limpa | ✅ | Deck composition in Data (content/progress); screens wire; `FilterChips`/`FavoriteListItem` dumb |
| Stack: Zustand + persist only for favorites; deck progress in memory | ✅ | Progress store unchanged (no persist) |
| Jogo: no repeat until all shown; any card skippable | ✅ | Same deck engine |
| 004 hidden backs | ✅ | Favorites deck uses the neutral back like the mix |
| UI strings centralized | ✅ | `favorites.*`, `deckComplete` reuse |
| Qualidade gates | ✅ | typecheck, lint, test |

**Post-design re-check**: all ✅.

## Project Structure

```text
src/data/types.ts             # FAVORITES_DECK_ID, DeckId
src/data/content.ts           # isDeckId, getDeckQuestionIds(…, favoriteIds)
src/store/progress.ts         # newDeck reads favorites for the favorites deck
src/hooks/useDeck.ts          # title "Favoritas", no deckCategory, no mood
src/screens/DeckScreen.tsx    # favorites deck in mixed card mode
src/components/FilterChips.tsx        # NEW
src/components/FavoriteListItem.tsx   # header row, no stripe
src/screens/FavoritesScreen.tsx       # count, chips, filtered list, play button
src/i18n/strings.ts
tests: content, progress, useDeck, FavoriteListItem/Consistency, FilterChips, FavoritesScreen (new), DeckScreen
```

## Complexity Tracking

None.
