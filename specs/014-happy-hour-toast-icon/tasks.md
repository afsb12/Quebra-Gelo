# Tasks: Ícone de Brinde de Chope para o Happy Hour

**Input**: Design documents from `/specs/014-happy-hour-toast-icon/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/category-icon.md, quickstart.md

**Tests**: included: the constitution requires automated content validation (FR-008), and the new
component gets a unit test.

**Organization**: grouped by user story (US1 = Home backs, US2 = every other place the icon shows).

## Phase 1: Setup

No setup: `react-native-svg` is already installed and mocked in `jest.setup.ts`.

## Phase 2: Foundational (blocking prerequisites)

- [ ] T001 Create `src/theme/customIcons.ts`: `CUSTOM_ICONS` (`as const`) with `'beer-toast'` = `{ paths: ['M12 1.5v2.5M8.8 2.6l1 1.6M15.2 2.6l-1 1.6'], mirrored: { path: 'M4 9h7v10a1.5 1.5 0 01-1.5 1.5h-4A1.5 1.5 0 014 19zM4 11.5H2.5v4H4M4 9c0-1.5 1.2-2.4 2.3-1.8.6-1 2.2-1 2.8 0 1.1-.4 1.9.6 1.9 1.8M7.5 12v5', transform: 'rotate(14 7.5 14)' } }`, plus `CUSTOM_ICON_STROKE = 2`, `type CustomIconName = keyof typeof CUSTOM_ICONS` and `isCustomIcon(name: string): name is CustomIconName` (own-property check); re-export from `src/theme/index.ts`
- [ ] T002 Create `src/components/CategoryIcon.tsx` per contracts/category-icon.md: memoized `CategoryIcon({ name, size, color })`; for a custom name render `Svg` (`width`/`height` = size, `viewBox="0 0 24 24"`, `testID={`icon-${name}`}`, `accessibilityElementsHidden`, `importantForAccessibility="no-hide-descendants"`, `pointerEvents="none"`) with each `paths` entry as a `Path` (`fill="none"`, `stroke={color}`, `strokeWidth={CUSTOM_ICON_STROKE}`, round caps/joins), and `mirrored.path` drawn in `G transform={mirrored.transform}` and again in `G transform="translate(24 0) scale(-1 1)"` › `G transform={mirrored.transform}`; otherwise render `MaterialCommunityIcons` with the same `name`/`size`/`color`
- [ ] T003 [P] Add `src/components/__tests__/CategoryIcon.test.tsx`: `beer-toast` renders `icon-beer-toast` as an `Svg` with size, 3 `Path`s stroked in `color` with `strokeWidth` 2 and hidden from accessibility; `glass-flute` renders the glyph mock `icon-glass-flute` with the same size/color

**Checkpoint**: the icon can be drawn anywhere.

## Phase 3: User Story 1 - Reconhecer o Happy Hour de relance (Priority: P1) 🎯 MVP

**Goal**: Home backs (mini) and the full back show the toast for Happy Hour, the flute stays on Primeiros Encontros.

**Independent Test**: Home shows the toast on the Happy Hour mini back and the flute on Primeiros Encontros.

- [ ] T004 [US1] In `src/data/data.json` set the `happy-hour` category `icon` from `"glass-cocktail"` to `"beer-toast"` (no other change)
- [ ] T005 [US1] Update the `icon` doc comment in `src/data/types.ts`: "MaterialCommunityIcons glyph name or a `CUSTOM_ICONS` key (theme/customIcons.ts)"
- [ ] T006 [US1] Update test 4 in `src/data/__tests__/content.test.ts`: every category icon is in the glyph map **or** `isCustomIcon(icon)`; add a check that no `CUSTOM_ICONS` key is also a glyph name ("A custom icon name MUST NOT also be a MaterialCommunityIcons glyph name"), and that `happy-hour` uses `beer-toast`
- [ ] T007 [US1] Replace `MaterialCommunityIcons` with `CategoryIcon` (same size/color) in `src/components/CardBack.tsx` and drop its unused `IconName` type/import

**Checkpoint**: US1 works: the Home grid and the full back show the toast.

## Phase 4: User Story 2 - O mesmo ícone em todo o app (Priority: P2)

**Goal**: card front corner, origin badge, mix filter, favorites and end-of-deck show the toast.

**Independent Test**: play/favorite/filter/finish Happy Hour: the toast appears in all 5 places.

- [ ] T008 [P] [US2] Use `CategoryIcon` (size 28, `visual.ink`) for the corner icon in `src/components/CardFront.tsx`; keep the star as `MaterialCommunityIcons`
- [ ] T009 [P] [US2] Use `CategoryIcon` (size 14, `visual.onColor`) in `src/components/CategoryBadge.tsx`
- [ ] T010 [P] [US2] Use `CategoryIcon` (size 20, `visual.onColor`) for the category icon in `src/components/MixFilterSheet.tsx`; keep other glyphs as they are
- [ ] T011 [P] [US2] Use `CategoryIcon` (size 18, `visual.ink`) for the category icon in `src/components/FavoriteListItem.tsx`; keep the remove star as is
- [ ] T012 [P] [US2] Use `CategoryIcon` (size 56, `visual.onColor`) in `src/components/DeckComplete.tsx` (the mixed `shuffle-variant` falls back to the glyph)

**Checkpoint**: US2 works: one icon everywhere.

## Phase 5: Polish & Cross-Cutting

- [ ] T013 Bump version to 1.7.0 / versionCode 8 in `app.json` and `package.json` (and `package-lock.json` root entry)
- [ ] T014 Run `npm run typecheck`, `npm run lint`, `npm test`; fix any failure
- [ ] T015 Run `graphify update .` to refresh the knowledge graph

## Dependencies & Execution Order

- T001 → T002 → T003; T001 → T006
- US1 (T004–T007) needs T002; US2 (T008–T012) needs T002 and is independent of US1
- T013–T015 after both stories

## Parallel Example

```text
After T002: T003, T007, T008, T009, T010, T011, T012 touch different files and can run in parallel.
```

## Implementation Strategy

MVP = Phase 2 + US1 (Home and full back show the toast). US2 completes the identity across screens;
both ship together in 1.7.0.
