# Contract: Home components (015)

```ts
// MiniCard: unchanged props; renders only the mini CardBack (no name/description below).
export interface MiniCardProps { category: Category; visual: CategoryVisual; width: number; onPress: (id: CategoryId) => void }

// MixedHeroCard
export interface MixedHeroCardProps {
  width: number;
  onPress: () => void;        // whole card (and the "Jogar" pill inside it)
  onOpenFilter: () => void;   // the chip; never starts the game
  filterLabel: string;        // "10 categorias" | "8 de 10 categorias" (testID mix-filter-summary)
}
```

`CardGeometry.miniWidth`: width of a Home tile in a 3-column grid with `layout.homeGridGap` (12).
