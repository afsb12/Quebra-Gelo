# Research: Novo Ícone do App e Verso das Cartas Sem Padrões

Phase 0 output for [plan.md](./plan.md). Items marked **Amends 002** change a decision recorded in
[002 research](../002-card-visual-design/research.md).

## R1. Card back without the pattern (**Amends 002 R2**)

- **Decision**: delete the per-category geometric pattern entirely: the `CategoryPattern`
  component, the `PatternKind` type, `CATEGORY_PATTERNS` and the `pattern` field of
  `CategoryVisual`. The back face keeps its solid `backgroundColor` (already set on the face
  `View`) and renders only the existing `Vignette` overlay on top of it, with the same tint
  (`#000000`) and strength (`0.16`) it has today. `Vignette` moves to its own file
  (`src/components/Vignette.tsx`), since it is now shared by front and back and the "pattern" file
  no longer has a reason to exist.
- **Rationale**: the user asked to remove the drawings and keep only the colors; clarification
  Q2 keeps the edge vignette. Removing dead code (instead of adding a `'none'` pattern kind) keeps
  the visual model honest: no category has a pattern, so the type should not offer one (YAGNI).
  Fewer SVG nodes on the back also lightens the flip/swipe frames (SC-006).
- **Alternatives considered**: a `'none'` `PatternKind` or an opacity of `0` (keeps unused code
  and tests around); a feature flag to toggle patterns (no requirement asks for it).

## R2. Category distinguishability without the pattern

- **Decision**: no palette change. The 8 back colors from 002 R1 are already 8 distinct hue
  families (yellow, indigo, crimson, orange, purple, turquoise, pink, emerald), and each category
  keeps its own icon. The pattern was a tertiary cue drawn at 12% opacity.
- **Closest pairs** (the risk the spec calls out): `casual` `#F5C230` vs `happy-hour` `#F27A1F`
  (yellow vs orange, different icons) and `casais` `#C41E3A` vs `nostalgia` `#F28CB4`
  (crimson vs light pink). Both pairs differ clearly in hue or lightness. SC-002 (5-person test)
  is the acceptance check; if a pair fails, the color is adjusted as a bug fix (spec Assumptions).
- **Light colors vs cream frame**: unchanged from 002. The cream frame was always next to the solid
  back color. The 12% pattern did not separate them, and the frame's drop shadow plus the kept
  vignette still do.

## R3. Icon symbol geometry

