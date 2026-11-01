---

description: "Task list for 002-card-visual-design"
---

# Tasks: Identidade Visual das Cartas por Categoria

**Input**: Design documents from `/specs/002-card-visual-design/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/visual-components.md,
quickstart.md — and the **001-icebreaker-cards-mvp** code base (Expo project, `src/data/types.ts`,
`src/data/data.json`, `src/data/content.ts`, content test, `SwipeCard`, `DeckScreen`, `HomeScreen`,
`FavoritesScreen`, `FavoriteListItem`, `DeckComplete`). This feature is a delta on top of 001:
run 001's setup and foundational phases first (or implement both features together, as
recommended in plan.md "Amendments to the 001 design").

**Tests**: Included. The constitution requires automated tests for data/visual rules and content
validation, and quickstart.md lists the automated checks for this feature.

**Organization**: Tasks are grouped by user story (spec.md US1–US3) to enable independent
implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Paths are relative to the repository root (single Expo project, `src/`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the dependencies this feature needs to the existing Expo project

- [ ] T001 Install visual dependencies with `npx expo install react-native-svg expo-font expo-splash-screen @expo-google-fonts/outfit` and confirm they are listed in package.json
- [ ] T002 [P] Create the theme folder skeleton `src/theme/` with an `index.ts` barrel that will re-export tokens, color, categoryVisual and geometry modules in src/theme/index.ts
- [ ] T003 [P] Add a Jest mock for `react-native-svg` (render primitives as plain host components) so component tests can render SVG in jest.setup.ts (create or extend the file referenced by `setupFiles` in jest.config.js)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Theme tokens, color math, category visuals, geometry and fonts used by every story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Tests (write first, ensure they fail)

- [ ] T004 [P] Write tests for `contrastRatio` (WCAG 2.1 relative luminance; e.g. `#FFFFFF` vs `#000000` = 21), `pickOnColor` ("whichever of `onColorLight`/`onColorDark` has the higher contrast; MUST be ≥ 4.5:1") and `inkOnCream` ("`color` darkened in HSL lightness steps until contrast with `cream` ≥ 4.5:1") in `src/theme/__tests__/color.test.ts`
- [ ] T005 [P] Write the palette test asserting, for all 8 categories, the exact `color`, derived `onColor` and `ink` from research.md R1 (casual `#F5C230`/dark/`#8A6100`; profundo `#3D3FA6`/white/`#3D3FA6`; casais `#C41E3A`/white/`#B01A34`; happy-hour `#F27A1F`/dark/`#A84F00`; dilemas `#7A3EB1`/white/`#6E35A3`; viagens `#14A39E`/dark/`#0B6B67`; nostalgia `#F28CB4`/dark/`#A6316B`; futuro `#167A4C`/white/`#167A4C`), that `contrast(onColor, color) ≥ 4.5`, `contrast(ink, cream) ≥ 4.5`, `contrast(questionInk, cream) ≥ 4.5`, and that the 8 pattern kinds are pairwise distinct, in `src/theme/__tests__/categoryVisual.test.ts` (if a computed `ink` differs from the table, adjust the darkening step so the table value is produced, keeping ≥ 4.5:1)
- [ ] T006 [P] Write tests for `getCardGeometry` (ratio `5 / 7`; `width = min(screenWidth − 48, 360)`, reduced when `height` exceeds available height = screen height − reservedHeight; `radius = 0.06 × width`; `miniWidth = (screenWidth − 48 − 16) / 2`, so 2 columns fit at 320pt) and `questionBaseSize` (≤ 120 chars → 26, 121–160 → 23, 161–200 → 21) in `src/theme/__tests__/geometry.test.ts`

### Implementation

