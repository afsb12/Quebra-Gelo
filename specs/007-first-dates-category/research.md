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

## R2. Color: coral `#FF8A80` instead of `#FF9F43`

- **Decision**: use coral `#FF8A80` (user decision after `/speckit-analyze`, option C). Back text = dark (`onColorDark`, 7.56:1, picked
  automatically). Front ink fixed in `CATEGORY_INK` as `#D71100` (= `inkOnCream('#FF8A80')`,
  4.67:1 on cream), pinned in the palette tests like the others.
- **Finding**: the requested `#FF9F43` was unique but almost the same as Happy Hour: perceptual
  distance (CIE76 ΔE) 16 between backs and only 3 between front inks (`#AE5500` vs `#A84F00`).
  Coral `#FF8A80` keeps the warm "toast" mood and is distinct from every category on both faces
  (back / front ΔE): Happy Hour 40 / 36, Nostalgia 29 / 68, Casais 34 / 36, Descontraído 62 / 60,
  others ≥ 83. Its closest neighbors (Nostalgia pink, Casais red) still read as different colors.
- **Rationale**: each category MUST have its own visual identity (constitution); coral achieves it
  by color, not only by icon and name.
- **Alternatives**: keep `#FF9F43` and rely on icon/name (rejected: fronts practically identical to
  Happy Hour); keep the back and hand-pick a redder ink `#B5472E` (rejected: backs still similar).

## R3. Content: what a "first date" question is

- **Decision**: 20 questions in pt-BR, ≤ 200 characters, IDs from `primeiros-encontros-001`,
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
  - shared-history words (whole word/phrase): `em mim`, `comigo`, `a gente`, `nosso`, `nossa`.
    `nós` is deliberately left out: accent removal turns it into the common "nos" (em + os), as
    in "nos últimos anos";
  - forbidden topics: whole word `ex` (also `ex-namorad…`), and the stems `namor`, `casad`,
    `casament`, `salari`, `dinheiro`, `religi`, `igreja`, `deus`, `partido`, `politic`, `filho`,
    `sexo`, `sexual`, `corpo`, `peso`, `doenca`, `aparencia`, `bonit`, `solteir` at a word start (so `exemplo` or `adeus` pass);
  - interview phrases: `defeito`, `daqui a \d+ anos`, `onde você se vê` (`qualidade` is left out:
    it blocks harmless phrases such as "tempo de qualidade");
  - text not ending in `?`.
  The `?` check runs on the raw trimmed text; term matching runs on the normalized text
  (lowercase, accents removed, punctuation turned into spaces), like test #10.
- **Rationale**: the constitution requires content validated by an automated test; a cheap
  keyword guard catches regressions when questions are edited later. This list is only a minimum check:
  the manual review in T011 / quickstart §2 is what actually guarantees the tone (SC-002).
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
