# Implementation Plan: Modo "Tudo Misturado" com Verso Oculto e Etiqueta de Categoria

**Branch**: `004-mixed-mode-hidden-backs` | **Date**: 2026-11-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-mixed-mode-hidden-backs/spec.md`

## Summary

Adds a ninth deck, **"Tudo Misturado"**, that shuffles every question of every category into one
in-memory deck, and gives it a neutral brand identity:

1. **Data**: a `DeckId = CategoryId | 'mixed'` key generalizes the progress store, `useDeck` and the
   deck route (`/deck/[deckId]`). `getDeckQuestionIds('mixed')` returns all question IDs; the
   existing Fisher–Yates `createDeck` shuffles them. `useDeck` now also exposes the category of the
   *current question* so the screen can show its origin after the flip.
2. **Hidden back**: a new `BrandCardBack` (cream frame, `appBackground` face, the app symbol from
   003 drawn with `react-native-svg`, no text) replaces the category back in mixed mode. The
   face-down accessibility label and the deck header never mention the category.
3. **Revealed front**: `CardFront` gains an optional `CategoryBadge` (pill in the category `color`
   with its `icon` + title in `onColor`) centered in the top row, between the existing corner icon
   and the favorite star. Everything else on the front stays as is (clarifications Q1/Q2).
4. **Home**: a full-width `MixedHeroCard` above the 8-category grid (clarification Q3), drawn with
   the same brand back in a horizontal `wide` variant plus the mode name.

## Technical Context

**Language/Version**: TypeScript 6 (strict)

**Primary Dependencies**: no new ones. Expo SDK 58, React Native 0.88, expo-router, Zustand 5,
Reanimated 4 + Gesture Handler 3 (unchanged `SwipeCard` physics), `react-native-svg` (symbol),
`@expo/vector-icons` (badge icon), NativeWind 4

**Storage**: none new. Mixed-deck progress is in memory (Zustand, no `persist`), like the others

**Testing**: Jest (`jest-expo`) + RNTL 14: pure tests for deck IDs/question lists and the progress
store; component tests for `BrandCardBack`, `CategoryBadge`/`CardFront`, `MixedHeroCard`; screen
tests for `DeckScreen` (mixed) and `HomeScreen`; a consistency test that the in-app symbol matches
`scripts/icon/symbol.ts`

**Target Platform**: Android and iOS phones (≥ 320 pt wide), portrait

**Project Type**: mobile-app (single Expo project)

**Performance Goals**: 60 fps flip/swipe (constitution II). The brand back is 4 SVG nodes (less
than the category back's icon font + vignette), the badge is one `View` + icon + `Text`

**Constraints**: offline; no category information on the face-down card through any channel
(visual, header, accessibility); badge never overlaps the question, corner icon or star; WCAG AA
contrast for the badge text

**Scale/Scope**: 8 categories, ~all bundled questions in one deck; ~6 source files changed, 4 new
components, 1 route renamed; ~8 test files added/updated

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / rule | Status | Notes |
|---|---|---|
| I. Zero Fricção (≤ 2 taps to first card, offline, no data collection) | ✅ | Home → hero card = 1 tap; bundled content only |
| II. Imersão Tátil (gesture physics, UI thread, haptics on flip/discard, reduced motion) | ✅ | `SwipeCard` animation code untouched; only the face content is parameterized |
| III. Tipagem Estrita | ✅ | `DeckId` union + `isDeckId` guard for the route param; all new props typed and exported |
| IV. Arquitetura Limpa | ✅ | Deck composition in `src/data` (pure), store keyed by `DeckId`; `BrandCardBack`, `CategoryBadge`, `MixedHeroCard` are prop-driven UI; `DeckScreen`/`HomeScreen` wire them |
| Stack: NativeWind default; StyleSheet in animated card faces, never mixed in one component | ✅ | `BrandCardBack`, `BrandSymbol`, `CategoryBadge` (inside `CardFront`) use StyleSheet; `MixedHeroCard` uses NativeWind for its text and only embeds `BrandCardBack` |
| Stack: new dependencies justified | ✅ | None |
| Jogo: one card at a time; no repeat until all selected categories shown; skip allowed | ✅ | Mixed deck reuses `createDeck`/`advance`; test walks the whole deck |
| Jogo: each category keeps its own identity | ✅ | Badge uses the category's bundled `icon` + `color` |
| Conteúdo: UI strings centralized (pt-BR); a11y labels; AA contrast | ✅ | New `strings.mixed`/`strings.card.*` entries; badge uses the already-validated `color`/`onColor` pair |
| Qualidade: gates typecheck, lint, tests, content validation | ✅ | See quickstart |

**Post-design re-check (after Phase 1)**: all ✅, no violations, nothing in Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/004-mixed-mode-hidden-backs/
├── plan.md              # This file
├── research.md          # Phase 0: R1–R7
├── data-model.md        # Phase 1: DeckId, progress, deck info
├── quickstart.md        # Phase 1: validation guide
├── contracts/
│   └── ui-components.md # Phase 1: props of the new/changed components and route
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── deck/[deckId].tsx         # renamed from [categoryId].tsx; accepts 'mixed'
├── data/
│   ├── types.ts                  # + MIXED_DECK_ID, DeckId
│   └── content.ts                # + isDeckId, getAllQuestions, getDeckQuestionIds
├── store/
│   └── progress.ts               # keyed by DeckId
├── hooks/
│   └── useDeck.ts                # DeckId; + title, deckCategory, currentCategory
├── components/
│   ├── BrandSymbol.tsx           # NEW: app symbol (SVG), no text
│   ├── BrandCardBack.tsx         # NEW: neutral back (full | mini | wide)
│   ├── CategoryBadge.tsx         # NEW: icon + title pill in the category color
│   ├── MixedHeroCard.tsx         # NEW: Home entry for "Tudo Misturado"
│   ├── CardFront.tsx             # + showOriginBadge
│   ├── SwipeCard.tsx             # + mode ('category' | 'mixed') → back + labels + badge
│   └── DeckComplete.tsx          # takes deck title + colors instead of a Category
├── screens/
│   ├── DeckScreen.tsx            # DeckId; mixed header/visuals
│   └── HomeScreen.tsx            # hero card above the grid
├── theme/
│   └── brand.ts                  # NEW: BRAND_SYMBOL params + MIXED_VISUAL
└── i18n/strings.ts               # + mixed strings

src/**/__tests__/                 # tests per quickstart
```

**Structure Decision**: single Expo project, existing three-layer layout. No new folders.

## Complexity Tracking

No constitution violations to justify.