- [ ] T007 [P] Create design tokens exactly as data-model.md: `appBackground '#16131C'`, `cream '#F7F0E3'`, `questionInk '#22202A'`, `onColorDark '#1B1A22'`, `onColorLight '#FFFFFF'`, `cardRatio 5 / 7`, `cardMaxWidth 360`, `minQuestionSize 20`, and font names `display 'Outfit_800ExtraBold'`, `question 'Outfit_600SemiBold'`, `body 'Outfit_400Regular'` (all `as const`) in src/theme/tokens.ts
- [ ] T008 Implement pure `contrastRatio`, `pickOnColor`, `inkOnCream(color, cream = tokens.cream)` with hex parsing/HSL helpers and no React imports in src/theme/color.ts (depends on T007; makes T004 pass)
- [ ] T009 Implement `PatternKind` union (`'dots' | 'concentric' | 'diamonds' | 'bubbles' | 'checker' | 'waves' | 'stripes' | 'chevrons'`), the `Record<CategoryId, PatternKind>` map (casual → dots, profundo → concentric, casais → diamonds, happy-hour → bubbles, dilemas → checker, viagens → waves, nostalgia → stripes, futuro → chevrons), the `CategoryVisual` type `{ categoryId, color, onColor, ink, pattern, icon }` and memoized `getCategoryVisual(category: Category)` in src/theme/categoryVisual.ts (depends on T008)
- [ ] T010 [P] Implement `CardGeometry` type, `getCardGeometry(screen: { width: number; height: number }, reservedHeight: number)` and `questionBaseSize(text: string): 26 | 23 | 21` in src/theme/geometry.ts (depends on T007; makes T006 pass)
- [ ] T011 Set each category's `color` and `icon` in src/data/data.json to the research values: casual `#F5C230` `emoticon-happy-outline`; profundo `#3D3FA6` `lightbulb-on-outline`; casais `#C41E3A` `heart-outline`; happy-hour `#F27A1F` `glass-cocktail`; dilemas `#7A3EB1` `scale-balance`; viagens `#14A39E` `airplane`; nostalgia `#F28CB4` `teddy-bear`; futuro `#167A4C` `rocket-launch-outline` (makes T005 pass together with T009)
- [ ] T012 Extend the content test so "Every `Category.color` in `data.json` equals the R1 table value" and every `icon` exists in `MaterialCommunityIcons.glyphMap` in `src/data/__tests__/content.test.ts`
- [ ] T013 Update the root layout to load `Outfit_800ExtraBold`, `Outfit_600SemiBold`, `Outfit_400Regular` via `useFonts` from `@expo-google-fonts/outfit`, call `SplashScreen.preventAutoHideAsync()` at module scope and hide the splash only when fonts are loaded AND the favorites store has hydrated; set the screen background to `tokens.appBackground` in src/app/_layout.tsx
- [ ] T014 Map the font tokens into NativeWind (`fontFamily.display`, `fontFamily.question`, `fontFamily.body`) and the color tokens (`app`, `cream`, `ink`) in tailwind.config.js, importing values from src/theme/tokens.ts so there is one source of truth
- [ ] T015 Re-export all theme modules from src/theme/index.ts and run `npx jest src/theme src/data` — T004, T005, T006 and the content test must pass

**Checkpoint**: Foundation ready — palette, contrast, geometry and fonts available to all stories

---

## Phase 3: User Story 1 - Reconhecer a categoria pela cor e pelo verso da carta (Priority: P1) 🎯 MVP

**Goal**: Face-down cards look like real playing cards with the category's color, bold name, big
icon and a unique tone-on-tone geometric pattern.

**Independent Test**: Open each of the 8 categories: the back shows its own color, name, icon and
pattern, distinguishable from the other 7 without reading, with light frame + shadow on the dark
background; no question text on the back.

### Tests for User Story 1 ⚠️

- [ ] T016 [P] [US1] Write component tests: `CardBack` renders the category title (uppercase) and icon, never any question text ("verso não mostra a pergunta"), and uses `onColor` for name/icon; `CategoryPattern` renders for all 8 `PatternKind`s without throwing, in `src/components/__tests__/CardBack.test.tsx`

### Implementation for User Story 1

- [ ] T017 [US1] Implement `CategoryPattern` (`{ kind: PatternKind; color: string; onColor: string; width: number; height: number }`) with `react-native-svg`: background rect in `color`, 8 static geometric generators (dots grid, concentric circles from one corner, diamond lattice, bubbles of three sizes, half-tone checkerboard, horizontal waves, diagonal stripes, upward chevrons) drawn in `onColor` at 10–14% opacity inside a `viewBox` with the card ratio, shapes memoized with `useMemo` per kind/size, no animation, plus a `RadialGradient` vignette (center transparent → edges ~8% darker); StyleSheet only, in src/components/CategoryPattern.tsx
- [ ] T018 [US1] Implement `CardBack` (`{ category: Category; visual: CategoryVisual; width: number; variant: 'full' | 'mini' }`): 6pt cream outer frame, corner radius `0.06 × width`, `CategoryPattern` fill, centered `MaterialCommunityIcons` icon ≈ 30% of width in the upper half, category title in `tokens.fonts.display`, uppercase, one word per line, centered in the lower half, color `visual.onColor`; `variant 'mini'` scales icon/title proportionally; MUST NOT render any question text; StyleSheet only, in src/components/CardBack.tsx (depends on T017)
- [ ] T019 [US1] Add card shadow (Android `elevation: 8`; iOS `shadowOpacity: 0.35`, `shadowRadius: 16`) to the card container and size the card with `getCardGeometry(windowDimensions, reservedHeight)` in src/components/SwipeCard.tsx
- [ ] T020 [US1] Replace the back side of the flip in `SwipeCard` with `CardBack variant="full"` (keeping existing gesture/flip props and `backfaceVisibility: 'hidden'`) and pass `visual` from the screen in src/components/SwipeCard.tsx (depends on T018, T019)
- [ ] T021 [US1] Compute `getCategoryVisual(category)` in the deck container and pass `visual` and geometry to `SwipeCard` in src/screens/DeckScreen.tsx

