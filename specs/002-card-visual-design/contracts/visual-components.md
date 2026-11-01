# Contract: Visual components and theme helpers

UI-layer contracts for this feature. **Amends**
[001 app-interfaces](../../001-icebreaker-cards-mvp/contracts/app-interfaces.md) §3: `CardFace`
is replaced by `CardBack` + `CardFront`, and `CategoryTile` renders a `MiniCard`. All components
are props-only (constitution Principle IV).

## Theme helpers (pure, `src/theme/`)

```ts
contrastRatio(a: string, b: string): number                 // WCAG 2.1
pickOnColor(color: string): string                          // onColorLight | onColorDark
inkOnCream(color: string, cream?: string): string           // darkened until ≥ 4.5:1
getCategoryVisual(category: Category): CategoryVisual       // memoized per id
getCardGeometry(screen: { width: number; height: number }, reservedHeight: number): CardGeometry
questionBaseSize(text: string): 26 | 23 | 21
```

## Components (`src/components/`)

```ts
interface CategoryPatternProps {        // SVG, tone-on-tone, static
  kind: PatternKind; color: string; onColor: string; width: number; height: number;
}

interface CardBackProps {               // face-down side
  category: Category; visual: CategoryVisual; width: number; variant: 'full' | 'mini';
}
// Renders: cream outer frame, color background, CategoryPattern, vignette, big icon,
// category name (display font, uppercase, onColor). MUST NOT render any question text.
// variant 'mini' scales icon/name for the Home grid; same geometry ratio.

interface CardFrontProps {              // revealed side
  category: Category; visual: CategoryVisual; question: Question; isFavorite: boolean; width: number;
}
// Renders: cream background + warm vignette, inner ink frame, icon (top-left, ink),
// star indicator (top-right, ink, only if isFavorite, not pressable), question text
// (question font, questionInk, size from questionBaseSize, fit ≥ 20pt), footer (category name, ink).

interface MiniCardProps {               // Home grid item (replaces CategoryTile body)
  category: Category; visual: CategoryVisual; width: number; onPress(id: CategoryId): void;
}
// Renders CardBack variant 'mini' + name and description below; whole item is one pressable
// with accessibilityLabel "<title>. <description>".
```

`SwipeCard` (001) keeps its props and gesture behavior; it now renders `CardBack` / `CardFront`
for its two faces. `FavoriteListItem` and `DeckComplete` (001) receive `visual` to use `color`/
`ink`, `icon` and the card corner radius (FR-014a).

## Guarantees

- Category is always identifiable without color: name + icon on back, front footer + icon,
  mini card, favorites list (FR-013).
- No decorative element animates; patterns are static (reduced motion).
- Every text/icon color pair used by these components is one of the pairs validated in
  [data-model.md](../data-model.md#validation-rules).
