# Implementation Plan: Novo Ícone do App e Verso das Cartas Sem Padrões

**Branch**: `003-app-icon-plain-backs` | **Date**: 2026-11-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-app-icon-plain-backs/spec.md`

## Summary

Two independent visual changes on top of 002:

1. **Plain card backs (P1)**: delete the per-category tone-on-tone SVG pattern
   (`CategoryPattern`, `PatternKind`, `CATEGORY_PATTERNS`, `CategoryVisual.pattern`). The back
   becomes solid category color plus the existing edge vignette (kept per clarification), icon and
   title. `Vignette` moves to its own component shared by front and back.
2. **App icon (P2)**: a parametric refinement of the user's sketch (two equal rounded squares
   overlapping diagonally, intersection filled). Cream outlines on the app's dark background, coral
   `#FF6B4A` intersection, no text. A dependency-free TypeScript generator
   (`node scripts/generate-icons.ts`) writes the editable SVG master and every PNG variant
   (iOS/main, Android adaptive foreground + monochrome, favicon, splash) from one parameter set.
   `app.json` drops the redundant Android background image, and the splash gets a smaller image
   width.

## Technical Context

**Language/Version**: TypeScript 6 (strict); Node 24 for the generator script (native type
stripping, no `tsx`/`ts-node` needed)

**Primary Dependencies**: no new ones. App: Expo SDK 58, React Native 0.88, `react-native-svg`
(vignette only now). Generator: Node built-ins `node:zlib` (`deflateSync`, `crc32`), `node:fs`,
`node:path`

**Storage**: N/A (no persisted data changes)

**Testing**: Jest (`jest-expo`) + RNTL 14 for `CardBack`; pure Jest tests for the symbol geometry
and for the generated PNG files (header parse + pixel sampling via `zlib.inflateSync`)

**Target Platform**: Android (adaptive + themed icons, API 26+/33+) and iOS phones; web favicon

**Project Type**: mobile-app (single Expo project)

**Performance Goals**: card flip/swipe stays at 60 fps (constitution II); the back loses ~10–80
SVG nodes per card, so this is a performance win, not a risk

**Constraints**: offline/bundled assets only; Managed Workflow (icons via `app.json`, no native
edits); iOS icon opaque 1024²; Android foreground inside the 66/108 dp safe circle; originality
(no third-party marks)

**Scale/Scope**: ~4 source files touched + 1 deleted in `src/`; 2 new script files; 6 generated
assets; 2 test files updated, 2 new

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / rule | Status | Notes |
|---|---|---|
| I. Zero Fricção (offline, no backend, no tracking) | ✅ | Static bundled assets only |
| II. Imersão Tátil (gestures, UI-thread animation, haptics, reduced motion) | ✅ | `SwipeCard` untouched; back renders fewer nodes |
| III. Tipagem Estrita (strict, no `any`, typed props) | ✅ | Script is TS under `tsc`/ESLint; `CardBackProps` unchanged; removed type cleaned out of all consumers |
| IV. Arquitetura Limpa (UI dumb, data layer owns logic) | ✅ | `Vignette`/`CardBack` stay prop-driven in `src/components`; generator lives outside `src/` (build tooling, not an app layer) |
| Stack: Managed Workflow, no eject | ✅ | Icons configured via `app.json` keys only |
| Stack: NativeWind default, StyleSheet allowed in animated card faces, never mixed | ✅ | `CardBack`/`Vignette` stay StyleSheet-only |
| Stack: new dependencies justified | ✅ | None added (R5 rejects `sharp`/`resvg`) |
| Conteúdo: original visual identity, no copying `Assets/` references | ✅ | Icon derives from the user's own sketch `Assets/ícone.png`, not from the commercial references |
| Conteúdo: contrast (WCAG 2.1 AA reference) | ✅ | Back text/icon contrast unchanged (tests); icon colors checked in R4 |
| Qualidade: gates typecheck, lint, tests, content validation | ✅ | Tests updated/added per quickstart |

**Post-design re-check (after Phase 1)**: all ✅, no violations. One judgment call is recorded
here: `tsconfig.json` gains `allowImportingTsExtensions` so the Node-run script can import
`./icon/symbol.ts` with its extension. That is a compiler option, not a dependency, and is valid
because the project is `noEmit`.

## Project Structure

### Documentation (this feature)

```text
specs/003-app-icon-plain-backs/
├── plan.md              # This file
├── research.md          # Phase 0: R1–R7
├── data-model.md        # Phase 1: CategoryVisual change, IconSymbol, IconVariant
├── quickstart.md        # Phase 1: validation guide
├── contracts/
│   ├── card-back.md         # CardBack/Vignette contract (amends 002 visual-components)
│   └── app-icon-assets.md   # generated files, app.json keys, invariants
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks (not created here)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── CardBack.tsx            # EDIT: drop CategoryPattern, render <Vignette/> over solid color
│   ├── CardFront.tsx           # EDIT: import Vignette from './Vignette'
│   ├── CategoryPattern.tsx     # DELETE
│   ├── Vignette.tsx            # NEW: moved VignetteShape + Vignette
│   └── __tests__/CardBack.test.tsx   # EDIT: replace pattern tests with "no pattern" tests
└── theme/
    ├── categoryVisual.ts       # EDIT: remove PatternKind, CATEGORY_PATTERNS, pattern field
    └── __tests__/categoryVisual.test.ts  # EDIT: drop "distinct pattern" test

scripts/
├── icon/symbol.ts              # NEW: params, SDF/coverage, fit scale, SVG string (pure)
├── generate-icons.ts           # NEW: renders variants, PNG encoder, writes files
└── __tests__/
    ├── symbol.test.ts          # NEW: geometry, colors/contrast, safe-zone fit
    └── app-icons.test.ts       # NEW: generated files vs contract

Assets/
├── ícone.png                   # ADD to git: user's sketch (reference)
└── app/
    ├── icon-source.svg         # NEW (generated master)
    ├── icon.png, android-icon-foreground.png, android-icon-monochrome.png,
    │   favicon.png, splash-icon.png   # REGENERATED
    └── android-icon-background.png    # DELETE

app.json                        # EDIT: remove adaptiveIcon.backgroundImage; splash imageWidth 128
tsconfig.json                   # EDIT: allowImportingTsExtensions
CLAUDE.md                       # EDIT: one line on regenerating icons
```

**Structure Decision**: same single Expo project. The generator goes in a new top-level
`scripts/` folder, because it is build tooling and not one of the three app layers. Its tests sit
next to it and Jest picks them up with the existing config (no `testPathIgnorePatterns` change
needed).

## Implementation Notes

- **Order**: US1 (card backs) and US2 (icon) touch disjoint files and can be done in either order
  or in parallel. US1 is first by priority.
- **US1 test strategy**: with the svg mock from `jest.setup.ts`, render `CardBack` for all 8
  categories × `full`/`mini` and assert there are no `Circle`/`Path` hosts and exactly one `Rect`
  (the vignette's gradient fill) plus one `RadialGradient`.
- **US2 determinism**: the generator must be byte-for-byte deterministic. Use fixed iteration
  order, no timestamps in PNG chunks, and a fixed zlib level. Rerunning it should leave
  `git status` clean.
- **Expo Go caveat**: launcher icon and splash changes only show in a native build (dev build
  or APK), not in Expo Go. The quickstart covers this.

## Complexity Tracking

No constitution violations; nothing to justify.
