# Implementation Plan: Início em Grade de 3 Colunas

**Branch**: `015-home-grid-redesign` | **Date**: 2026-11-11 | **Spec**: [spec.md](./spec.md)

## Summary

Home gets the canvas layout: a brand row (`BrandSymbol` 28 + "Quebra-Gelo") next to Favoritos, the
header question "Sobre o que vamos conversar?", a reworked `MixedHeroCard` (inline "Jogar" pill in
the accent color + a text chip that opens the filter and always shows the mix count), the label
"Ou escolha um baralho", and a 3-column grid of bare card backs (`MiniCard` without the name and
description below; both stay in its accessibility label). `getCardGeometry().miniWidth` switches to
3 columns with a 12 pt gap from new layout tokens.

## Technical Context

**Language/Version**: TypeScript 6 (`strict`), React 19 / React Native 0.88
**Primary Dependencies**: Expo SDK 58, NativeWind 4, `react-native-svg` (BrandSymbol), Zustand
(mix filter store, unchanged)
**Storage**: none new
**Testing**: Jest + RNTL 14
**Target Platform**: Android + iOS
**Project Type**: mobile app
**Performance Goals**: no change (static layout)
**Constraints**: ≤ 2 taps to the first card; strings centralized; UI components props-only
**Scale/Scope**: HomeScreen, MiniCard, MixedHeroCard, geometry/tokens, strings, their tests

## Constitution Check

| Principle / rule | Status | Notes |
|---|---|---|
| I. Zero Fricção (≤ 2 taps, offline) | ✅ | Category deck 1 tap, mixed 1 tap; nothing new loaded |
| II. Imersão Tátil | ✅ | Card gestures untouched |
| III. Tipagem Estrita | ✅ | New props typed; no `any` |
| IV. Arquitetura Limpa | ✅ | Screen computes the chip text from the store; components stay dumb |
| Stack (NativeWind, no mixing in one component) | ✅ | Home/MiniCard/MixedHeroCard stay NativeWind |
| Jogo: categories with own visual identity | ✅ | Backs unchanged, only smaller |
| UI strings centralized | ✅ | New keys in `strings.ts` |
| Acessibilidade (≥ 44 pt targets, labels) | ✅ | Chip 44 pt tall hit area; tile label "<nome>. <descrição>" |
| Qualidade gates | ✅ | typecheck, lint, test |

**Post-design re-check**: all ✅.

## Project Structure

```text
src/theme/tokens.ts            # layout.homeColumns = 3, layout.homeGridGap = 12
src/theme/geometry.ts          # miniWidth for 3 columns
src/i18n/strings.ts            # home.question, home.decksLabel, mixed.play, mixFilter.chip()
src/components/MiniCard.tsx    # back only
src/components/MixedHeroCard.tsx  # Jogar pill + filter chip (label prop)
src/screens/HomeScreen.tsx     # brand row, question header, label, 3-col grid
tests: geometry, MiniCard, MixedHeroCard, HomeScreen
```

## Complexity Tracking

None.
