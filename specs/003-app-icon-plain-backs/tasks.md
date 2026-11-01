---

description: "Task list for 003 — app icon and plain card backs"
---

# Tasks: Novo Ícone do App e Verso das Cartas Sem Padrões

**Input**: Design documents from `/specs/003-app-icon-plain-backs/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: included. The plan and quickstart name the test suites, and the constitution requires
automated tests for changed logic (merge gate: `npm run typecheck && npm run lint && npm test`).

**Organization**: US1 (plain card backs) and US2 (app icon) touch disjoint files and are fully
independent.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)

---

## Phase 1: Setup

**Purpose**: Confirm a green baseline and track the design reference

- [X] T001 Run `npm run typecheck && npm run lint && npm test` on branch `003-app-icon-plain-backs` and confirm everything is green before any change (baseline)
- [X] T002 [P] Commit the user's sketch `Assets/ícone.png` as the icon design reference (research R7); do not modify it

---

## Phase 2: Foundational

**Purpose**: None required. US1 and US2 share no code and have no common prerequisite beyond
Phase 1.

**Checkpoint**: user story work can start (in any order or in parallel)

---

## Phase 3: User Story 1 - Verso da carta só com a cor da categoria (Priority: P1) 🎯 MVP

**Goal**: every card back (full card and home mini card) shows the flat category color plus the
existing edge vignette, icon and title, with no geometric pattern.

**Independent Test**: open the home screen and each of the 8 categories; no back shows dots,
rings, diamonds, bubbles, checker, waves, stripes or chevrons. Color, vignette, icon and title are
unchanged, and so are the front and the flip/swipe/haptics ([quickstart §3](./quickstart.md)).

### Tests for User Story 1

> Write first; they must FAIL before T006–T009.

- [X] T003 [US1] In `src/components/__tests__/CardBack.test.tsx`: delete the `describe('CategoryPattern', …)` block and the imports of `CATEGORY_PATTERNS`, `PatternKind` and `../CategoryPattern`. Add an `it.each` over all 8 `CategoryId`s × `['full', 'mini']` that renders `<CardBack … width={272} />` and asserts, using the svg host mocks from `jest.setup.ts` (walk `screen.toJSON()` and count host types; RNTL 14 has no `UNSAFE_*` queries): zero `Circle`, zero `Path`, exactly one `Rect` and exactly one `RadialGradient` (the vignette), and that the face `View` (`testID="card-back-face"`, added in T007) has `backgroundColor === visual.color` (contract [card-back.md](./contracts/card-back.md))
- [X] T004 [P] [US1] In `src/theme/__tests__/categoryVisual.test.ts`: remove the `CATEGORY_PATTERNS` import and the `'has one distinct pattern per category'` test; add a test that `getCategoryVisual(category)` for every category has no `pattern` key (`expect('pattern' in visual).toBe(false)`) and that the 8 `visual.color` values are pairwise distinct (spec FR-005)

### Implementation for User Story 1

- [X] T005 [P] [US1] Create `src/components/Vignette.tsx`: move `VignetteShape` (private), `VignetteProps` and the memoized `Vignette` export from `src/components/CategoryPattern.tsx` unchanged, keeping the `W = 100`/`H = 140` viewBox constants, the `useId`-based gradient id and `pointerEvents="none"`. StyleSheet-only, no NativeWind (contract "Moved (no behavior change)")
- [X] T006 [US1] Update `src/components/CardFront.tsx` to `import { Vignette } from './Vignette'` instead of `'./CategoryPattern'` (depends on T005)
- [X] T007 [US1] Update `src/components/CardBack.tsx`: remove the `CategoryPattern` import/element and render `<Vignette width={innerWidth} height={innerHeight} tint="#000000" strength={0.16} />` as the first child of the face `View` (the face already has `backgroundColor: visual.color`). Update the doc comment to "Face-down side: flat category color, edge vignette, big icon and bold name. Never shows a question." (depends on T005)
- [X] T008 [US1] Delete `src/components/CategoryPattern.tsx` (depends on T006, T007)
- [X] T009 [US1] In `src/theme/categoryVisual.ts`: remove `PatternKind`, `CATEGORY_PATTERNS`, the `pattern: PatternKind` field of `CategoryVisual` and `pattern: CATEGORY_PATTERNS[category.id]` in `getCategoryVisual` (data-model "CategoryVisual … `pattern` removed"); run `npx tsc --noEmit` and fix any remaining reference anywhere in `src/` and `app/` (depends on T008)
- [X] T010 [US1] Run `npm run typecheck && npm run lint && npx jest src/components src/theme`; T003/T004 now pass and all other existing component tests (`CardFront`, `MiniCard`, `Consistency`) stay green

**Checkpoint**: US1 complete. The card backs are plain everywhere and can be shipped alone (MVP).

---

## Phase 4: User Story 2 - Ícone do app moderno e minimalista (Priority: P2)

**Goal**: the app gets its own icon (two cream rounded-square outlines overlapping diagonally,
coral intersection, dark background, no text) in every variant, plus a matching symbol-only
splash, all generated from one parametric source.

**Independent Test**: `node scripts/generate-icons.ts` regenerates identical files; the asset
tests pass; on a native Android/iOS build the launcher, themed icon and splash show the new symbol
unclipped ([quickstart §2 and §4](./quickstart.md)).

### Setup for User Story 2

- [ ] T011 [US2] Add `"allowImportingTsExtensions": true` to `compilerOptions` in `tsconfig.json` (research R5; valid because the project is `noEmit`) and confirm `npm run typecheck` is still green

### Tests for User Story 2

> Write first; they must FAIL before T014–T016.

- [ ] T012 [P] [US2] Create `scripts/__tests__/symbol.test.ts` (imports `../icon/symbol`), asserting against data-model "IconSymbol":
  - (a) `SYMBOL` params are `side 1`, `offset 0.42`, `radius 0.24`, `stroke 0.085`, with `0 < radius < side / 2`, and `extent(SYMBOL)` ≈ `1.505`;
  - (b) `SYMBOL.colors.background === tokens.colors.appBackground` and `SYMBOL.colors.outline === tokens.colors.cream` (import `tokens` from `src/theme`), and `accent === '#FF6B4A'`;
  - (c) using `contrastRatio` from `src/theme/color.ts`, contrast is accent vs background ≥ 4.5, outline vs background ≥ 7, accent vs outline ≥ 2.2;
  - (d) for the radius fit `{ kind: 'radius', ratio: 0.30 }` at size 1024, every point with coverage > 0 lies within `0.3056 × 1024` of the center (sample the outer contour via `maxRadius`, plus a coarse 64×64 grid scan of `coverageAt`);
  - (e) `coverageAt` at the intersection center returns the fill layer and at the canvas corner returns background only;
  - (f) `toSvg(…)` contains no `<text` and exactly three distinct fill/stroke colors
- [ ] T013 [P] [US2] Create `scripts/__tests__/app-icons.test.ts`: read each generated file with `fs.readFileSync`, parse the PNG `IHDR` (width, height, color type) and inflate `IDAT` with `zlib.inflateSync` (unfilter rows) to sample pixels. Assert, per [contracts/app-icon-assets.md](./contracts/app-icon-assets.md):
  - `icon.png` is 1024² RGB (color type 2, no alpha), its corner pixel is `#16131C` and the symbol-center pixel is `#FF6B4A`;
  - `android-icon-foreground.png` and `android-icon-monochrome.png` are 1024² RGBA (type 6), with every pixel of alpha > 0 within `0.3056 × 1024` of the center, and the monochrome one has only white RGB where alpha > 0;
  - `favicon.png` is 48² RGB;
  - `splash-icon.png` is 1024² RGBA with transparent corners;
  - `android-icon-background.png` does not exist and `icon-source.svg` exists without `<text`;
  - in `app.json`, `android.adaptiveIcon` has no `backgroundImage`, `backgroundColor === '#16131C'`, and the `expo-splash-screen` plugin has `imageWidth: 128`.

