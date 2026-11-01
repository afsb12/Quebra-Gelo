# Research: Identidade Visual das Cartas por Categoria

Phase 0 output for [plan.md](./plan.md). Builds on the 001 design
([001 research](../001-icebreaker-cards-mvp/research.md)); items marked **Amends 001** change a
decision recorded there.

## R1. Category palette (exact tones)

- **Decision**: fixed palette below. `color` is the back background (stored in `data.json`, as in
  001); `onColor` is the text/icon color on the back; `ink` is the category color used on the
  cream front (frame, icon, footer). App background `#16131C`, cream `#F7F0E3`, question text
  `#22202A`.

| Category | Family | `color` (back) | `onColor` | contrast | `ink` (on cream) | contrast |
|---|---|---|---|---|---|---|
| casual | amarelo-sol | `#F5C230` | dark `#1B1A22` | 10.38 | `#8A6100` | 4.89 |
| profundo | azul-índigo | `#3D3FA6` | white | 8.54 | `#3D3FA6` | 7.53 |
| casais | vermelho-carmim | `#C41E3A` | white | 5.84 | `#B01A34` | 6.09 |
| happy-hour | laranja | `#F27A1F` | dark `#1B1A22` | 6.23 | `#A84F00` | 4.90 |
| dilemas | roxo | `#7A3EB1` | white | 6.66 | `#6E35A3` | 6.86 |
| viagens | turquesa | `#14A39E` | dark `#1B1A22` | 5.55 | `#0B6B67` | 5.59 |
| nostalgia | rosa | `#F28CB4` | dark `#1B1A22` | 7.55 | `#A6316B` | 5.66 |
| futuro | verde-esmeralda | `#167A4C` | white | 5.35 | `#167A4C` | 4.72 |

  Question text `#22202A` on cream: 14.16. All values were computed with the WCAG 2.1 relative
  luminance formula; every pair meets FR-012 (≥ 4.5:1, so icons ≥ 3:1 too).
- **Separation from the dark app background (FR-002)**: dark tones (profundo, dilemas, futuro,
  casais) have only 2.1–3.4:1 against `#16131C`, so the card's light frame (FR-004, cream
  `#F7F0E3`, ≈ 16:1 against the app background) is what outlines every card and mini card.
- **Rationale**: tones are from the clarified families, spread around the color wheel (yellow,
  orange, red, pink, purple, indigo, teal, green) so neighbors in the grid never look alike.
- **How onColor/ink are kept honest**: they are derived by pure functions (`pickOnColor`,
  `inkOnCream`) from `color`, and a unit test asserts the table's ratios. Only `color` is stored in
  content (no duplicated tokens).
- **Alternatives considered**: storing `onColor`/`ink` in `data.json` (duplicates visual tokens in
  content); white text on all backs (fails for yellow, orange, pink and teal).

## R2. Geometric back patterns

- **Decision**: draw patterns as vectors with `react-native-svg` (Expo SDK module, works in Expo
  Go). Each category maps to one pattern kind, drawn tone-on-tone (`onColor` at 10–14% opacity) on
  the back:

| Category | Pattern |
|---|---|
| casual | dot grid (polka) |
| profundo | concentric circles from one corner |
| casais | diamond lattice |
| happy-hour | scattered circles of three sizes ("bubbles", geometric only) |
| dilemas | checkerboard of half-tone squares |
| viagens | horizontal waves |
| nostalgia | diagonal stripes |
| futuro | chevrons pointing up |

  Patterns are generated from parameters (spacing, size, stroke) inside a `viewBox` sized to the
  card ratio, so one component renders both the full card and the mini card. Shapes are computed
  once per category and size (`useMemo`) — nothing animates (reduced-motion edge case).
- **Rationale**: FR-007 (geometric, tone-on-tone, unique per category), crisp at any density,
  zero image assets, fully original (FR-015).
- **Alternatives considered**: PNG/WebP pattern images (assets per density, blurry when scaled);
  drawing with plain `View`s (too many views for dense patterns); Skia (heavier dependency, not
  needed for static vector art).

## R3. Paper texture and vignette

- **Decision**: no bitmap texture. Each face gets an SVG `RadialGradient` overlay: center
  transparent → edges ~8% darker (back) / ~5% warm darker (cream front), giving a printed-paper
  feel. Text sits in the center, where the overlay is transparent, so contrast numbers in R1 hold.
- **Rationale**: FR-006 asks for subtle texture/vignette without hurting contrast; a gradient is
  resolution-independent and costs nothing.
- **Alternatives considered**: noise texture image (asset weight, moiré on some screens).

