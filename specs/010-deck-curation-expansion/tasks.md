---

description: "Task list for the deck curation and expansion to 30 questions per category"
---

# Tasks: Expansão e Curadoria Psicológica do Baralho

**Input**: Design documents from `/specs/010-deck-curation-expansion/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/content.md, quickstart.md

**Tests**: included (spec FR-014; constitution: content JSON must be validated by automated test).

**Organization**: US1 30 cards per deck, US2 open questions, US3 tone per category, US4 favorites
kept. Everything lands in `src/data/data.json` (one file, so content tasks are sequential) and
`src/data/__tests__/content.test.ts`.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 Run `npm run typecheck`, `npm run lint`, `npm test` and confirm all green (baseline); save the pre-010 question IDs with `git show 12fc478:src/data/data.json` for the T018 check

---

## Phase 2: Foundational

- [X] T002 Create specs/010-deck-curation-expansion/content-review.md with the header from data-model.md ("Review record": columns ID · Ação (`mantida` · `reescrita` · `nova`) · Assunto · Texto, with "antes:" for rewrites) and one section per category in `CATEGORY_IDS` order, listing the tone row of spec FR-008 at the top of each section

**Checkpoint**: review document ready to be filled category by category.

---

## Phase 3: User Story 1 - Baralhos mais longos e variados (Priority: P1) 🎯 MVP

**Goal**: exactly 30 questions per category (270 total) with ≥ 6 topics and ≤ 5 cards per topic.

**Independent Test**: content test rule 9 passes; `content-review.md` topic counts per category
satisfy FR-009.

### Tests for User Story 1

- [X] T003 [US1] In src/data/__tests__/content.test.ts replace rule 9 ("at least 20") with "9. every category has exactly 30 questions, IDs `<cat>-001…030`": for each id of `CATEGORY_IDS`, the list of its question IDs MUST equal `Array.from({ length: 30 }, (_, i) => \`${id}-${String(i + 1).padStart(3, '0')}\`)`; in rule 11 change `toBeGreaterThanOrEqual(20)` to `toBe(30)`. Run it and confirm it FAILS (20 per category)

### Implementation for User Story 1

- [X] T004 [US1] Write `casual-021…030` in src/data/data.json (tone: psicologia do absurdo; open; ends with `?`; ≤ 200 chars, target ≤ 120; no normalized duplicate of any existing text) and record them as `nova` with topic in content-review.md
- [X] T005 [US1] Write `primeiros-encontros-021…030` in src/data/data.json (apego seguro sem invadir; MUST pass the 007 date-safe rule 11: no ex, dinheiro, religião, corpo, família, filhos, "a gente/nosso/comigo") and record them in content-review.md
- [X] T006 [US1] Write `profundo-021…030` in src/data/data.json (humanista: valores, medos superados, conquistas, visão de mundo; invite without demanding, no assumed trauma or loss — FR-011) and record them in content-review.md
- [X] T007 [US1] Write `casais-021…030` in src/data/data.json (apego seguro: linguagem do amor, validação, reparo após conflito, rituais e memórias a dois; no assumed gender, marriage or children) and record them in content-review.md
- [X] T008 [US1] Write `happy-hour-021…030` in src/data/data.json (psicologia organizacional positiva, SFW for colleagues: hobbies, small joys, stress relief, light stories; no álcool, dinheiro, chefe, desempenho, intimidade, política, religião — FR-012) and record them in content-review.md
- [X] T009 [US1] Write `dilemas-021…030` in src/data/data.json (absurdo: two funny or two attractive costs; "Você prefere A ou B?" allowed here) and record them in content-review.md
- [X] T010 [US1] Write `viagens-021…030` in src/data/data.json (memória autobiográfica: cheiros, sabores, sons, choque cultural, lições de estrada; "viagem" includes short trips and one's own city — FR-010) and record them in content-review.md
- [X] T011 [US1] Write `nostalgia-021…030` in src/data/data.json (memória autobiográfica sensorial: objetos, sons, lugares, lições; no assumed happy childhood or family structure) and record them in content-review.md
- [X] T012 [US1] Write `futuro-021…030` in src/data/data.json (humanista: propósito, quem a pessoa quer se tornar, esperança; not an interview — no "onde você se vê em X anos") and record them in content-review.md
- [X] T013 [US1] Tag every question 001–030 of each category with one topic in content-review.md and add, per category, a topic count line; adjust texts (in data.json and the review) until each category has ≥ 6 topics and none > 5 (FR-009, SC-004). Run content.test.ts: rule 9 passes

**Checkpoint**: 270 questions, rules 1–11 green.

---

## Phase 4: User Story 2 - Perguntas abertas (Priority: P1)

**Goal**: no question answerable with only "sim"/"não"; every text ends with `?`.

**Independent Test**: content test rules 12 and 13 pass; manual pass over content-review.md.

### Tests for User Story 2

- [X] T014 [US2] In src/data/__tests__/content.test.ts add rule "12. every text ends with ?" and rule "13. no yes/no openers": normalize the text (existing `normalize`), take the start of the text and, if it begins with `se `, also the part after the first comma; fail if any of them starts with one of `voce ja`, `voce toparia`, `voce aceitaria`, `voce mudaria`, `voce abriria`, `voce contaria`, `voce gosta`, `voce acha que`, `voce costuma`, `voce consegue`, `voce faria`, `voce teria`, `voce seria`, `voce sente`, `voce tem`, `tem algo`, `tem alguma`, `existe`, `ha algo`, `e verdade`, unless the normalized text contains ` ou ` (research R2). Report `{ id, opener }` on failure. Run it and confirm it FAILS on current closed questions (e.g. `casais-016`, `dilemas-006`, `dilemas-010`, `dilemas-015`, `dilemas-020`)

### Implementation for User Story 2

- [X] T015 [US2] Review `<cat>-001…020` of every category in src/data/data.json: rewrite in place (same ID, same theme — clarify Q3) every closed, rigid or clichê text; outside `dilemas`, "A ou B?" choices MUST get an explicit follow-up ("… Por quê?", "… e o que isso diz de você?") per clarify Q4; keep good ones (`mantida`, or a tiny naturalness fix noted as `reescrita`). Record action and "antes:" text in content-review.md. Run content.test.ts: rules 12 and 13 pass

**Checkpoint**: rules 1–13 green; every row of content-review.md has an action.

---

## Phase 5: User Story 3 - Tom por categoria (Priority: P2)

**Goal**: each deck follows its FR-008 tone; Happy Hour safe among colleagues.

**Independent Test**: rule 14 passes; manual tone review per section of content-review.md.

### Tests for User Story 3

- [X] T016 [US3] In src/data/__tests__/content.test.ts add rule "14. happy-hour questions are workplace-safe": for every `happy-hour` question, ` ${normalize(text)} ` MUST NOT match `/ (alcool|bebida|bebad|ressaca|drink|cerveja|salari|dinheiro|chefe|demiss|promoc|desempenho|namor|sexo|sexual|religi|igreja|politic|partido)/` (stem prefix, like `DATE_UNSAFE`) nor the whole word `/ ex /`, declared as a `WORKPLACE_UNSAFE: RegExp[]` list. Run it; fix any hit in src/data/data.json (e.g. `happy-hour-018` "brinde" is fine, but no drink mention)

### Implementation for User Story 3

- [X] T017 [US3] Read each category section of content-review.md against its FR-008 tone row, FR-010/FR-011 inclusion rules and FR-013 originality (no text taken from commercial games, books or known lists; the `Assets/` reference games are never used), and check cross-category near-duplicates (same theme MUST have a clearly different angle); rewrite any off-tone question in src/data/data.json (keeping ID and theme) and update the review

**Checkpoint**: rules 1–14 green; tone review signed off in content-review.md.

---

## Phase 6: User Story 4 - Favoritos antigos continuam lá (Priority: P2)

**Goal**: every pre-010 ID still exists with the same category.

**Independent Test**: quickstart favorites check prints `[]`.

- [X] T018 [US4] Run the quickstart compatibility check (old IDs from `git show 12fc478:src/data/data.json` vs current `src/data/data.json`; also compare each old ID's `categoryId`) and confirm no ID is missing or moved; also confirm the `categories` array is identical to the old one (FR-015); note the result at the end of content-review.md

---

## Phase 7: Polish & Cross-Cutting

- [X] T019 Update the header comment of src/data/__tests__/content.test.ts to mention the 010 rules (9 exact 30, 12–14), and update CLAUDE.md "Game and content rules" with "30 questions per category" if it states a count
- [X] T020 Run quickstart.md: `npm run typecheck`, `npm run lint`, `npm test`, the per-category count (all 30, total 270) and the length check (max ≤ 200; report how many > 120)
- [X] T021 Mark tasks complete in this file

---

## Dependencies & Execution Order

- **Setup (T001)** → **Foundational (T002)** → US1 (T003–T013) → US2 (T014–T015) → US3 (T016–T017) → US4 (T018) → Polish.
- US2 rewrites touch the same file as US1 and depend on the full 30-card decks only for the
  duplicate check; they can run before US1 if needed, but sequential order avoids churn.
- Tests first in each story (T003, T014, T016) and confirmed failing before the content work.

### Parallel Opportunities

- Content tasks all edit `src/data/data.json` and `content-review.md`, so they are sequential.
- T003, T014 and T016 edit the same test file: sequential.
- T018 (read-only check) can run in parallel with T019.

## Parallel Example

```bash
Task: "T018 favorites compatibility check"
Task: "T019 test header + CLAUDE.md wording"
```

## Implementation Strategy

### MVP

T001–T013: 30 questions per category, validated. Shippable on its own.

### Incremental Delivery

1. MVP (US1) → 2. open questions (US2) → 3. tone + Happy Hour guard (US3) → 4. compatibility
   check (US4) → polish. Commit after each story (`content:` for data, `test:` for tests).
