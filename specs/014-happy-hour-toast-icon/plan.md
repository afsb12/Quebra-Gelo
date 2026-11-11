# Implementation Plan: Ícone de Brinde de Chope para o Happy Hour

**Branch**: `014-happy-hour-toast-icon` | **Date**: 2026-11-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/014-happy-hour-toast-icon/spec.md`

## Summary

Replace Happy Hour's `glass-cocktail` with an app-drawn "beer toast" icon (two tilted beer mugs
plus clink marks, 2-unit stroke on a 24 grid). MaterialCommunityIcons has no such glyph, so the
app gains a tiny **custom icon registry** in the theme layer (`src/theme/customIcons.ts`, path data
only) and one dumb UI component, `CategoryIcon`, that draws a registered custom icon with
`react-native-svg` and falls back to `MaterialCommunityIcons` for every other name. The six
components that draw a category icon today (`CardBack`, `CardFront`, `CategoryBadge`,
`MixFilterSheet`, `FavoriteListItem`, `DeckComplete`) switch from `MaterialCommunityIcons` to
`CategoryIcon` with the same `name`/`size`/`color`. `data.json` sets Happy Hour's icon to
`beer-toast`, and content test 4 accepts a name that is in the glyph map **or** in the custom
registry (and rejects anything else). Version goes to 1.7.0 (versionCode 8).

## Technical Context

**Language/Version**: TypeScript 6 (`strict`), React 19 / React Native 0.88

**Primary Dependencies**: Expo SDK 58 (Managed), `@expo/vector-icons` (MaterialCommunityIcons),
`react-native-svg` 15.16.0 (already installed, used by `BrandSymbol`/`Vignette`), NativeWind 4

**Storage**: bundled `src/data/data.json` (icon name only); no persisted format changes

**Testing**: Jest + RNTL 14 (`npm test`); `react-native-svg` and MaterialCommunityIcons are mocked
in `jest.setup.ts` (svg primitives as host components; icons as `Text` with `testID="icon-<name>"`)

**Target Platform**: Android + iOS via Expo Go / release builds

**Project Type**: mobile app (single project, `src/`)

**Performance Goals**: no per-frame work; the SVG is static and memoized, drawn at most ~10 times on
Home

**Constraints**: offline (geometry bundled in code), no new packages, no change to other categories

**Scale/Scope**: 1 new theme module, 1 new UI component, 6 components touched, 1 data value, 1
content test, version bump

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / rule | Status | Notes |
|---|---|---|
| I. Zero Fricção (offline, no data) | ✅ | Path data bundled in code; nothing downloaded or collected |
| II. Imersão Tátil | ✅ | Gestures, haptics, reduced motion untouched; the icon is static |
| III. Tipagem Estrita | ✅ | `CustomIconName` is a literal union derived from the registry; `isCustomIcon` narrows `string`; no `any` |
| IV. Arquitetura Limpa | ✅ | Geometry lives in theme (like `brand.ts`); `CategoryIcon` is a dumb props-only component; no store/screen imports |
| Stack (Managed, NativeWind/StyleSheet, no eject) | ✅ | Uses the existing `react-native-svg`; no new packages, no native changes, no prebuild needed |
| Jogo: each category has its own visual identity | ✅ | Happy Hour gets a silhouette distinct from Primeiros Encontros' flute (the reason for the feature) |
| Conteúdo: original vs. `Assets/` references | ✅ | Icon drawn from scratch for this app (design canvas), not taken from reference games |
| Conteúdo: AA contrast | ✅ | Colors unchanged: same `onColor`/`ink` as today |
| Conteúdo validated by test | ✅ | Test 4 extended: icon must be a glyph **or** a registered custom icon |
| Acessibilidade | ✅ | Icon hidden from screen readers; labels unchanged |
| Qualidade gates | ✅ | `typecheck`, `lint`, `test` in quickstart |

**Post-design re-check**: all ✅, no violations.

## Project Structure

### Documentation (this feature)

```text
specs/014-happy-hour-toast-icon/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── category-icon.md
└── tasks.md            # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── theme/
│   ├── customIcons.ts             # NEW: CUSTOM_ICONS registry (beer-toast), isCustomIcon()
│   └── index.ts                   # re-export customIcons
├── components/
│   ├── CategoryIcon.tsx           # NEW: custom SVG or MaterialCommunityIcons fallback
│   ├── CardBack.tsx               # uses CategoryIcon
│   ├── CardFront.tsx              # uses CategoryIcon
│   ├── CategoryBadge.tsx          # uses CategoryIcon
│   ├── MixFilterSheet.tsx         # uses CategoryIcon
│   ├── FavoriteListItem.tsx       # uses CategoryIcon
│   ├── DeckComplete.tsx           # uses CategoryIcon
│   └── __tests__/CategoryIcon.test.tsx   # NEW
├── data/
│   ├── data.json                  # happy-hour icon: "beer-toast"
│   ├── types.ts                   # Category.icon doc comment
│   └── __tests__/content.test.ts  # test 4: glyph map OR custom registry
app.json, package.json             # 1.7.0 / versionCode 8
```

**Structure Decision**: single mobile project; the change follows the existing split (theme holds
visual constants, components draw them, data names them).

## Complexity Tracking

No constitution violations.
