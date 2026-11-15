# Research: Respiro e Margens do Card "Tudo Misturado" (019)

## R1 — Where the spacing values live

- **Decision**: one exported `HERO_LAYOUT` constant in `MixedHeroCard.tsx`
  (`marginTop 16, marginBottom 24, padding 20, gap 8, filterInset 14, filterHitSlop 10, titleReserve 36,
  filterSize 36`). HomeScreen reads the margins from it.
- **Rationale**: FR-009 (no loose numbers); the values are specific to this card, so they are not
  global design tokens (spec Assumptions).
- **Alternatives**: `tokens.json` (rejected: not shared with Tailwind or any other component).

## R2 — Card height with a 20 pt padding

- **Decision**: `heroHeight(width, fontScale) = max(round(width × 0.42), round(176 × clamp(fontScale, 1, 1.3)))`.
  176 = 2 × 20 (padding) + title 32 + 8 + two description lines 40 + 8 + pill row 36 + the half frame
  (≈ 12).
- **Rationale**: with the old fixed ratio, a 272 pt wide card (320 pt screen) was 114 pt tall: no room
  for 40 pt of padding plus three rows. The floor keeps the content uncut; large font scales grow it.
- **Alternatives**: measuring with `onLayout` (rejected: two renders and a jump on first paint).

## R3 — The filter button

- **Decision**: an icon-only round button (36 pt, outlined, `cog-outline` in ice blue), absolutely
  positioned at `top: 14, right: 14` from the card's outer edges, `hitSlop` 10 on each side (56 pt
  effective target). It stays a nested `Pressable`, so it takes the touch and never starts the game.
  The summary ("10 categorias" / "8 de 10 categorias") becomes plain text beside "Jogar".
- **Rationale**: spec Clarifications; the 015 rule that the summary is always visible; the corner is
  ≥ 60 pt from the "Jogar" pill, removing the mis-taps of the side-by-side chips.
- **Alternatives**: keeping the chip with the label in the corner (rejected: it would collide with
  the title on 320 pt screens, defeating FR-006).

## R4 — Lateral alignment

- **Decision**: the card keeps `width = window.width − 2 × screenPadding` and lives in the same
  `ScrollView` padding as the grid; the grid's width is `3 × miniWidth + 2 × gap` = the same value
  (geometry 015). So the margin is identical by construction (horizontal margin 0 on the card).
- **Rationale**: FR-002 / SC-002; a test asserts the card width equals the grid's content width.
