# Implementation Plan: Nova Categoria "Família"

**Branch**: `013-family-category` | **Date**: 2026-11-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/013-family-category/spec.md`

## Summary

Add a 10th category, `familia` ("Família", back `#27AE60`, icon `home-heart`), with 30 original,
all-ages, structure-neutral family questions, placed right after `nostalgia` and before `futuro`.
Like 007 this is a **content + registry** change: the ID joins `CATEGORY_IDS` at index 8, the
category and its questions join `data.json` at the same position, a hand-picked front ink
`#007A15` joins `CATEGORY_INK` (the automatic ink would be a near-copy of Futuro's, R2), and the
tests that pin the palette, order or "9 categories" are updated. Home, Deck, Favorites, mixed mode
and the mix filter already read categories from data; `sanitizeExcluded` (006) keeps a new
category **on** for saved filters (FR-013) with no migration. Two new content tests guard the
feature: a family-safe/structure-neutral term guard (R4) and a "Família is distinct from every
other category on both faces" color test (R2).

## Technical Context

**Language/Version**: TypeScript 6 (`strict`), React 19 / React Native 0.88

**Primary Dependencies**: Expo SDK 58 (Managed), `@expo/vector-icons` (MaterialCommunityIcons),
NativeWind 4, Zustand (+ `persist`), Reanimated 4 / Gesture Handler 3 (untouched)

**Storage**: bundled `src/data/data.json` (content); AsyncStorage only for favorites and the mix
filter (formats unchanged)

**Testing**: Jest + RNTL 14 (`npm test`); content validation in
`src/data/__tests__/content.test.ts`; palette in `src/theme/__tests__/categoryVisual.test.ts`

**Target Platform**: Android and iOS via Expo Go / local release builds

**Project Type**: mobile-app (single Expo project)

**Performance Goals**: unchanged; +30 questions (270 → 300) is negligible for parsing and shuffling

**Constraints**: offline, no new dependencies, no new persisted keys, no migration, description
≤ 80 chars, front ink ≥ 4.5:1 on cream

**Scale/Scope**: 1 category, 30 questions, 3 source files (`types.ts`, `data.json`,
`categoryVisual.ts`), 1 doc comment, ~4 test files updated

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / rule | Status | Notes |
|---|---|---|
| I. Zero Fricção (≤ 2 taps, offline, no data) | ✅ | One more tile on Home (2 taps to the first card, as for every category); content bundled; nothing collected |
| II. Imersão Tátil | ✅ | Gestures, haptics and reduced motion untouched; the new deck reuses `SwipeCard` |
| III. Tipagem Estrita | ✅ | New ID enters the `CATEGORY_IDS` tuple, so `CategoryId`, `Record<CategoryId, …>` (ink, test table) and guards cover it at compile time; no `any` |
| IV. Arquitetura Limpa | ✅ | Change confined to Data (`types.ts`, `data.json`) and theme (`categoryVisual.ts`); no UI/screen logic changes |
| Stack (Managed, NativeWind, Zustand) | ✅ | No new packages, no new stores |
| Jogo: categories with name, description, own visual identity | ✅ | Title, description, green back, leaf-green front ink and `home-heart`; distinct from Futuro on both faces (R2) |
| Jogo: no repeat until all cards shown; skip any card | ✅ | Existing deck logic, generic over categories |
| Conteúdo: original, pt-BR, inclusive, no assumptions (gender, orientation, religion, marital status, finances, **family structure**) | ✅ | The rule most at risk in a family deck: questions never name a specific relative and say "alguém da família", "família de sangue ou de coração" (R3); kinship-word guard in the content test (R4); manual review in quickstart |
| Conteúdo: original vs. `Assets/` references | ✅ | Questions written from scratch, not taken from the reference games |
| Conteúdo: AA contrast | ✅ | Back: dark text on `#27AE60` = 6.00:1; front ink `#007A15` on cream = 4.88:1 |
| Conteúdo validated by test | ✅ | Existing suite (counts, IDs, `?`, yes/no openers, duplicates) + palette + new family-safe test 15 + ΔE distinctness test |
| Qualidade gates | ✅ | `typecheck`, `lint`, `test` in quickstart and pre-commit hook |

**Post-design re-check**: all ✅, no violations.

## Project Structure

### Documentation (this feature)

```text
specs/013-family-category/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   └── content.md       # Category entry, question rules, order contract
├── checklists/
│   └── requirements.md  # /speckit-specify
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── data/
│   ├── types.ts                     # CATEGORY_IDS: insert 'familia' after 'nostalgia' (index 8)
│   ├── data.json                    # category at index 8 + familia-001…030 after nostalgia-030
│   └── __tests__/
│       └── content.test.ts          # PALETTE row; 15 family-safe guard (R4); header comment
├── theme/
│   ├── categoryVisual.ts            # CATEGORY_INK.familia = '#007A15'
│   └── __tests__/categoryVisual.test.ts   # TABLE row; "familia is distinct on both faces" (ΔE ≥ 25, R2)
├── components/
│   ├── MixedHeroCard.tsx            # doc comment example "7 de 9" → "8 de 10"
│   └── __tests__/MixedHeroCard.test.tsx   # summary fixture "7 de 9" → "8 de 10" (cosmetic)
└── screens/__tests__/
    └── HomeScreen.test.tsx          # 10 tiles, Família between Nostalgia and Futuro, "8 de 10 categorias"
```

**Structure Decision**: single Expo project (existing layout). No new modules.

## Complexity Tracking

No violations.
