---

description: "Task list for the Primeiros Encontros category"
---

# Tasks: Nova Categoria "Primeiros Encontros"

**Input**: Design documents from `/specs/007-first-dates-category/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/content.md, quickstart.md

**Tests**: included. The spec (FR-010) and the constitution require automated content validation,
and the existing suites pin the palette, order and category count, so they must change with the data.

**Organization**: tasks grouped by user story (US1 play the deck, US2 position on Home, US3 mixed mode).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: user story the task belongs to

---

## Phase 1: Setup

- [X] T001 Run `npm run typecheck`, `npm run lint` and `npm test` on the current branch and confirm all green before any change (baseline; no files changed)

---

## Phase 2: Foundational (registers the category)

**Purpose**: make `primeiros-encontros` a known `CategoryId` with its full visual identity. These
edits must land together: `content.test.ts` #2 pins `data.json` order to `CATEGORY_IDS`, and
`CATEGORY_INK` is a `Record<CategoryId, string>` (compile error if the key is missing).

**⚠️ Note**: after this phase `content.test.ts` #9 ("every category has at least 20 questions")
fails until T008 adds the questions. That is expected; the gate is the US1 checkpoint.

- [X] T002 Insert `'primeiros-encontros'` at index 1 of `CATEGORY_IDS` (right after `'casual'`, before `'profundo'`) in src/data/types.ts
- [X] T003 Insert the category object at index 1 of the `categories` array (right after `casual`) in src/data/data.json, exactly: `{ "id": "primeiros-encontros", "title": "Primeiros Encontros", "icon": "glass-flute", "color": "#FF8A80", "description": "Perguntas leves e instigantes para quebrar o gelo e descobrir afinidades." }` (five keys only; title ≤ 30 chars, description ≤ 80 chars; `glass-flute` replaces 🥂 per research R1)
- [X] T004 [P] Add `'primeiros-encontros': '#D71100'` to `CATEGORY_INK` after `casual` in src/theme/categoryVisual.ts (= `inkOnCream('#FF8A80')`, 4.67:1 on cream, research R2: coral replaces the requested `#FF9F43`, too close to Happy Hour)
- [X] T005 [P] Add `'primeiros-encontros': '#FF8A80'` to `PALETTE` and rename test #2 from "lists exactly the 8 category IDs" to "lists exactly the category IDs" in src/data/__tests__/content.test.ts
- [X] T006 [P] Add the row `'primeiros-encontros': { color: '#FF8A80', onColor: 'dark', ink: '#D71100' }` to `TABLE` in src/theme/__tests__/categoryVisual.test.ts
- [X] T007 Run `npm run typecheck` and `npx jest src/theme src/data/__tests__/content.test.ts`: everything passes except #9 for `primeiros-encontros`

**Checkpoint**: category known to the type system, data and theme.

---

## Phase 3: User Story 1 - Jogar o baralho num date (Priority: P1) 🎯 MVP

**Goal**: a playable deck of 20 safe, playful first-date questions.

**Independent Test**: open the category from Home, play all 20 cards: no repeats, every card
skippable, deck-complete screen and restart work, a favorite survives a restart; content passes
the automated tone test and the manual review (quickstart §2).

### Tests for User Story 1

- [X] T008 [US1] Add test "11. primeiros-encontros questions are date-safe" in src/data/__tests__/content.test.ts, scoped to `categoryId === 'primeiros-encontros'`. (a) On the **raw trimmed text**: fail if it does not end with `?`. (b) On `normalize(text)` (lowercase, no accents, punctuation turned into spaces): fail if it matches a shared-history term as a whole word/phrase (`em mim`, `comigo`, `a gente`, `nosso`, `nossa`); matches the whole word `ex` or starts a word with any of `namor`, `casad`, `casament`, `salari`, `dinheiro`, `religi`, `igreja`, `deus`, `partido`, `politic`, `filho`, `sexo`, `sexual`, `corpo`, `peso`, `doenca`, `aparencia`, `bonit`, `solteir`; or contains `defeito`, `onde voce se ve`, or `daqui a <n> anos` (research R4). Report the offending ID and term in the assertion like the existing tests. Also assert the category has ≥ 20 questions, numbered consecutively from `primeiros-encontros-001` without gaps (contracts C3). Confirm it fails (no questions yet)

### Implementation for User Story 1

- [X] T009 [US1] Write 20 original pt-BR questions and append them to `questions` right after `casual-020` in src/data/data.json, as `{ "id": "primeiros-encontros-NNN", "categoryId": "primeiros-encontros", "text": "…" }` for NNN = 001…020. Rules (spec FR-005–FR-009, research R3): trimmed, 1–200 chars, open question ending in `?`, "você" singular, no gendered words about either person, no shared history, no interview tone, none of the forbidden topics (exes, sex, body/appearance, money/salary, religion, party politics, health, family structure, marital status, children), not a duplicate (normalized) of any existing question, and not taken from the reference games in `Assets/`. Mix: ~6 gostos e manias, ~5 histórias leves, ~5 "e se…" bem-humorados, ~4 afinidades
- [X] T010 [US1] Run `npx jest src/data` and fix any question flagged by tests #8, #10 or #11 in src/data/data.json
- [X] T011 [US1] Self-review all 20 questions against quickstart §2 (two people who met an hour ago) and rewrite any that feel invasive, interview-like or flat in src/data/data.json
- [X] T012 [P] [US1] Rename "isDeckId accepts the 8 categories" → "isDeckId accepts every category" and "from all 8 categories" → "from every category" in src/data/__tests__/deckIds.test.ts

