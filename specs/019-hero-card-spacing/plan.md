# Implementation Plan: Respiro e Margens do Card "Tudo Misturado"

**Branch**: `019-hero-card-spacing` | **Date**: 2026-11-15 | **Spec**: [spec.md](./spec.md)

## Summary

`MixedHeroCard` exports a `HERO_LAYOUT` constant with every spacing value of the spec (margins 16/24,
padding 20, gap 8, filter inset 14, hit slop 10, title reserve 36). The card content becomes a row
(symbol · text column, gap 8) inside a 20 pt padding; the text column stacks title (with 36 pt right
reserve), description and a row with the "Jogar" pill and the mix summary text, all gap 8. The
filter becomes an icon-only round button (`cog-outline`) absolutely positioned 14 pt from the card's
top/right edges, with a 10 pt hit slop on each side. The card height gets a floor that fits the
padded content (`heroHeight`, scaled by the font scale). `HomeScreen` wraps the card with the
16/24 margins (dropping the header's bottom padding) and keeps it in the same horizontal padding as
the grid, so the edges match.

## Technical Context

**Language/Version**: TypeScript 6 strict, React 19 / RN 0.88
**Primary Dependencies**: NativeWind 4, @expo/vector-icons (MaterialCommunityIcons)
**Storage**: none · **Testing**: Jest + RNTL 14 · **Target**: Android + iOS (≥ 320 pt) · **Type**: mobile app
**Constraints**: UI dumb (props only); no new tokens; strings centralized
**Scale/Scope**: MixedHeroCard, HomeScreen, tests

## Constitution Check

| Principle / rule | Status | Notes |
|---|---|---|
| I. Zero Fricção | ✅ | Still 1 tap from Home to the mixed deck; filter mis-taps reduced |
| II. Imersão Tátil | ✅ | No gesture/animation change |
| III. Tipagem Estrita | ✅ | `HERO_LAYOUT` is `as const`; `heroHeight` typed |
| IV. Arquitetura Limpa | ✅ | MixedHeroCard stays props-only; HomeScreen only places it |
| Stack (NativeWind, no mixing) | ✅ | NativeWind classes + dynamic values via `style` (as before, same as 015) |
| Acessibilidade | ✅ | Filter button keeps its label with the summary; hit area 56 pt (36 + 2×10) |
| 015 resumo sempre visível | ✅ | Summary moves next to "Jogar" as text |
| Qualidade gates | ✅ | typecheck, lint, test |

**Post-design re-check**: all ✅.

## Project Structure

```text
src/components/MixedHeroCard.tsx   # HERO_LAYOUT, heroHeight, corner filter button, padded layout
src/screens/HomeScreen.tsx         # 16/24 margins around the card, header padding
tests: MixedHeroCard.test.tsx, HomeScreen.test.tsx
```

See [research.md](./research.md), [contracts/mixed-hero-card.md](./contracts/mixed-hero-card.md),
[quickstart.md](./quickstart.md). No data model (layout only).

## Complexity Tracking

None.
