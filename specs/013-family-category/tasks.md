---

description: "Task list for the Família category"
---

# Tasks: Nova Categoria "Família"

**Input**: Design documents from `/specs/013-family-category/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/content.md, quickstart.md

**Tests**: included. The spec (FR-011) and the constitution require automated content validation,
and the existing suites pin the palette, order and category count, so they must change with the data.

**Organization**: tasks grouped by user story (US1 play the deck, US2 position on Home, US3 mixed mode).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: user story the task belongs to

---

## Phase 1: Setup

- [X] T001 Run `npm run typecheck`, `npm run lint` and `npm test` on branch `013-family-category` and confirm all green before any change (baseline; no files changed)

---

## Phase 2: Foundational (registers the category)

**Purpose**: make `familia` a known `CategoryId` with its full visual identity. These edits must
land together: `content.test.ts` #2 pins `data.json` order to `CATEGORY_IDS`, and `CATEGORY_INK` /
the test `TABLE` are `Record<CategoryId, …>` (compile error if the key is missing).

**⚠️ Note**: after this phase `content.test.ts` #9 ("every category has exactly 30 questions")
fails for `familia` until T010 adds the questions. Expected; the gate is the US1 checkpoint.

- [X] T002 Insert `'familia'` into `CATEGORY_IDS` right after `'nostalgia'` and before `'futuro'` (index 8) in src/data/types.ts
- [X] T003 Insert the category object at index 8 of the `categories` array (right after `nostalgia`, before `futuro`) in src/data/data.json, exactly: `{ "id": "familia", "title": "Família", "icon": "home-heart", "color": "#27AE60", "description": "Histórias, memórias e risadas com quem é do seu sangue (ou do seu coração)." }` (five keys only; title "≤ 30 chars (7)", description "≤ 80 chars (75)"; `home-heart` replaces 🏡 per research R1; shortened description per R8)
- [X] T004 [P] Add `familia: '#007A15'` to `CATEGORY_INK` between `nostalgia` and `futuro` in src/theme/categoryVisual.ts, with a comment that it is hand-picked because `inkOnCream('#27AE60')` = `#1C7C44` is ΔE 5.7 from Futuro's ink (research R2)
- [X] T005 [P] Add `familia: '#27AE60'` to `PALETTE` between `nostalgia` and `futuro` in src/data/__tests__/content.test.ts
- [X] T006 [P] Add the row `familia: { color: '#27AE60', onColor: 'dark', ink: '#007A15' }` to `TABLE` between `nostalgia` and `futuro` in src/theme/__tests__/categoryVisual.test.ts
- [X] T007 Run `npm run typecheck` and `npx jest src/theme src/data/__tests__/content.test.ts`: everything passes except #9 for `familia`

**Checkpoint**: category known to the type system, data and theme.

---

## Phase 3: User Story 1 - Jogar o baralho "Família" num almoço de domingo (Priority: P1) 🎯 MVP

**Goal**: a playable deck of 30 all-ages, structure-neutral family questions with a distinct look.

**Independent Test**: open the category from Home and play all 30 cards: no repeats, every card
skippable, back/forward navigation, completion notice and restart work, a favorite survives a
restart; content passes the automated guards and the manual review (quickstart §2).

> FR-005 (one card at a time, no repeats, skip, back/forward, favorites, completion and restart)
> needs no new code: the deck, progress and favorites logic is generic over `CategoryId` and is
> already covered by `src/store/__tests__/progress.test.ts`, `src/hooks/__tests__/useDeck.test.ts`,
> `src/store/__tests__/favorites.test.ts` and `src/screens/__tests__/DeckScreen.test.tsx`.

### Tests for User Story 1

- [X] T008 [US1] Add test "15. familia questions are family-safe and structure-neutral (013)" in src/data/__tests__/content.test.ts, scoped to `categoryId === 'familia'`: assert IDs equal `deckIds('familia')`; then, on `` ` ${normalize(text)} ` ``, fail when it matches (a) a kinship word as a whole word: `pai mae maes irmao irmaos irma irmas avo avos vovo tio tios tia tias primo primos prima primas filho filhos filha filhas neto netos neta netas marido esposa esposo sogro sogra cunhado cunhada genro nora padrasto madrasta` (not `pais`, which is also "país"); (b) a word starting with `morte morre morreu falec luto velorio enterro doenc doente hospital briga brigou divorc separac heranc dinheiro salari religi igreja deus politic partido namor sexo sexual corpo peso aparencia segredo`; (c) a phrase `preferid`, `mais chat`, ` pior `, `aqui da mesa`, `nesta mesa`, `olhe para` (research R4). Declare the lists as `FAMILY_UNSAFE: RegExp[]` next to `WORKPLACE_UNSAFE`, report `{ id, term }` like test 14, and update the header comment to mention "a family-safe Família (15)". Confirm it fails (no questions yet)
- [X] T009 [P] [US1] Add test "familia is distinct from every other category on both faces (013)" in src/theme/__tests__/categoryVisual.test.ts: a local CIE76 ΔE helper (sRGB → linear → XYZ D65 → Lab), then for every other `CategoryId` assert ΔE(`TABLE.familia.color`, `TABLE[id].color`) ≥ 25 and ΔE(`CATEGORY_INK.familia`, `CATEGORY_INK[id]`) ≥ 25, reporting `{ id, back, ink }` rounded to one decimal (research R2: scoped to `familia`, older pairs below 25 are out of scope)

### Implementation for User Story 1

