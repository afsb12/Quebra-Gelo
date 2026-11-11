# Contract: Favorites (017)

```ts
// data/types.ts
export const FAVORITES_DECK_ID = 'favorites' as const;
export type DeckId = CategoryId | typeof MIXED_DECK_ID | typeof FAVORITES_DECK_ID;

// data/content.ts
export const getDeckQuestionIds: (
  deckId: DeckId,
  mixCategories?: readonly CategoryId[],
  favoriteIds?: readonly string[],   // used only for FAVORITES_DECK_ID
) => string[];

// components/FilterChips.tsx
export interface FilterChip { id: string; label: string; dotColor: string }
export interface FilterChipsProps {
  chips: FilterChip[];       // first one is "Todas"
  selected: string;
  onSelect: (id: string) => void;   // chip testID filter-chip-<id>, accessibilityState.selected
}

// components/FavoriteListItem.tsx — props unchanged; testIDs: favorite-item-<id>, favorite-category,
// favorite-remove (star, label "Remover dos favoritos: <question>")
```

Route: `/deck/favorites` (accepted by `isDeckId`).