**Checkpoint**: Card backs show full category identity; US1 testable on device

---

## Phase 4: User Story 2 - Ler a pergunta com conforto na face revelada (Priority: P1)

**Goal**: The revealed face is cream paper with large dark question text, category-colored inner
frame, corner icon, footer name and a non-overlapping favorite indicator.

**Independent Test**: Reveal the longest question of each category on a 320pt-wide phone: text
fits entirely (≥ 20pt), dark on cream, icon top-left, footer name and inner frame in the category
`ink`; favoriting shows the star top-right without covering text.

### Tests for User Story 2 ⚠️

- [ ] T022 [P] [US2] Write component tests: `CardFront` renders question text, footer with the category title and icon in `visual.ink`; the star indicator renders only when `isFavorite` and is not pressable; question font size equals `questionBaseSize(text)`, in `src/components/__tests__/CardFront.test.tsx`
- [ ] T023 [P] [US2] Write the text-fit test: for the longest question of every category in data.json, the size from `questionBaseSize` and the fit helper's minimum never drop below `tokens.minQuestionSize` (20pt) on a 320×568 viewport with font scale 1.0 (SC-003), in `src/theme/__tests__/textFit.test.ts`

### Implementation for User Story 2

- [ ] T024 [US2] Implement a pure fit helper `questionFit(text: string, boxWidth: number, boxHeight: number, fontScale: number): { fontSize: number; minimumFontScale: number }` that starts at `questionBaseSize(text)` and returns a `minimumFontScale` such that the rendered size never goes below 20pt, in src/theme/geometry.ts (makes T023 pass)
- [ ] T025 [US2] Implement `CardFront` (`{ category: Category; visual: CategoryVisual; question: Question; isFavorite: boolean; width: number }`): cream background with warm `RadialGradient` vignette (~5%), 6pt cream outer frame, inner frame 1.5pt in `visual.ink` inset 10pt, top row with icon (28pt, `ink`, left) and star indicator (22pt, `ink`, right, only when `isFavorite`, `pointerEvents="none"`), question block vertically centered and left-aligned in `tokens.fonts.question` color `tokens.questionInk` using `questionFit` with `adjustsFontSizeToFit` + `allowFontScaling`, footer with the category title (13pt, uppercase, letter-spaced, `ink`, `tokens.fonts.body`); top and bottom rows have fixed heights so nothing overlaps the text; StyleSheet only, in src/components/CardFront.tsx (depends on T024)
- [ ] T026 [US2] Replace the front side of the flip in `SwipeCard` with `CardFront`, passing `question`, `isFavorite` and `visual`; delete the old `CardFace` component and its imports in src/components/SwipeCard.tsx and src/components/CardFace.tsx (depends on T025)
- [ ] T027 [US2] When the system font scale is large, let the card grow up to the available height before text shrinks: pass `PixelRatio.getFontScale()` into `getCardGeometry`/`questionFit` from the container in src/screens/DeckScreen.tsx

**Checkpoint**: US1 + US2 deliver the full card look on both faces

---

## Phase 5: User Story 3 - Cor da categoria consistente em todo o app (Priority: P2)

**Goal**: Home shows each category as a mini card back (2 columns at 320pt) with name and
description below; Favorites and "Fim do Baralho" use the same color/icon/radius.

**Independent Test**: For each category, compare color and icon on the Home mini card, card back,
card front, favorites item and end-of-deck screen — all match.

### Tests for User Story 3 ⚠️

- [ ] T028 [P] [US3] Write component tests: `MiniCard` renders a `CardBack variant="mini"` plus title and description below and calls `onPress(category.id)`; its accessibility label is `"<title>. <description>"`, in `src/components/__tests__/MiniCard.test.tsx`
- [ ] T029 [P] [US3] Write component tests: `FavoriteListItem` shows the category icon and title in the category color; `DeckComplete` uses the category color, in `src/components/__tests__/Consistency.test.tsx`

### Implementation for User Story 3

