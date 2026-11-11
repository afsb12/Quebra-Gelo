# Contract: DeckComplete (018)

```ts
export interface DeckCompleteSuggestion { id: CategoryId; title: string; color: string; onColor: string; icon: string }

export interface DeckCompleteProps {
  deckTitle: string;
  visual: DeckCompleteVisual;              // { color, onColor, icon }
  suggestions?: DeckCompleteSuggestion[];  // omitted/empty → no "Que tal continuar com" section
  onReshuffle: () => void;
  onChooseAnother: () => void;             // "Ver todos os baralhos"
  onSuggest?: (id: CategoryId) => void;    // testID deck-suggestion-<id>
}

// data/content.ts
export const getNextCategories: (id: CategoryId, count?: number) => Category[];
```

testIDs: `deck-complete` (root), `deck-complete-face` (front fan card, background = visual.color).
