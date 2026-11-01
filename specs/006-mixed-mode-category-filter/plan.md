# Implementation Plan: Seleção de Categorias no Modo "Tudo Misturado"

**Branch**: `006-mixed-mode-category-filter` | **Date**: 2026-11-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-mixed-mode-category-filter/spec.md`

## Summary

Lets players pick which categories feed the "Tudo Misturado" deck (004):

1. **Data (pure)**: `src/data/mixFilter.ts` — `MIN_MIX_CATEGORIES = 2`, `activeMixCategories`,
   `isValidMixSelection`, `sanitizeExcluded`, `sameSelection`. `getDeckQuestionIds('mixed', ids)`
   keeps only questions of the given categories.
2. **Store**: `useMixFilterStore` (Zustand + `persist`, key `quebra-gelo/mix-filter`) stores the
   **excluded** category IDs, so categories added in a future update are on by default (FR-014).
   `save(active)` rejects < 2, and when the set changes it calls
   `useProgressStore.getState().resetDeck('mixed')` (FR-010). Invalid/unreadable data → all on.
3. **Deck**: `useDeck('mixed')` passes the active categories to `ensureDeck`/`reshuffle`, so the
   shuffled deck only has their questions (existing Fisher–Yates `createDeck`).
4. **UI**: `MixedHeroCard` gets a funnel button (`filter-variant`, ice blue `#9ED8F0`, top right,
   own press target) and an optional "X de 8 categorias" summary. A new `MixFilterSheet` (RN
   `Modal` sliding from the bottom, no new dependency) lists the 8 categories with `Switch`es, the
   minimum message and a "Salvar" button, all controlled by `HomeScreen` (draft state + validity).
5. **No flicker**: the splash also waits for the filter store to hydrate.

## Technical Context

**Language/Version**: TypeScript 6 (strict)

**Primary Dependencies**: no new ones (RN `Modal` + `Switch`, Zustand `persist`, AsyncStorage, `@expo/vector-icons`)

**Storage**: AsyncStorage key `quebra-gelo/mix-filter` → `{ state: { excluded: CategoryId[] }, version: 1 }`

**Testing**: Jest + RNTL 14: pure `mixFilter` tests; store tests (default, save, reject < 2,
reset on change, rehydrate/sanitize); `getDeckQuestionIds` with categories; `useDeck` with a
filter; component tests for `MixFilterSheet` and the hero button; Home + Deck integration

**Target Platform**: Android and iOS phones (≥ 320 pt), portrait

**Project Type**: mobile-app (single Expo project)

**Performance Goals**: filtering is O(questions) once per new deck; sheet opens instantly

**Constraints**: offline; minimum 2 categories everywhere; face-down cards still reveal nothing (004)

**Scale/Scope**: 8 categories; 2 new modules in data/store, 1 new component, 3 touched; ~6 test files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / rule | Status | Notes |
|---|---|---|
| I. Zero Fricção (≤ 2 taps to first card, offline, no data collection) | ✅ | Hero tap still = first card; filter is optional; only category IDs stored locally |
| II. Imersão Tátil | ✅ | Card gestures untouched; sheet slide is native and `none` under reduced motion |
| III. Tipagem Estrita | ✅ | Persisted data narrowed from `unknown` (`sanitizeExcluded`); typed props/state |
| IV. Arquitetura Limpa | ✅ | Rules (min 2, sanitize, set equality, filtering) are pure in `src/data`; AsyncStorage only in `src/store`; sheet/hero are controlled by props; Home wires |
| Stack: Zustand `persist` for data that survives restarts | ✅ | Same pattern as favorites |
| Stack: NativeWind default; StyleSheet only in animated components | ✅ | Sheet and hero use NativeWind |
| Jogo: no repeat until all cards of the **selected** categories shown | ✅ | Deck built from the filter; reset on change |
| Conteúdo: centralized strings, a11y labels/states, AA contrast | ✅ | `strings.mixFilter`; `Switch` with labels; ice blue on `#16131C` ≫ 4.5:1 |
| Qualidade gates | ✅ | quickstart |

**Post-design re-check**: all ✅, no violations.

## Project Structure

### Documentation (this feature)

```text
specs/006-mixed-mode-category-filter/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/ui-components.md
└── tasks.md
```

### Source Code

```text
src/
├── data/
│   ├── mixFilter.ts              # NEW: pure rules
│   └── content.ts                # getDeckQuestionIds(deckId, mixCategories?)
├── store/
│   ├── mixFilter.ts              # NEW: persisted excluded IDs, save, hydration hooks
│   └── progress.ts               # ensureDeck/reshuffle(deckId, mixCategories?), resetDeck
├── hooks/useDeck.ts              # passes the filter for 'mixed'
├── components/
│   ├── MixFilterSheet.tsx        # NEW
│   └── MixedHeroCard.tsx         # + onOpenFilter, summary
├── screens/HomeScreen.tsx        # sheet state, save
├── app/_layout.tsx               # splash waits for the filter
├── theme/tokens.json             # + iceBlue
├── tailwind.config.js            # + ice color
└── i18n/strings.ts               # + mixFilter strings
```

**Structure Decision**: existing three-layer layout.

## Complexity Tracking

No constitution violations to justify.
