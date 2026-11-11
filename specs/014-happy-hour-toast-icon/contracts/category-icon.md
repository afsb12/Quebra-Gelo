# Contract: `CategoryIcon` (UI component)

```ts
export interface CategoryIconProps {
  /** MaterialCommunityIcons glyph name or a CUSTOM_ICONS key. */
  name: string;
  /** Side in pt (same value the call site passed to MaterialCommunityIcons). */
  size: number;
  /** Stroke/glyph color (onColor or ink, as today). */
  color: string;
}
```

Behavior:

- `isCustomIcon(name)` → renders `Svg` (`width=height=size`, `viewBox="0 0 24 24"`,
  `testID="icon-<name>"`, hidden from accessibility, `pointerEvents="none"`) with stroke-only paths
  in `color`, `strokeWidth=2`, round caps/joins.
- otherwise → `<MaterialCommunityIcons name={name} size={size} color={color} />` (identical to the
  current call sites).
- Pure and memoized; no store, hook, navigation or business logic.

Call sites (size/color unchanged):

| Component | size | color |
|---|---|---|
| `CardBack` | `round(width × 0.3)` | `visual.onColor` |
| `CardFront` (corner) | 28 | `visual.ink` |
| `CategoryBadge` (origin badge) | 14 | `visual.onColor` |
| `MixFilterSheet` | 20 | `visual.onColor` |
| `FavoriteListItem` | 18 | `visual.ink` |
| `DeckComplete` | 56 | `visual.onColor` |