- [ ] T030 [US3] Implement `MiniCard` (`{ category: Category; visual: CategoryVisual; width: number; onPress(id: CategoryId): void }`): one `Pressable` wrapping `CardBack variant="mini"` at `width` plus title (`font-display`) and description (`font-body`) below, NativeWind classes for the wrapper/labels only, in src/components/MiniCard.tsx
- [ ] T031 [US3] Replace the Home grid items with `MiniCard` in a 2-column grid using `getCardGeometry(...).miniWidth` and 16pt gaps; remove `CategoryTile` usage, in src/screens/HomeScreen.tsx (depends on T030)
- [ ] T032 [US3] Delete the obsolete `CategoryTile` component and its test in src/components/CategoryTile.tsx and `src/components/__tests__/CategoryTile.test.tsx`
- [ ] T033 [P] [US3] Update `FavoriteListItem` to accept `visual: CategoryVisual` and render the category icon and title in `visual.color` with a left accent bar and the card corner radius in src/components/FavoriteListItem.tsx
- [ ] T034 [P] [US3] Update `DeckComplete` to accept `visual: CategoryVisual` and use `visual.color` as its accent/background with `visual.onColor` text in src/components/DeckComplete.tsx
- [ ] T035 [US3] Pass `getCategoryVisual(...)` to `FavoriteListItem` in src/screens/FavoritesScreen.tsx and to `DeckComplete` in src/screens/DeckScreen.tsx (depends on T033, T034)

**Checkpoint**: All three stories functional; identity consistent across the app

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Gates, docs and manual validation

- [ ] T036 [P] Add the new commands (`npx jest src/theme`, single test by name) to the commands section of CLAUDE.md
- [ ] T037 Run `npm run typecheck`, `npm run lint` and `npm test`; fix any failures (no `any`, no StyleSheet/NativeWind mix inside one component) across src/
- [ ] T038 Run the manual scenarios 1–9 of specs/002-card-visual-design/quickstart.md on a physical phone (backs, front, long text, largest system font, consistency, color-blind filter, offline fonts, originality review vs `Assets/`) and record results in specs/002-card-visual-design/quickstart.md under a "Results" heading
- [ ] T039 Verify 60 fps during flip/swipe with the new faces (performance monitor, mid-range Android); if frames drop, memoize `CardBack`/`CardFront` with `React.memo` in src/components/CardBack.tsx and src/components/CardFront.tsx

---

## Dependencies & Execution Order

### Phase Dependencies

- **External**: 001 setup + foundational + card component must exist (see Prerequisites)
- **Setup (Phase 1)**: no dependencies within 002
- **Foundational (Phase 2)**: depends on Setup — BLOCKS all user stories
- **US1 (Phase 3)** and **US2 (Phase 4)**: depend on Foundational; both edit `SwipeCard.tsx`
  (T019/T020 vs T026), so run US1 before US2 or coordinate that file
- **US3 (Phase 5)**: depends on Foundational and on `CardBack` (T018) for `MiniCard`
- **Polish (Phase 6)**: after the desired stories

### User Story Dependencies

- **US1 (P1)**: independent after Foundational
- **US2 (P1)**: independent after Foundational (shares `SwipeCard.tsx` with US1)
- **US3 (P2)**: needs `CardBack` from US1 (T018); otherwise independent

### Within Each User Story

- Tests first (must fail), then helpers, then components, then screen wiring
- Commit after each task or logical group (project preference)

### Parallel Opportunities

- Setup: T002, T003
- Foundational tests: T004, T005, T006 together; then T007 → T008 → T009, with T010 in parallel
- US1: T016 while T017 is written
- US2: T022, T023 together
- US3: T028, T029 together; T033, T034 together
- Polish: T036 alongside T037

---

## Parallel Example: Phase 2

```bash
Task: "Write color helper tests in `src/theme/__tests__/color.test.ts"`
Task: "Write palette/pattern tests in `src/theme/__tests__/categoryVisual.test.ts"`
Task: "Write geometry tests in `src/theme/__tests__/geometry.test.ts"`
```

## Parallel Example: User Story 3

```bash
Task: "Update FavoriteListItem in src/components/FavoriteListItem.tsx"
Task: "Update DeckComplete in src/components/DeckComplete.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 Setup → Phase 2 Foundational
2. Phase 3 (US1): card backs with full identity
3. **STOP and VALIDATE** on device (quickstart scenario 2)

### Incremental Delivery

1. Foundation → US1 (backs) → US2 (fronts) → US3 (Home/Favorites/End consistency)
2. Each step keeps the game playable; validate with quickstart after each

### Combined with 001 (recommended)

Implement 001 phases 1–2, then this feature's Phases 1–2, then 001's card/screen phases using
`CardBack`/`CardFront`/`MiniCard` directly, avoiding throwaway `CardFace`/`CategoryTile` work.

---

## Notes

- [P] tasks = different files, no dependencies
- Constraint values (colors, sizes, ratios) are quoted from data-model.md/research.md — do not
  improvise them
- Avoid: mixing NativeWind and StyleSheet in the same component; animating decorative elements
