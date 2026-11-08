# Implementation Plan: Nova Categoria "Primeiros Encontros"

**Branch**: `007-first-dates-category` | **Date**: 2026-11-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-first-dates-category/spec.md`

## Summary

Add a 9th category, `primeiros-encontros` ("Primeiros Encontros", `#FF8A80`, icon `glass-flute`),
with 20 original, date-safe questions, placed right after `casual` ("Descontraído"). This is a
**content + registry** change: the category ID joins the `CATEGORY_IDS` tuple at index 1, the
category and its questions join `data.json` at the same position, the front-of-card ink joins
`CATEGORY_INK`, and the tests that pin the palette, order or "8 categories" are updated. Home,
Deck, Favorites, mixed mode and the mix filter already read categories from data, so they pick the
new one up with no logic changes; `sanitizeExcluded` (006) already keeps unknown-at-save-time
categories **on**, which satisfies FR-012 for free. A new content test enforces the topic and
tone rules of FR-006/FR-007 with a forbidden-term list (research R4).

## Technical Context

**Language/Version**: TypeScript 6 (`strict`), React 19 / React Native 0.88

**Primary Dependencies**: Expo SDK 58 (Managed), `@expo/vector-icons` (MaterialCommunityIcons),
NativeWind 4, Zustand (+ `persist`), Reanimated 4 / Gesture Handler 3 (untouched)

**Storage**: bundled `src/data/data.json` (content); AsyncStorage only for favorites and the mix
filter (formats unchanged)

**Testing**: Jest + RNTL 14 (`npm test`), content validation in `src/data/__tests__/content.test.ts`

**Target Platform**: Android and iOS via Expo Go / local builds

**Project Type**: mobile-app (single Expo project)

**Performance Goals**: unchanged; +20 questions (160 → 180) is negligible for parsing and shuffling

**Constraints**: offline, no new dependencies, no new persisted keys, no migration

**Scale/Scope**: 1 category, 20 questions, ~6 source files touched, ~7 test files updated

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / rule | Status | Notes |
|---|---|---|
| I. Zero Fricção (≤ 2 taps, offline, no data) | ✅ | One more tile on Home, visible without scrolling (2nd position); content bundled; nothing collected |
| II. Imersão Tátil | ✅ | Gestures, haptics and reduced motion untouched; the new deck reuses `SwipeCard` |
| III. Tipagem Estrita | ✅ | New ID enters the `CATEGORY_IDS` tuple, so `CategoryId`, `Record<CategoryId, …>` (ink) and guards cover it at compile time |
| IV. Arquitetura Limpa | ✅ | Change confined to Data (`types.ts`, `data.json`) and theme (`categoryVisual.ts`); no UI/screen logic changes |
| Stack (Managed, NativeWind, Zustand) | ✅ | No new packages, no new stores |
| Jogo: categories with name, description, own visual identity | ✅ | Title, description, color, icon and ink; coral chosen over the requested `#FF9F43` to stay distinct from Happy Hour (R2) |
| Jogo: no repeat until all cards shown; skip any card | ✅ | Existing deck logic, generic over categories |
| Conteúdo: original, pt-BR, inclusive, no assumptions (gender, orientation, religion, marital status, finances, family) | ✅ | Questions written for this feature (R3); forbidden-topic test (R4); manual review in quickstart |
| Conteúdo: original vs. `Assets/` references | ✅ | Questions written from scratch, not taken from the reference games |
| Conteúdo: AA contrast | ✅ | Back: dark text on `#FF8A80` = 7.56:1; front ink `#D71100` on cream = 4.67:1 |
| Conteúdo validated by test | ✅ | Existing suite + updated palette + new tone test |
| Qualidade gates | ✅ | quickstart |

**Post-design re-check**: all ✅, no violations.

## Project Structure

### Documentation (this feature)

```text
specs/007-first-dates-category/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   └── content.md       # Category entry, question rules, order contract
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── data/
│   ├── types.ts                     # CATEGORY_IDS: insert 'primeiros-encontros' at index 1
│   ├── data.json                    # category at index 1 + primeiros-encontros-001…
│   └── __tests__/
│       ├── content.test.ts          # PALETTE + names "9"; new tone/forbidden-topic test
│       └── deckIds.test.ts          # test names "8" → generic
├── theme/
│   ├── categoryVisual.ts            # CATEGORY_INK['primeiros-encontros'] = '#D71100'
│   └── __tests__/categoryVisual.test.ts   # TABLE row
├── components/
│   ├── MixedHeroCard.tsx            # doc comment example "6 de 8" → "7 de 9"
│   └── __tests__/
│       ├── MixFilterSheet.test.tsx  # test name "8" → generic
│       └── MixedHeroCard.test.tsx   # summary fixture "6 de 8" → "7 de 9" (cosmetic)
└── screens/__tests__/
    └── HomeScreen.test.tsx          # 9 tiles, order, "7 de 9 categorias"
```

**Structure Decision**: single Expo project (existing layout). No new modules.

## Complexity Tracking

No violations.