- [X] T010 [US1] Write 30 original pt-BR questions and insert them right after `nostalgia-030` (before `futuro-001`) in `questions` of src/data/data.json, as `{ "id": "familia-NNN", "categoryId": "familia", "text": "…" }` for NNN = 001…030. Rules (spec FR-006–FR-010, clarifications, research R3): trimmed, 1–200 chars, open question ending in `?` with no yes/no opener (test #13 list: "Você já…", "Você tem…", "Existe…" etc. unless offering " ou " alternatives), addressed to "você" singular, answerable with or without relatives present, people referred to only as "alguém da família", "a pessoa mais velha / mais nova da família", "família de sangue ou de coração" (never a specific relative), none of the FR-008 topics, no ranking or exposing relatives, no gendered words, not a duplicate (normalized) of any existing question nor a rewrite of a `nostalgia-*` one, not taken from the reference games in `Assets/`. Five per theme, in this order: histórias e confusões (001–005), tradições e datas (006–010), comida e receitas (011–015), jeitos, manias, apelidos e expressões (016–020), ponte entre gerações (021–025), reconhecimento e carinho (026–030)
- [X] T011 [US1] Run `npx jest src/data src/theme` and fix any question flagged by tests #8–#15 in src/data/data.json
- [X] T012 [US1] Self-review the 30 questions against quickstart §2 (a table with a child, a teenager, an adult and an older adult; and the same card told to friends) and rewrite any that are confusing, sensitive, structure-assuming or flat in src/data/data.json

**Checkpoint**: `npm run typecheck`, `npm run lint`, `npm test` all green; the deck is playable.

---

## Phase 4: User Story 2 - Encontrar "Família" perto de "Nostalgia e Infância" (Priority: P2)

**Goal**: Home shows the Família tile between Nostalgia e Infância and Futuro e Sonhos.

**Independent Test**: Home renders 10 tiles in the order Descontraído, Primeiros Encontros,
Profundo, Casais, Happy Hour, Dilemas, Viagens e Aventuras, Nostalgia e Infância, Família, Futuro e Sonhos.

- [X] T013 [US2] In "renders every category as mini cards, in data.json order" assert 10 tiles (`toHaveLength(10)`) and add `expect(ids.slice(7)).toEqual(['nostalgia', 'familia', 'futuro'])` in src/screens/__tests__/HomeScreen.test.tsx

**Checkpoint**: HomeScreen suite green.

---

## Phase 5: User Story 3 - As perguntas de "Família" entram no "Tudo Misturado" (Priority: P3)

**Goal**: Família joins the mixed deck and its filter, on by default even for saved filters.

**Independent Test**: filter lists 10 categories with Família on; a filter saved without
`familia` in mind keeps it on; turning off 2 categories shows "8 de 10 categorias".

- [X] T014 [US3] Update the test "switching off 2 categories and saving filters the mix and shows "7 de 9 categorias"" to expect "8 de 10 categorias" (name and assertion) in src/screens/__tests__/HomeScreen.test.tsx
- [X] T015 [P] [US3] Add a test "a filter saved before 013 keeps familia on (013)" in src/data/__tests__/mixFilter.test.ts: with `before` = `CATEGORY_IDS` without `'familia'`, `activeMixCategories(sanitizeExcluded(['casais'], before), CATEGORY_IDS)` contains `'familia'` and not `'casais'` (FR-013, SC-006; research R6)
- [X] T016 [P] [US3] Change the doc comment example "7 de 9 categorias" → "8 de 10 categorias" in src/components/MixedHeroCard.tsx and the summary fixture/assertion in src/components/__tests__/MixedHeroCard.test.tsx (cosmetic, keeps examples in sync)

**Checkpoint**: full suite green; mixed mode includes Família.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T017 Run the gates `npm run typecheck`, `npm run lint`, `npm test` (quickstart §1) and fix any failure
- [ ] T018 [P] Run `graphify update .` to refresh graphify-out after the code changes
- [X] T019 Walk through quickstart §2 one last time on the final text of `familia-001…030` in src/data/data.json and record the per-theme count in the commit message
- [ ] T020 (release, per the project workflow) Bump the app version to 1.6.0 (`versionCode` 7) in app.json, package.json and package-lock.json for the release APK

---

## Dependencies & Execution Order

- **Phase 1 → Phase 2**: baseline before edits.
- **Phase 2 blocks all stories**: the ID must exist in `CATEGORY_IDS`, `data.json`, `CATEGORY_INK` and the test tables.
- **US1 (Phase 3)**: T008 and T009 before T010 (tests first); T010 → T011 → T012.
- **US2 (Phase 4)**: only needs Phase 2 (tile renders even with 0 questions); T013 and T014 edit the same file, so run them one after the other.
- **US3 (Phase 5)**: only needs Phase 2; T015 and T016 are independent files.
- **Polish**: after all stories.

### Parallel Opportunities

- T004, T005, T006 (three different files) after T002/T003.
- T009 alongside T008.
- T015 and T016 alongside US2.

## Parallel Example: User Story 1

```bash
Task: "T008 family-safe content test in src/data/__tests__/content.test.ts"
Task: "T009 ΔE distinctness test in src/theme/__tests__/categoryVisual.test.ts"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 baseline, Phase 2 registration.
2. Phase 3: tests, 30 questions, review → the deck is playable and validated.
3. **Stop and validate**: `npm test` green, deck played end to end.

### Incremental Delivery

US2 and US3 are test updates only (Home and the mixed mode already read categories from data);
add them after US1, then Polish. Commit after each phase.
