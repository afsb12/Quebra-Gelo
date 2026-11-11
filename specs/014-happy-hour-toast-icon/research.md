# Research: Ícone de Brinde de Chope para o Happy Hour

## R1. Library glyph vs. custom icon

- **Decision**: custom SVG icon (`beer-toast`) drawn with `react-native-svg`.
- **Rationale**: MaterialCommunityIcons (the bundled set) has `beer`, `beer-outline`, `glass-mug`,
  `glass-mug-variant`, `glass-pint-outline`, `glass-stange` but no two-mug toast; the user asked
  for a toast. `react-native-svg` is already a dependency (`BrandSymbol`, `Vignette`), so there is
  no new package and no native change.
- **Alternatives considered**: `glass-mug-variant` (single mug: solves the confusion but loses the
  toast; kept as a documented fallback); a custom icon font (needs a build step and font loading,
  overkill for one glyph).

## R2. Where the custom geometry lives

- **Decision**: `src/theme/customIcons.ts` exports `CUSTOM_ICONS` (`as const`, path strings +
  transforms in a 24×24 box) and `isCustomIcon(name: string): name is CustomIconName`.
- **Rationale**: like `BRAND_SYMBOL` in `brand.ts`, it is a visual constant; the theme layer is
  importable by components, and the data test can import it to validate names (FR-008).
- **Alternatives considered**: geometry inside the component (the content test would then import a
  UI component); geometry in `data.json` (mixes drawing data into content).

## R3. How call sites pick the renderer

- **Decision**: one dumb component `CategoryIcon({ name, size, color })`: if `isCustomIcon(name)`,
  draws the SVG; else renders `MaterialCommunityIcons` with the same props.
- **Rationale**: the six call sites keep their exact size/color and only change the component, so
  FR-003/FR-004 hold by construction and other categories render exactly as before (FR-006).
- **Alternatives considered**: branching in each call site (six copies of the same `if`).

## R4. Stroke, transforms and scaling

- **Decision**: `Svg width=height=size viewBox="0 0 24 24"`, paths with `fill="none"`,
  `stroke={color}`, `strokeWidth={2}`, `strokeLinecap="round"`, `strokeLinejoin="round"`. The
  mugs are `G transform="rotate(14 7.5 14)"` and an outer `G transform="translate(24 0) scale(-1 1)"`
  wrapping the same rotated group.
- **Rationale**: strokes in viewBox units scale with `size`, so 2/24 matches the outline weight of
  the library icons at every size (clarification Q1). `react-native-svg` 15 parses SVG transform
  strings on `G`.
- **Alternatives considered**: `rotation`/`origin` props (equivalent, less readable next to the
  design canvas paths).

## R5. Accessibility and tests

- **Decision**: the custom `Svg` gets `accessibilityElementsHidden`,
  `importantForAccessibility="no-hide-descendants"` and `pointerEvents="none"`; it carries
  `testID={`icon-${name}`}`, the same ID the MaterialCommunityIcons mock produces, so existing tests
  that look up `icon-<name>` keep working for every category.
- **Rationale**: the icon is decorative (FR-005), and a shared testID keeps `Consistency.test.tsx`
  and friends generic.

## R6. Version

- **Decision**: 1.6.0 → 1.7.0, versionCode 7 → 8 (`app.json`, `package.json`). No `expo prebuild`
  needed: no native config or app icon changes.
