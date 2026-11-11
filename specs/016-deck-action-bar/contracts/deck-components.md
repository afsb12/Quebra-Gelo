# Contract: Deck components (016)

```ts
export interface SwipeCardHandle { swipe: (direction: SwipeDirection) => void }
// SwipeCardProps += ref?: Ref<SwipeCardHandle>

export interface DeckActionBarProps {
  canGoBack: boolean;          // false → "Anterior" disabled
  favoriteActive: boolean;
  favoriteDisabled: boolean;   // card face down
  onPrevious: () => void;      // testID deck-previous-button
  onToggleFavorite: () => void; // reuses FavoriteButton (testID favorite-button)
  onNext: () => void;          // testID deck-next-button
}

export interface DeckProgressProps { index: number; total: number; color: string } // testID deck-progress
export interface DeckStackProps { width: number; height: number; count: 0 | 1 | 2; color: string }  // testID deck-stack

// theme
export const progressColor: (color: string, background?: string) => string;
```
