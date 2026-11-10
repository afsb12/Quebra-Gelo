# Implementation Plan: Expansão e Curadoria Psicológica do Baralho

**Branch**: `010-deck-curation-expansion` | **Date**: 2026-11-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/010-deck-curation-expansion/spec.md`

## Summary

Content-only feature: grow every category from 20 to exactly 30 questions (180 → 270) and curate
the 180 existing ones. Each existing ID (`<categoria>-001…020`) is kept; closed (yes/no), rigid or
clichê texts are rewritten in place, keeping the theme (so persisted favorites stay valid), and
10 new questions per category take `-021…030`. The tone per category follows FR-008 (absurdo,
humanista, apego seguro, organizacional positiva, memória autobiográfica). The automated content
validation (`src/data/__tests__/content.test.ts`) is tightened: exactly 30 per category with
gap-free IDs, every text ends with `?`, a blocklist of yes/no openers (research R2), and the 007
date-safe check extended to the SFW rules of Happy Hour (research R4). A `content-review.md` in the
feature folder records, per question, its topic and the curation action (kept / rewritten / new),
which is how FR-007, FR-009 and SC-004 are verified (the app shuffles, so there is no order rule).
No screen, store, type or persisted format changes.

## Technical Context

**Language/Version**: TypeScript 6 (`strict`), React 19 / React Native 0.88

**Primary Dependencies**: Expo SDK 58 (Managed); no dependency change

**Storage**: bundled `src/data/data.json` (content); AsyncStorage favorites (format unchanged)

**Testing**: Jest (`npm test`), content validation in `src/data/__tests__/content.test.ts`

**Target Platform**: Android and iOS (Expo Go / local release builds)

**Project Type**: mobile-app (single Expo project)

**Performance Goals**: unchanged; 270 short strings are negligible for parse and shuffle

**Constraints**: offline, no new dependencies, no new fields in the JSON, no migration, every text
≤ 200 chars (target ≤ 120 so cards keep the largest 26pt size, `questionBaseSize`)

**Scale/Scope**: 180 questions reviewed, 90 new, 1 test file updated, 1 review document

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / rule | Status | Notes |
|---|---|---|
| I. Zero Fricção (offline, no data, no backend) | ✅ | Content stays bundled in `data.json`; nothing collected |
| II. Imersão Tátil | ✅ | Gestures, haptics, reduced motion untouched |
| III. Tipagem Estrita | ✅ | No type change; `Question` shape unchanged; test works on `unknown` JSON |
| IV. Arquitetura Limpa | ✅ | Change confined to the Data layer (`data.json`) and its tests |
| Stack (Managed, NativeWind, Zustand) | ✅ | No packages, no stores |
| Jogo: unique, stable ID, exactly one category | ✅ | Existing IDs preserved (clarify Q1); new ones `-021…030`; test enforces gap-free numbering |
| Jogo: no repeat until all shown; skip any card | ✅ | Existing generic deck logic |
| Conteúdo: original, pt-BR, welcoming, inclusive, no assumptions | ✅ | All new/rewritten texts written for this feature; FR-010 checklist in quickstart; reference games in `Assets/` not used |
| Conteúdo validated by automated test | ✅ | Tightened suite (R2, R4) |
| Conteúdo review (originality, inclusion) | ✅ | `content-review.md` + manual pass in quickstart |
| Qualidade gates (tsc, lint, test) | ✅ | quickstart |

**Post-design re-check**: all ✅, no violations.

## Project Structure

### Documentation (this feature)

```text
specs/010-deck-curation-expansion/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   └── content.md       # Question array contract (counts, IDs, text rules)
├── content-review.md    # Implementation: per-question topic + action table
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
src/data/
├── data.json                      # 270 questions; categories untouched
└── __tests__/
    └── content.test.ts            # rule 9 → exactly 30 + gap-free IDs; new rules 12–14
```

**Structure Decision**: single Expo project (existing layout). No new modules. Other tests read
counts from `content.ts` (e.g. `useDeck.test.ts`, `deckIds.test.ts`) or mock the content
(`progress.test.ts`), so they adapt with no edits.

## Complexity Tracking

No violations.
