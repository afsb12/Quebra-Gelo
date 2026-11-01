# Contract: Card back components (**Amends 002** `contracts/visual-components.md`)

Only the parts that change. All other components (`CardFront`, `MiniCard`, `SwipeCard`, etc.)
keep their 002 contract.

## Removed

```ts
// src/components/CategoryPattern.tsx: file deleted
interface CategoryPatternProps { kind: PatternKind; color: string; onColor: string; width: number; height: number }
// src/theme/categoryVisual.ts
type PatternKind = ...;                       // removed
const CATEGORY_PATTERNS: Record<CategoryId, PatternKind>; // removed
CategoryVisual.pattern                         // removed
```

## Moved (no behavior change)

```ts
// src/components/Vignette.tsx (was exported from CategoryPattern.tsx)
export interface VignetteProps { width: number; height: number; tint: string; strength: number }
export const Vignette: React.MemoExoticComponent<(props: VignetteProps) => React.JSX.Element>;
// Radial gradient overlay, transparent center → `tint` at `strength` on the edges; pointerEvents="none".
```

## CardBack (props unchanged)

```ts
interface CardBackProps {
  category: Category;
  visual: CategoryVisual;
  width: number;
  variant: 'full' | 'mini';
}
// Renders: cream outer frame → face filled with visual.color → Vignette(tint "#000000",
// strength 0.16) → big icon in visual.onColor → bold title lines in visual.onColor.
// MUST NOT render any pattern shape (no Circle/Path/Rect drawing inside the face other than the
// vignette's own gradient rectangle). Never shows a question (unchanged).
```

Testable guarantees:

- For each of the 8 categories, in both variants: the face background is `visual.color`, exactly
  one vignette is rendered, and the rendered tree contains no `Circle`, no `Path`, and only the
  vignette's single `Rect`.
- Title and icon color are `visual.onColor` (unchanged 002 tests).
