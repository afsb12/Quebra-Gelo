# Implementation Plan: Identidade Visual das Cartas por Categoria

**Branch**: `002-card-visual-design` | **Date**: 2026-10-31 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-card-visual-design/spec.md`

## Summary

Give the 001 cards and category elements their visual identity: one fixed color per category
(back background) with derived text and "ink" colors that pass WCAG contrast; a cream paper front
with dark question text and category-colored frame, icon and footer; a static, tone-on-tone
geometric SVG pattern per category on the back; Outfit as the bundled typeface; 5:7 cards with
light frame and shadow; Home categories rendered as mini card backs in a 2-column grid; the same
color/icon in Favorites and "Fim do Baralho". This feature builds directly on the 001 plan and is
implemented together with it (001 is not yet implemented).

## Technical Context

**Language/Version**: TypeScript (strict), React Native via Expo SDK (same as 001)

**Primary Dependencies**: from 001 plus `react-native-svg` (patterns, vignette), `expo-font` +
`@expo-google-fonts/outfit` (bundled typeface), `expo-splash-screen` (hold splash until fonts
load); icons from `@expo/vector-icons` (already in 001)

**Storage**: none new; `Category.color`/`icon` stay in `data.json`; visual tokens are derived in
code

**Testing**: Jest + React Native Testing Library (same as 001); pure-function tests for contrast
and palette; component tests for card faces; text-fit test

**Target Platform**: Android and iOS phones, portrait, ≥ 320pt; tablets get a max card width

**Project Type**: mobile-app (same single Expo project)

**Performance Goals**: card faces render without dropping frames during flip/swipe (60 fps, 001
SC-003); pattern geometry computed once per category/size

**Constraints**: offline from first launch (fonts bundled); WCAG 4.5:1 text / 3:1 icons; no
decorative animation; originality vs. `Assets/` references

**Scale/Scope**: 8 category visuals, 4 new/changed UI components, 1 theme module

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Rule (constitution v2.1.0) | Plan compliance | Status |
|---|---|---|
| I. Zero Fricção — offline from first run | Fonts and icons bundled; patterns are code-generated SVG; no downloads | PASS |
| II. Imersão Tátil — 60 fps, reduced motion | Static faces inside the existing animated card; memoized SVG; no decorative animation | PASS |
| III. Tipagem Estrita | `PatternKind` union, `Record<CategoryId, PatternKind>` forces all 8; typed props in contract | PASS |
| IV. Arquitetura Limpa | Pure theme helpers in `src/theme` (no React); faces are props-only components; screens pass `visual` | PASS |
| Stack: NativeWind default; StyleSheet in perf-critical; never mixed per component | `CardBack`/`CardFront`/`CategoryPattern` use StyleSheet (rendered inside the animated card); `MiniCard` wrapper/labels and list items use NativeWind | PASS |
| New dependencies justified | `react-native-svg`, `expo-font`, `@expo-google-fonts/outfit`, `expo-splash-screen`: all Expo SDK / Managed-compatible; needed for FR-007 and FR-011a (R2, R4) | PASS |
| Conteúdo — original visuals, a11y contrast (WCAG AA) | R1 palette verified; R4 font differs from references; FR-013 name+icon always present | PASS |
| Quality gates — tests for data/visual rules | R9 tests; quickstart | PASS |

**Post-design re-check (after Phase 1)**: PASS — no layer violations; amendments to 001 are listed
below and do not conflict with the constitution.

## Amendments to the 001 design

| 001 decision | Changed to | Source |
|---|---|---|
| R7: system typography | Outfit bundled (800/600/400) + splash held until loaded | 002 clarification (fonts), R4 |
| `CardFace` component | `CardBack` + `CardFront`; `CategoryPattern` added | contracts/visual-components.md |
| `CategoryTile` (flat tile) | Renders `MiniCard` (mini card back + name/description) | 002 FR-014 |
| Category colors "defined in design" | Fixed palette (R1), asserted by the content test | 002 FR-001, FR-012 |
| Front style unspecified | Cream front, dark text, ink frame/icon/footer | 002 FR-006, FR-010 |

When `/speckit-tasks` runs for 001, it MUST use these amended components; alternatively tasks for
both features can be generated and implemented in one pass (recommended).

## Project Structure

### Documentation (this feature)

```text
specs/002-card-visual-design/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── visual-components.md
├── checklists/
│   └── requirements.md
└── tasks.md             # /speckit-tasks (not created here)
```

### Source Code (repository root)

Only paths added or changed relative to the
[001 structure](../001-icebreaker-cards-mvp/plan.md#source-code-repository-root):

```text
src/
├── app/_layout.tsx            # CHANGED: load Outfit via useFonts; keep splash until fonts + favorites ready
├── theme/
│   ├── tokens.ts              # NEW: app/cream/ink colors, card ratio, sizes, font names
│   ├── color.ts               # NEW: contrastRatio, pickOnColor, inkOnCream (pure)
│   ├── categoryVisual.ts      # NEW: pattern map + getCategoryVisual
│   ├── geometry.ts            # NEW: getCardGeometry, questionBaseSize
│   └── __tests__/             # NEW: palette/contrast, patterns, geometry/text sizing
├── components/
│   ├── CategoryPattern.tsx    # NEW: SVG patterns (8 kinds) + vignette
│   ├── CardBack.tsx           # NEW (replaces CardFace back side)
│   ├── CardFront.tsx          # NEW (replaces CardFace front side)
│   ├── MiniCard.tsx           # NEW: Home grid item
│   ├── SwipeCard.tsx          # CHANGED: renders CardBack/CardFront
│   ├── CategoryTile.tsx       # REMOVED in favor of MiniCard
│   ├── FavoriteListItem.tsx   # CHANGED: category color/icon/radius
│   └── DeckComplete.tsx       # CHANGED: category color
└── data/data.json             # colors/icons set to the R1/R7 values
```

**Structure Decision**: same single Expo project as 001; visual rules live in `src/theme` as pure
functions so they are unit-testable, and faces stay dumb components.

## Implementation phases (input for `/speckit-tasks`)

1. **Theme foundation** — tokens, color helpers (tests first: contrast table), category visual map,
   geometry and text sizing helpers; set palette/icons in `data.json`; extend content test.
2. **Fonts** — install Outfit, load in root layout with splash gate; apply font tokens globally.
3. **Card faces** — `CategoryPattern` (8 kinds + vignette), `CardBack`, `CardFront` (layout, fit,
   indicator); plug into `SwipeCard`.
4. **App consistency** — `MiniCard` 2-column Home grid; favorites list items and "Fim do Baralho"
   using category visuals.
5. **Validation** — text-fit test across all questions; manual quickstart scenarios (backs, front,
   large font, color-blind filter, offline fonts, originality review).

## Complexity Tracking

No constitution violations to justify.