**Checkpoint**: `npm run typecheck`, `npm run lint`, `npm test` all green; the deck is playable.

---

## Phase 4: User Story 2 - Encontrar a categoria logo no início (Priority: P2)

**Goal**: Home shows the new tile second, visible without scrolling.

**Independent Test**: Home renders 9 tiles in the order Descontraído, Primeiros Encontros,
Profundo, Casais, Happy Hour, Dilemas, Viagens e Aventuras, Nostalgia e Infância, Futuro e Sonhos.

- [ ] T013 [US2] Update "renders exactly the 8 categories as mini cards, in data.json order" to "renders every category as mini cards, in data.json order", assert 9 tiles, and add an explicit assertion that the tile right after `casual` is `primeiros-encontros` in src/screens/__tests__/HomeScreen.test.tsx
- [ ] T014 [US2] Run the app (`npm start`) and check quickstart §3.1: new tile 2nd and visible without scrolling on a ≈6" screen, coral with dark text and flute icon, the 9th tile alone on the left of the last row at normal size (research R7); compare against the Happy Hour, Nostalgia and Casais tiles (quickstart §3.6). No code change expected

**Checkpoint**: Home order verified by test and on device.

---

## Phase 5: User Story 3 - Perguntas no "Tudo Misturado" (Priority: P3)

**Goal**: the new category feeds the mixed deck and appears, on by default, in the mix filter.

**Independent Test**: filter lists 9 categories with the new one on; a filter saved before
(e.g. Casais off) keeps Casais off and the new category on; summary reads "7 de 9 categorias".

- [ ] T015 [P] [US3] Add a case to src/data/__tests__/mixFilter.test.ts: `sanitizeExcluded(['casais'], CATEGORY_IDS)` returns `['casais']` and `activeMixCategories(['casais'], CATEGORY_IDS)` includes `'primeiros-encontros'` (upgrade path, FR-012 / research R6)
- [ ] T016 [P] [US3] Rename "lists the 8 categories with labeled switches" → "lists every category with labeled switches" in src/components/__tests__/MixFilterSheet.test.tsx
- [ ] T017 [P] [US3] Change the summary fixture "6 de 8 categorias" → "7 de 9 categorias" in src/components/__tests__/MixedHeroCard.test.tsx and the comment example in src/components/MixedHeroCard.tsx
- [ ] T018 [US3] Update "switching off 2 categories and saving filters the mix and shows \"6 de 8 categorias\"" to expect "7 de 9 categorias" in src/screens/__tests__/HomeScreen.test.tsx (same file as T013, run after it)

**Checkpoint**: all stories green.

---

## Phase 6: Polish & Cross-Cutting

- [ ] T019 [P] Search `src/` for remaining hard-coded "8 categorias" / "8 categories" / `toHaveLength(8)` tied to the category count (`grep -rn "8 categor" src`) and make them generic
- [ ] T020 Run `npm run typecheck`, `npm run lint`, `npm test` (merge gate) and walk through quickstart §3 (deck, favorites, mixed mode, upgrade path)
- [ ] T021 Commit at each checkpoint (Foundational, US1, US2, US3, Polish) with Conventional Commits (`content:` for data.json, `test:`/`feat:` otherwise, suffix `(007)`) and the Co-Authored-By trailer

---

## Dependencies & Execution Order

- **Setup (T001)** → **Foundational (T002–T007)** → **US1 (T008–T012)** → US2 and US3 (independent of each other) → **Polish**.
- T002 and T003 go first (ID + category); T004–T006 are [P] after T002.
- T008 before T009 (test first). T010–T011 after T009.
- US2 and US3 only depend on Foundational for their assertions, but the full suite is green only after US1 (#9).
- T013 → T018 (same file).

### Parallel Example

```bash
# After T002/T003:
Task: "Add CATEGORY_INK entry in src/theme/categoryVisual.ts"          # T004
Task: "Update PALETTE in src/data/__tests__/content.test.ts"           # T005
Task: "Add TABLE row in src/theme/__tests__/categoryVisual.test.ts"    # T006

# After US1:
Task: "mixFilter upgrade case"         # T015
Task: "MixFilterSheet test name"       # T016
Task: "MixedHeroCard fixture"          # T017
```

## Implementation Strategy

- **MVP**: Phases 1–3 (category registered + 20 questions). The category already shows second on
  Home and in the mix because of the foundational order, so US2/US3 are verification and test
  hardening.
- **Incremental**: US2 (order test + on-device check), then US3 (mix tests), then Polish.

## Notes

- No new dependencies, stores, persisted keys or migrations.
- The color is coral `#FF8A80` instead of the requested `#FF9F43` (user decision, research R2).
