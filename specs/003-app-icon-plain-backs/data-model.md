# Data Model: Novo Ícone do App e Verso das Cartas Sem Padrões

Phase 1 output for [plan.md](./plan.md). No persisted data changes: `data.json`, the Zustand
stores and AsyncStorage stay as they are. Only one derived visual type changes, and the icon is
described by a build-time parameter set.

## CategoryVisual (`src/theme/categoryVisual.ts`): **Amends 002**

| Field | Type | Change |
|---|---|---|
| `categoryId` | `CategoryId` | unchanged |
| `color` | `string` (hex) | unchanged: card back background |
| `onColor` | `string` (hex) | unchanged: icon/title on the back |
| `ink` | `string` (hex) | unchanged: category color on the cream front |
| ~~`pattern`~~ | ~~`PatternKind`~~ | **removed** |
| `icon` | `string` | unchanged |

Removed exports: `PatternKind`, `CATEGORY_PATTERNS`. Validation that still holds (existing tests):
8 categories, `onColor` contrast ≥ 4.5 on `color`, `ink` contrast ≥ 4.5 on cream.

## Card back (rendered, not stored)

| Layer (bottom → top) | Source | Change |
|---|---|---|
| Cream frame (`tokens.colors.cream`, `tokens.card.frame`) | `CardBack` | unchanged |
| Solid face color | `visual.color` | unchanged |
| ~~Tone-on-tone pattern (12%)~~ | ~~`CategoryPattern`~~ | **removed** |
| Edge vignette (`#000000`, strength `0.16`) | `Vignette` | unchanged look, now its own component |
| Category icon (30% of width) | `visual.icon`, `visual.onColor` | unchanged |
| Title lines (`titleLines`) | `category.title`, `tokens.fonts.display` | unchanged |

Applies to both `variant: 'full'` and `variant: 'mini'` (home screen `MiniCard`).

## IconSymbol (`scripts/icon/symbol.ts`, build time only)

| Field | Type | Value | Rule |
|---|---|---|---|
| `side` | `number` | `1` (unit) | both squares equal |
| `offset` | `number` | `0.42` | square B = square A shifted by `(offset, offset)` |
| `radius` | `number` | `0.24` | `0 < radius < side / 2` |
| `stroke` | `number` | `0.085` | centered on the outline |
| `colors.background` | `string` | `#16131C` | = `tokens.colors.appBackground` |
| `colors.outline` | `string` | `#F7F0E3` | = `tokens.colors.cream` |
| `colors.accent` | `string` | `#FF6B4A` | contrast ≥ 4.5 vs background, ≥ 2.2 vs outline |

Derived values:

- **Extent** (outer bounding box incl. stroke): `side + offset + stroke` = `1.505`.
- **Max radius** (farthest painted point from the symbol center, used for the Android safe zone):
  corner-arc center distance `√2 · (extent/2 − stroke/2 − radius)` + `radius + stroke/2`.
- **Intersection**: `{p | sdfA(p) ≤ 0 ∧ sdfB(p) ≤ 0}` on the outline centerlines.

## IconVariant (build time only)

| Field | Type | Notes |
|---|---|---|
| `file` | `string` | path under `Assets/app/` |
| `size` | `number` | px, square |
| `background` | `'opaque' \| 'transparent'` | opaque variants are written as RGB (no alpha) |
| `fit` | `{ kind: 'bbox', ratio: number } \| { kind: 'radius', ratio: number }` | symbol scale: bounding box as a share of the canvas, or max radius as a share of the canvas |
| `mode` | `'color' \| 'mono'` | mono paints outlines + fill in white |

Instances are listed in [research R6](./research.md#r6-variant-specs-expo-sdk-58-config) and in
[contracts/app-icon-assets.md](./contracts/app-icon-assets.md).
