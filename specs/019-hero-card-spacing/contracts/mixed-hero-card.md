# UI Contract: MixedHeroCard (019)

```ts
export const HERO_LAYOUT: {
  marginTop: 16; marginBottom: 24; padding: 20; gap: 8;
  filterInset: 14; filterHitSlop: 10; filterSize: 36; titleReserve: 36;
};
export const heroHeight: (width: number, fontScale?: number) => number;

export interface MixedHeroCardProps {
  width: number;          // content width of Home (= grid width)
  fontScale?: number;     // grows the height floor (default 1)
  onPress: () => void;    // whole card, "Jogar" included
  onOpenFilter: () => void; // corner button only; never starts the game
  filterLabel: string;    // "10 categorias" / "8 de 10 categorias"
}
```

| testID | Element | Contract |
|---|---|---|
| `mixed-hero-card` | root Pressable | starts the game; label `heroLabel + filterLabel` |
| `mixed-hero-content` | padded content row | `padding: 20`, `gap: 8` |
| `mixed-hero-title` | title wrapper | `paddingRight: 36` |
| `mix-filter-button` | corner button | `position: absolute`, `top: 14`, `right: 14`, `hitSlop` 10 each side, icon `cog-outline`, label `"Escolher categorias da mistura: <filterLabel>"` |
| `mix-filter-summary` | summary text | shows `filterLabel` |
| `mixed-play-pill` | "Jogar" cue | unchanged |

HomeScreen: the card wrapper has `marginTop: 16`, `marginBottom: 24`, no horizontal margin.
