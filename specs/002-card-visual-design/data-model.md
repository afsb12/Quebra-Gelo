# Data Model: Identidade Visual das Cartas

Phase 1 output for [plan.md](./plan.md). Content entities (`Category`, `Question`) are defined in
[001 data-model](../001-icebreaker-cards-mvp/data-model.md) and are **unchanged**: `Category.color`
and `Category.icon` stay in `data.json`. This feature adds derived, code-side visual tokens.

## Theme tokens (`src/theme/tokens.ts`)

| Token | Value | Use |
|---|---|---|
| `appBackground` | `#16131C` | screen background (dark theme) |
| `cream` | `#F7F0E3` | card front background; outer card frame |
| `questionInk` | `#22202A` | question text on the front |
| `onColorDark` | `#1B1A22` | text/icons on light category colors |
| `onColorLight` | `#FFFFFF` | text/icons on dark category colors |
| `cardRatio` | `5 / 7` | width / height |
| `cardMaxWidth` | `360` | pt |
| `minQuestionSize` | `20` | pt |

Fonts: `display` = `Outfit_800ExtraBold`, `question` = `Outfit_600SemiBold`, `body` =
`Outfit_400Regular`.

## CategoryVisual (derived, `src/theme/categoryVisual.ts`)

| Field | Type | Source / rule |
|---|---|---|
| `categoryId` | `CategoryId` | key |
| `color` | hex | `Category.color` from `data.json` |
| `onColor` | hex | `pickOnColor(color)`: whichever of `onColorLight`/`onColorDark` has the higher contrast; MUST be ≥ 4.5:1 |
| `ink` | hex | fixed per category (`CATEGORY_INK`, R1 table), validated ≥ 4.5:1 against `cream`; `inkOnCream(color)` (darken in HSL lightness steps until ≥ 4.5:1) is the fallback for other colors |
| `pattern` | `PatternKind` | fixed map (below) |
| `icon` | string | `Category.icon` |

`PatternKind` = `'dots' | 'concentric' | 'diamonds' | 'bubbles' | 'checker' | 'waves' |
'stripes' | 'chevrons'`.

Pattern map (`Record<CategoryId, PatternKind>`, every value distinct): casual → dots,
profundo → concentric, casais → diamonds, happy-hour → bubbles, dilemas → checker,
viagens → waves, nostalgia → stripes, futuro → chevrons.

Expected palette (asserted by test): see [research R1](./research.md#r1-category-palette-exact-tones).

## Validation rules

- Every `Category.color` in `data.json` equals the R1 table value (content test, extends rule 3 of
  [001 content-schema](../001-icebreaker-cards-mvp/contracts/content-schema.md)).
- `contrast(onColor, color) ≥ 4.5` and `contrast(ink, cream) ≥ 4.5` for all 8 categories.
- `contrast(questionInk, cream) ≥ 4.5`.
- Pattern kinds are pairwise distinct.

## CardGeometry (derived per screen size)

| Field | Rule |
|---|---|
| `width` | `min(screenWidth − 48, cardMaxWidth)`, reduced if `height` exceeds available height |
| `height` | `width / cardRatio` |
| `radius` | `0.06 × width` |
| `frame` | outer 6pt cream (both faces); front inner `ink` frame 1.5pt inset 10pt |
| `miniWidth` | `(screenWidth − 48 − 16) / 2` (2 columns at 320pt) |

## Question text size (derived per question)

| Length (chars) | Base size (pt) |
|---|---|
| ≤ 120 | 26 |
| 121–160 | 23 |
| 161–200 | 21 |

Rendered size may shrink to fit but never below `minQuestionSize` (20pt).
