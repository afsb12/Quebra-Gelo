# Research: Início em Grade de 3 Colunas

## R1. Tile size

- **Decision**: `miniWidth = (screenWidth − 2×24 − 2×12) / 3` (106 pt at 390 pt), height by the 5:7 ratio.
- **Rationale**: canvas layout; at 390×844 two full rows (6 tiles) sit under the hero (SC-001). The
  mini back title is 12% of the width (≈ 13 pt) in the display font, still legible.
- **Alternatives**: 2 columns with a shorter ratio (breaks the card identity); horizontal carousel
  (hides decks).

## R2. Chip text

- **Decision**: `strings.mixFilter.chip(active, total)` → "10 categorias" or "8 de 10 categorias";
  HomeScreen always passes it; the existing `summary` testID moves to the chip label.
- **Rationale**: one control shows the state and opens the filter (SC-003).

## R3. Hero press targets

- **Decision**: the hero stays one `Pressable` (starts the mix); "Jogar" is a non-interactive pill
  inside it; the chip is the nested `Pressable` (already the pattern since 006).
- **Rationale**: largest target for the main action; no nested-button ambiguity for screen readers
  beyond the existing filter button.

## R4. Brand row vs. header

- **Decision**: brand name is plain text; the question carries `accessibilityRole="header"`.