### Implementation for User Story 2

- [ ] T014 [US2] Create `scripts/icon/symbol.ts` (pure, no I/O, strict TS, no `any`). Export:
  - `interface IconSymbol { side; offset; radius; stroke; colors: { background; outline; accent } }` and `SYMBOL` with values `1`, `0.42`, `0.24`, `0.085`, `#16131C`, `#F7F0E3`, `#FF6B4A`;
  - `type IconFit = { kind: 'bbox'; ratio: number } | { kind: 'radius'; ratio: number }`;
  - `extent(s)` = `side + offset + stroke`, and `maxRadius(s)` = `√2·(extent/2 − stroke/2 − radius) + radius + stroke/2` (data-model "Derived values");
  - `layout(s, size, fit)` returns `{ scale, cx, cy }` placing the symbol centered;
  - `sdfRoundedRect(px, py, rect, r)`;
  - `coverageAt(x, y, layout, s)`, which returns `{ fill, outline }` coverages in [0,1], with analytic anti-aliasing `clamp(0.5 − d/pixel)`: fill = `A ∩ B` (`max(sdfA, sdfB) ≤ 0`) on the outline centerlines, outline = union of `|sdf| − stroke/2 ≤ 0` for A and B. Paint order is background → fill → outline (research R3);
  - `toSvg(s, size, fit, background: boolean)`, which emits an SVG with a background `<rect>`, the intersection as a `<clipPath>`-clipped rounded `<rect>` filled with accent, then two stroked rounded `<rect>`s in outline color, with no `<text>`