- **Decision**: refine the user's sketch into a parametric symbol, defined in units of the square
  side `S`:

  | Parameter | Value | Note |
  |---|---|---|
  | Square side | `S` | both squares equal (the sketch's ~188 vs ~180 px difference was hand-drawn noise) |
  | Diagonal offset | `0.42 S` on x and y | square A top-left, square B bottom-right; the sketch uses ~0.40 |
  | Corner radius | `0.24 S` | soft "squircle-like" corners, premium feel |
  | Stroke width | `0.085 S`, centered on the outline | uniform weight (FR-007) |
  | Intersection | `A ∩ B` of the outline shapes, filled | top-left corner rounded by B, bottom-right corner rounded by A, as in the sketch |

  Paint order: background → intersection fill (accent) → both outlines (cream) on top, so the
  outlines cross over the fill cleanly. Perfect symmetry about the anti-diagonal (the sketch's
  composition), so the bounding-box center is also the visual center.
- **Rationale**: keeps the concept and composition of `Assets/ícone.png` (two rounded squares
  meeting, with the common ground taking shape). It corrects the hand-drawn inaccuracies (unequal
  squares, uneven strokes) and adds the text-free, flat, precise finish asked for.
- **Alternatives considered**: no outlines, two solid translucent squares (loses the sketch's line
  quality and reads as a generic "overlap" logo); gradient fill (rejected in clarification Q1);
  keeping the "Quebra-Gelo" wordmark (illegible at icon size, spec Assumptions).

## R4. Icon colors (clarification Q1)

- **Decision**: background `#16131C` (`tokens.colors.appBackground`), outlines `#F7F0E3`
  (`tokens.colors.cream`), intersection accent **coral `#FF6B4A`**.
- **Checks** (WCAG relative luminance, same formula as `src/theme/color.ts`):

  | Pair | Ratio | Rule |
  |---|---|---|
  | accent vs background | 6.52 | ≥ 4.5 so the focal shape pops on the dark tile |
  | cream vs background | 16.6 | ≥ 7 for the outlines |
  | accent vs cream | 2.49 | ≥ 2.2: a distinct tone, but the cream outline always separates them |

- **Rationale**: warm coral ties to the playful category palette without matching any single
  category, and it is the most saturated point in the icon, which reads as premium on a dark
  tile. Amber candidates (`#F59E5B`, 1.87 vs cream) were too close to the cream.
- **Alternatives considered**: `#FF7A59` / `#F4845F` (equivalent, slightly lighter, lower
  separation from cream); `#E8704F` (duller on dark).

## R5. Rendering pipeline: one generator script, no new dependencies

- **Decision**: `scripts/generate-icons.ts`, run with plain `node` (Node 24 strips TypeScript
  types natively), produces every artifact from the R3/R4 parameters:
  1. `Assets/app/icon-source.svg`: the editable, scalable master (FR-013).
  2. All PNG variants (R6), rasterized by the script itself: per-pixel signed-distance functions
     of the rounded rectangles, with analytic anti-aliasing (coverage = clamp(0.5 − d/px)) and
     4×4 supersampling at corner joins. The PNG encoder is written with Node's built-in `zlib`
     (`deflateSync`, `crc32`).
  The pure parts (geometry, SDF coverage, SVG string, fit-to-safe-zone scale) live in
  `scripts/icon/symbol.ts` so Jest can test them. File I/O stays in `generate-icons.ts`.
- **Rationale**: the shapes are only rounded rectangles and their intersection, so an exact SDF
  rasterizer is ~100 lines and pixel-precise. It avoids adding `sharp`/`resvg` (native binaries,
  heavy on Windows, unjustified for a one-off asset step: constitution "Novas dependências MUST
  ser justificadas"). The script, the SVG and the PNGs come from one set of parameters, so they
  can never drift apart.
- **Typing**: the script is TypeScript under `tsc --noEmit` and ESLint like the rest of the repo;
  it adds `/// <reference types="node" />` (the root `tsconfig` limits global `types` to `jest`;
  `@types/node` is already installed transitively). The import of `./icon/symbol.ts` needs
  `allowImportingTsExtensions` (valid because the project is `noEmit`).
- **Alternatives considered**: hand-exporting PNGs from a design tool (not reproducible, breaks
  FR-013); `jimp-compact`/`pngjs` already in `node_modules` (transitive only, could disappear on
  any upgrade); `sharp` (native dependency, rejected above).

## R6. Variant specs (Expo SDK 58 config)

| Variant | File | Size | Background | Symbol size | Notes |
|---|---|---|---|---|---|
| Main / iOS | `Assets/app/icon.png` | 1024×1024 | opaque `#16131C`, **no alpha channel** | bbox = 60% of canvas | iOS rejects transparency; iOS applies its own corner mask |
| Android adaptive foreground | `Assets/app/android-icon-foreground.png` | 1024×1024 | transparent | farthest point ≤ 0.30 × canvas from center | safe zone is a 66 dp circle on a 108 dp canvas (radius 0.3056) |
| Android adaptive background | none: `adaptiveIcon.backgroundColor: "#16131C"` | n/a | color | n/a | a flat-color PNG is redundant; `backgroundImage` and its file are removed |
| Android monochrome | `Assets/app/android-icon-monochrome.png` | 1024×1024 | transparent | same as foreground | single color (white), outlines + fill merged; the system tints it |
| Favicon | `Assets/app/favicon.png` | 48×48 | opaque `#16131C` | bbox = 70% | readability check for SC-004 |
| Splash | `Assets/app/splash-icon.png` | 1024×1024 | transparent | bbox = 100% minus stroke margin | `expo-splash-screen` `imageWidth` 160 → **128**, `backgroundColor` stays `#16131C`; no text (clarification Q3) |

- **Legibility at 48 px** (SC-004): main icon, `S ≈ 48·0.60 / 1.505 ≈ 19 px` → stroke ≈ 1.6 px,
  intersection ≈ 11 px wide. Favicon: stroke ≈ 1.9 px. Both stay above 1.5 px, so the strokes
  don't break up.
- **Rationale**: matches the existing `app.json` keys (only `backgroundImage` disappears),
  Expo's documented adaptive-icon safe zone, and Apple's opaque 1024 requirement.
- **Alternatives considered**: keeping the 512 px Android sizes (1024 gives crisper xxxhdpi
  downscales at no cost).

## R7. Sketch file and generated files in git

- **Decision**: commit `Assets/ícone.png` as the design reference (spec Assumptions) and commit the
  generated SVG and PNGs. The PNGs are what Expo reads at build time, and the script is only rerun
  when the design changes.
- **Rationale**: keeps builds deterministic without a pre-build step; `Assets/` is already the
  reference-image folder.