## R4. Typography — **Amends 001** (system fonts → bundled fonts)

- **Decision**: **Outfit** (SIL Open Font License) as the single family, loaded from
  `@expo-google-fonts/outfit` with `expo-font`; fonts ship inside the app bundle (offline from
  first launch). Weights: `Outfit_800ExtraBold` (category names, titles), `Outfit_600SemiBold`
  (question text), `Outfit_400Regular` (descriptions, footers, UI). The splash screen stays up
  (`expo-splash-screen`) until fonts and the favorites store are ready, so text never flashes in a
  fallback font.
- **Rationale**: clarification chose custom fonts everywhere. Outfit is geometric (matches the
  minimalist geometric style), has full Latin Extended coverage (all Portuguese accents), and
  stays legible at 20pt+. It is not the typeface of any reference game (those use a condensed
  grotesque, a slab serif, a humanist sans and a rounded sans) — FR-015.
- **Alternatives considered**: two families (e.g., a display face + a text face — more weight and
  pairing risk for little gain); downloading fonts at runtime (breaks offline, Principle I).

## R5. Question text sizing and system font scale

- **Decision**: base size by length: ≤ 120 chars → 26pt, 121–160 → 23pt, 161–200 → 21pt (all ≥
  FR-009 minimums). Text keeps `allowFontScaling` (FR-011b). The card text area uses
  `adjustsFontSizeToFit` with `minimumFontScale` computed so the rendered size never drops below
  20pt; when the system font scale is large, the card first grows up to the available height
  (FR-005 bounds) before shrinking text. A test renders the longest question of every category at
  font scale 1.0 on a 320×568 viewport and asserts no truncation (SC-003) via the fit helper.
- **Rationale**: FR-009, FR-011b and the "fonte aumentada" edge case.
- **Alternatives considered**: fixed size (fails long questions on small phones); disabling font
  scaling on the card (violates FR-011b).

## R6. Card geometry

- **Decision**: ratio 5:7. Card width = `min(screenWidth − 48, 360)`; height = width × 7/5, capped
  by the space left after header and favorite button (then width is recomputed from height).
  Corner radius = 6% of width; outer cream frame 6pt (back) — on the front, an inner `ink` frame
  1.5pt inset 10pt. Shadow: elevation 8 (Android) / opacity 0.35, radius 16 (iOS).
  Mini cards use the same component at width = (screenWidth − 48 − 16) / 2 (2 columns on 320pt,
  FR-014), with name and description below as normal text.
- **Rationale**: FR-004, FR-005, FR-014; a single geometry helper keeps card and mini card
  identical.

## R7. Icons

- **Decision**: `MaterialCommunityIcons` from `@expo/vector-icons` (bundled). Names: casual
  `emoticon-happy-outline`, profundo `lightbulb-on-outline`, casais `heart-outline`, happy-hour
  `glass-cocktail`, dilemas `scale-balance`, viagens `airplane`, nostalgia `teddy-bear`, futuro
  `rocket-launch-outline`. The content test from 001 already asserts every `icon` exists in the
  glyph map.
- **Rationale**: FR-003 (distinct, thematic), already planned in 001 R10, no new dependency.

## R8. Front layout and favorite indicator

- **Decision**: front layout top→bottom inside the inner frame: icon (top-left, 28pt, `ink`) and
  favorite star indicator (top-right, 22pt, `ink`, only when favorited); question block (centered
  vertically, left-aligned, `#22202A`); footer (category name, 13pt uppercase letter-spaced,
  `ink`). Top and bottom rows reserve fixed height so the indicator never overlaps text (FR-011).
- **Back layout**: pattern fills the face; large icon (≈ 30% of width) centered in the upper half;
  category name in `Outfit_800ExtraBold`, uppercase, broken into lines by word, centered in the
  lower half, in `onColor`.
- **Rationale**: FR-007–FR-011; mirrors the generic reference patterns (icon in corner, footer
  label, big bold name on the back).

## R9. Testing visual rules

- **Decision**: unit tests for `pickOnColor`, `inkOnCream`, `contrastRatio` and the palette
  table (SC-002); unit test that the 8 pattern kinds are distinct and every `CategoryId` has one
  (typed `Record` enforces completeness at compile time); component tests asserting `CardBack`
  renders name + icon and never question text (FR-008), `CardFront` renders footer + indicator
  only when favorited; text-fit test (R5). Visual comparisons and user tests (SC-001, SC-004,
  SC-005, SC-006) are manual — see [quickstart.md](./quickstart.md).
