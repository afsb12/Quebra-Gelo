# Implementation Plan: Fim do Baralho com Sugestões

**Branch**: `018-deck-complete-suggestions` | **Date**: 2026-11-11 | **Spec**: [spec.md](./spec.md)

## Summary

A pure `getNextCategories(id, count = 2)` in `src/data/content.ts` returns the categories after `id`
in content order, wrapping. `DeckComplete` is redrawn as a full-width column: a decorative fan of
three face-down cards (deck color, icon on the front one; neutral in the mix), the title and
message, a cream "Embaralhar de novo" button, an optional "Que tal continuar com" section with two
suggestion buttons (mini back + name), and a "Ver todos os baralhos" text button. `DeckScreen`
passes the suggestions for category decks only and opens a suggestion with `router.replace`.

## Technical Context

**Language/Version**: TypeScript 6 strict, React 19 / RN 0.88
**Primary Dependencies**: NativeWind 4, Expo Router
**Storage**: none · **Testing**: Jest + RNTL 14 · **Target**: Android + iOS · **Type**: mobile app
**Constraints**: UI dumb (suggestions come in as props); strings centralized
**Scale/Scope**: content.ts, DeckComplete, DeckScreen, strings, tests

## Constitution Check

| Principle / rule | Status | Notes |
|---|---|---|
| I. Zero Fricção | ✅ | Next deck in 1 tap from the end screen |
| II. Imersão Tátil | ✅ | Static screen; no gesture changes |
| III. Tipagem Estrita | ✅ | Typed suggestion props |
| IV. Arquitetura Limpa | ✅ | Rule in Data (pure function); DeckComplete renders props |
| Stack (NativeWind) | ✅ | DeckComplete stays NativeWind (dynamic transforms via `style`) |
| Jogo: no order required between categories | ✅ | Suggestions are optional shortcuts |
| 004 hidden backs | ✅ | Mix: no suggestions, neutral fan |
| Qualidade gates | ✅ | typecheck, lint, test |

**Post-design re-check**: all ✅.

## Project Structure

```text
src/data/content.ts             # getNextCategories
src/components/DeckComplete.tsx # fan, actions, suggestions
src/screens/DeckScreen.tsx      # suggestions + onSuggest
src/i18n/strings.ts             # deckComplete.suggestions, chooseAnother → "Ver todos os baralhos", suggestionLabel
tests: content (deck ids), Consistency, DeckScreen
```

## Complexity Tracking

None.