- [ ] T015 [US2] Create `scripts/generate-icons.ts` (first line `/// <reference types="node" />`, imports `./icon/symbol.ts` with extension). Implement:
  - a deterministic PNG encoder with `node:zlib` (`deflateSync` at level 9, `crc32`): signature, `IHDR`, a single `IDAT` with filter byte 0 per row, `IEND`, no `tEXt`/`tIME` chunks; color type 2 (RGB) for opaque variants and 6 (RGBA) for transparent ones;
  - `render(size, fit, { background: 'opaque' | 'transparent', mode: 'color' | 'mono' })`, which composites per pixel with 4×4 supersampling. Color mode: background `#16131C` → accent × fill → outline × outline. Mono mode: white with alpha = max(fill, outline);
  - writes for the six artifacts in research R6 / the contract table: `Assets/app/icon-source.svg` (bbox 0.60, opaque); `icon.png` (1024, bbox 0.60, opaque); `android-icon-foreground.png` (1024, radius 0.30, transparent, color); `android-icon-monochrome.png` (1024, radius 0.30, transparent, mono); `favicon.png` (48, bbox 0.70, opaque); `splash-icon.png` (1024, bbox fit so the outline edge touches the canvas minus one stroke margin, transparent, color);
  - logs each written path.
  (depends on T014)
- [ ] T016 [US2] Run `node scripts/generate-icons.ts` to regenerate the 5 PNGs and create `Assets/app/icon-source.svg`; delete `Assets/app/android-icon-background.png`; run it a second time and confirm `git status Assets/app` shows no further change (determinism, plan "US2 determinism") (depends on T015)
- [ ] T017 [US2] Update `app.json`: remove `expo.android.adaptiveIcon.backgroundImage` (keep `backgroundColor: "#16131C"`, `foregroundImage`, `monochromeImage`), and change the `expo-splash-screen` plugin `imageWidth` from `160` to `128` (contract "`app.json` changes")
- [ ] T018 [US2] Visually review `Assets/app/icon.png`, `android-icon-foreground.png`, `favicon.png` and `splash-icon.png` (Read the images): the outlines are even, the corners smooth, the coral overlap is clean and the symbol centered, with no text and no clipping. Then run `npx jest scripts` and `npm run typecheck && npm run lint`; T012/T013 now pass

**Checkpoint**: US2 complete. The icon is in place and verified by tests. The device check is in Polish.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T019 [P] Add a "Regenerating the app icon" note to `CLAUDE.md` under "Stack notes": `node scripts/generate-icons.ts` writes `Assets/app/icon-source.svg` + all icon PNGs from `scripts/icon/symbol.ts`; edit the params there, never the PNGs by hand
- [ ] T020 [P] Update `specs/002-card-visual-design/contracts/visual-components.md`: mark `CategoryPatternProps` and the "CategoryPattern" render step as removed by 003, with a link to `../../003-app-icon-plain-backs/contracts/card-back.md`
- [ ] T021 Run the full merge gate `npm run typecheck && npm run lint && npm test`; all green
- [ ] T022 Run [quickstart.md](./quickstart.md) §3 (card backs in the app) and §4 (native build: launcher icon, shape masks, themed icon, splash, small sizes), and record any deviation as a follow-up

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: none
- **Foundational (Phase 2)**: empty
- **US1 (Phase 3)** and **US2 (Phase 4)**: both depend only on T001; independent of each other
- **Polish (Phase 5)**: T019/T020 any time after their story; T021–T022 after both stories

### Within Each Story

- US1: T003, T004 (tests, fail first) → T005 → T006 ∥ T007 → T008 → T009 → T010
- US2: T011 → T012 ∥ T013 (tests, fail first) → T014 → T015 → T016 → T017 → T018

### Parallel Opportunities

- T002 alongside T001
- The whole US1 track in parallel with the whole US2 track (disjoint files; the only shared file
  touched is none: US1 changes `src/`, US2 changes `scripts/`, `Assets/app/`, `app.json`,
  `tsconfig.json`)
- T004 ∥ T005 (different files); T012 ∥ T013; T019 ∥ T020

---

## Parallel Example: User Story 1

```bash
Task: "Update categoryVisual tests in src/theme/__tests__/categoryVisual.test.ts (T004)"
Task: "Create src/components/Vignette.tsx by moving Vignette out of CategoryPattern.tsx (T005)"
```

## Parallel Example: User Story 2

```bash
Task: "Write scripts/__tests__/symbol.test.ts (T012)"
Task: "Write scripts/__tests__/app-icons.test.ts (T013)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. T001–T002 → 2. T003–T010 → 3. **Stop and validate** (quickstart §3) → shippable on its own.

### Incremental Delivery

1. US1 (plain backs) → commit `feat: plain card backs without patterns`
2. US2 (icon) → commit `feat: new minimalist app icon and splash`
3. Polish → commit `docs: …`; open the PR to `main` after the gate is green

---

## Notes

- Commit after each completed task group (project preference); Conventional Commits.
- Expo Go shows its own icon: US2's on-device check needs a dev build/APK (quickstart §4).
- Never hand-edit the generated PNGs/SVG; change `scripts/icon/symbol.ts` and rerun.
