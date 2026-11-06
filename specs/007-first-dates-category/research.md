# Research: Nova Categoria "Primeiros Encontros"

## R1. Icon for 🥂

- **Decision**: `glass-flute` (MaterialCommunityIcons), a champagne flute.
- **Rationale**: categories render icons from MaterialCommunityIcons and `content.test.ts` (#4)
  requires the name to exist in its glyph map. The set has no "toast" glyph (two glasses); the
  available glasses are `glass-cocktail` (already Happy Hour), `glass-wine`, `glass-flute`,
  `glass-tulip`, `glass-mug*`, `glass-pint-outline`, `glass-stange`. `glass-flute` is the
  sparkling-wine glass of 🥂 and is not used by any other category.
- **Alternatives**: `glass-wine` (reads as "wine bar", less celebratory); rendering the emoji
  as text (breaks the icon contract, renders differently per OS, and fails test #4); a custom SVG
  (new asset for a marginal gain).

## R2. Color `#FF9F43` and the closeness to Happy Hour

- **Decision**: keep `#FF9F43` as requested. Back text = dark (`onColorDark`, 8.45:1, picked
  automatically). Front ink fixed in `CATEGORY_INK` as `#AE5500` (= `inkOnCream('#FF9F43')`,
  4.52:1 on cream), pinned in the palette tests like the others.
- **Finding**: the color is unique (test #3 passes) but close to Happy Hour `#F27A1F` (contrast
  1.36:1 between backs), and its front ink is nearly identical to Happy Hour's `#A84F00` (1.08:1).
  On the Home grid the two tiles are told apart by icon and title; in the mixed deck the front
  shows the category badge with the name. So identity holds, but by shape and text rather than
  color.
- **Rationale**: the color is an explicit part of the request; changing it is the user's call.
- **Alternatives** (for the user to pick, if wanted): a peach/coral back such as `#FF8A80` would
  be clearly distinct from Happy Hour while keeping the warm "toast" mood; a hand-picked ink with
  a hue shift toward red (e.g. `#B5472E`) would separate the fronts without changing the back.

## R3. Content: what a "first date" question is

- **Decision**: 20 questions in pt-BR, ≤ 200 characters, IDs `primeiros-encontros-001…020`,
  written from scratch, following this mix:
  - **Gostos e manias** (~6): pequenas preferências, rituais, manias inofensivas.
  - **Histórias leves** (~5): situações engraçadas, descobertas, "a última vez que…".
  - **"E se…" bem-humorados** (~5): hipotéticos curtos e divertidos.
  - **Afinidades** (~4): perguntas que convidam a comparar e achar coisas em comum, sem "nós".
- **Rules** (from FR-006–FR-009): open questions (no yes/no); "você" singular, no gendered words
  about either person; no shared history ("em mim", "a gente", "nós", "nosso"); no interview
  tone (career goals, defects, "daqui a X anos"); no exes, sex, body/appearance, money/salary,
  religion, party politics, health, family structure, marital status, children; no duplicates of
  `casual` or `casais`.
- **Rationale**: `casais` already covers people with a shared history; `casual` covers neutral
  small talk. This deck sits between: playful, slightly personal, safe for strangers.
- **Alternatives**: 30+ questions (better replay, but every category has 20; can grow later
  under `content:` commits).

## R4. Enforcing the tone rules automatically

- **Decision**: add a content test scoped to `primeiros-encontros` that rejects:
  - shared-history words: `\b(em mim|comigo|a gente|nós|nosso|nossa)\b`;
  - forbidden topics: whole word `ex` (also `ex-namorad…`), and the stems `namor`, `casad`,
    `casament`, `salari`, `dinheiro`, `religi`, `igreja`, `deus`, `partido`, `politic`, `filho`,
    `sexo`, `sexual`, `corpo`, `peso`, `doenca` at a word start (so `exemplo` or `adeus` pass);
  - interview phrases: `defeito`, `qualidade`, `daqui a \d+ anos`, `onde você se vê`;
  - text not ending in `?`.
  Matching runs on the normalized text (lowercase, accents removed), like test #10.
- **Rationale**: the constitution requires content validated by an automated test; a cheap
  keyword guard catches regressions when questions are edited later. It is a floor, not proof:
  the manual review in quickstart remains the real check (SC-002).
- **Alternatives**: manual review only (no regression guard); applying the list to every
  category (would flag legitimate `casais`/`profundo` questions).

## R5. Order on Home and in the filter

- **Decision**: insert the ID at index 1 of `CATEGORY_IDS` and the category object at index 1 of
  `data.json` `categories`. Questions are appended after `casual-020` to keep the file grouped by
  category in the same order.
- **Rationale**: Home renders `getCategories()` in `data.json` order and test #2 pins that order to
  `CATEGORY_IDS`; the mix filter lists categories in the same order; `activeMixCategories` keeps
  the order of `all`. One ordering source, two places that must agree, already tested.
- **Alternatives**: an explicit `order` field (schema change for no gain; test #1/#5 pin keys);
  a "new" badge/highlight for first-time users (out of scope per spec Assumptions).

## R6. Persisted data and migration

- **Decision**: nothing to migrate.
- **Rationale**: the mix filter persists **excluded** IDs (006); a category absent from the saved
  list is on, so `primeiros-encontros` starts on for everyone and previous exclusions remain
  (FR-012, SC-005). Favorites store question IDs; new IDs don't collide (`<categoryId>-NNN`).
  Deck progress is in memory only.

## R7. Grid with 9 tiles

- **Decision**: keep the current 2-column `flex-row flex-wrap` grid with fixed tile width; the 9th
  tile (Futuro e Sonhos) sits alone on the left of the last row, same size as the rest.
- **Rationale**: tiles have a fixed computed width, so nothing stretches; a left-aligned last
  item is the standard grid reading order and keeps columns aligned (spec edge case).
- **Alternatives**: centering the last tile (breaks column alignment); a 10th placeholder tile
  (noise).
