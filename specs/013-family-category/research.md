# Research: Nova Categoria "Família"

## R1. Icon for 🏡

- **Decision**: `home-heart` (MaterialCommunityIcons), a house with a heart.
- **Rationale**: categories render icons from MaterialCommunityIcons and content test #4 requires
  the name to exist in its glyph map (it does). The heart carries "sangue ou coração" better than a
  plain house, and no other category uses a house.
- **Alternatives**: `home-variant-outline` / `home-outline` (just "home", reads as a navigation
  button); `home-group` / `account-group` (people icons, busier at badge size); rendering the emoji
  (breaks the icon contract and test #4).

## R2. Colors: keep the `#27AE60` back, hand-pick the front ink `#007A15`

- **Decision**: back `#27AE60` as requested; back text dark (`onColorDark`, 6.00:1, picked
  automatically). Front ink fixed in `CATEGORY_INK` as **`#007A15`** (leaf green, 4.88:1 on cream).
- **Finding** (CIE76 ΔE, same metric as 007 R2):
  - Backs: `#27AE60` vs Futuro `#167A4C` = 25.9, Viagens `#14A39E` = 41.5, every other ≥ 74.
    Medium bright green vs dark forest green: distinct, and above the 25 used in 007.
  - Front: the automatic `inkOnCream('#27AE60')` = `#1C7C44`, only ΔE 5.7 from Futuro's ink
    `#167A4C`: the fronts would be the same color. A search over every green with 4.5–6:1 on cream
    gave two families: olive (`#547200`, min ΔE 34.5, but it reads as mustard next to the green
    back) and leaf green (`#007A15`, min ΔE 27.5 vs Futuro; Viagens 53.5, Descontraído 59, others
    ≥ 82). Leaf green keeps the front visibly the same hue as the back.
- **Rule enforced by test** (`categoryVisual.test.ts`): `familia` back and ink each ΔE ≥ 25 from every other category's
  back/ink. Scoped to `familia` because two older pairs are already below 25 (Profundo/Dilemas 18
  on the back, 16 on the front; Descontraído/Happy Hour fronts 23.7) and are out of scope.
- **Alternatives**: auto ink (rejected: duplicates Futuro on the front); a different back such as
  a lime or emerald (rejected: the user specified `#27AE60` and it already passes on the back);
  olive ink (rejected: hue mismatch with the back).

## R3. Content: what a "family" question is

- **Decision**: 30 questions in pt-BR, ≤ 200 chars, IDs `familia-001…030`, written from scratch,
  addressed to the person holding the card ("você", clarification 1), answerable without relatives
  present (clarification 2), five per theme of FR-007:
  1. **Histórias e confusões** que viraram lenda (a viagem que deu errado, a história que todo mundo conta).
  2. **Tradições e datas** (rituais, festas, o jeito da família comemorar).
  3. **Comida e receitas** (o prato de família, quem cozinha o quê, a receita que ninguém acerta).
  4. **Jeitos, manias, apelidos e expressões** (a frase que só a família entende).
  5. **Ponte entre gerações** (o que mudou, o que se aprendeu com alguém mais velho ou mais novo).
  6. **Reconhecimento e carinho** (o que você admira, agradece, herdou ou quer passar adiante).
- **Rules** (FR-007a–FR-010): open questions, no yes/no openers (test #13); "você" singular, no
  gendered words; people referred to only as "alguém da família", "a pessoa mais velha / mais nova
  que você conhece da família", "família de sangue ou de coração" — never pai, mãe, irmão, avó,
  tio, primo, filho, cônjuge, sogro…; no death, grief, illness, fights, divorce, inheritance,
  money, religion, politics, love/sex life, body; no ranking or exposing relatives ("o mais chato",
  "o preferido", "segredo"); no "aqui da mesa"; no duplicate of `nostalgia` (own childhood) — the
  subject is the family as a group.
- **Rationale**: the constitution forbids assumptions about family structure, which is exactly the
  trap of a family deck; neutral references also make the deck work for adoptive, single-parent,
  same-sex-parent, grandparent-raised and chosen families, and for agregados at the table.
- **Alternatives**: allow common kinship words when "if you have one" is added (rejected: still
  centers one structure and lengthens text); group-addressed "vocês" (rejected in clarification 1).

## R4. Enforcing the family-safe rules automatically

- **Decision**: content test **15**, scoped to `familia`, on the normalized text (lowercase, no
  accents, punctuation → spaces, padded with spaces, as tests 11/14):
  - **kinship words** (whole words): `pai`, `mae`, `maes`, `irmao`, `irmaos`, `irma`, `irmas`,
    `avo`, `avos`, `vovo`, `tio`, `tios`, `tia`, `tias`, `primo`, `primos`, `prima`, `primas`,
    `filho`, `filhos`, `filha`, `filhas`, `neto`, `netos`, `neta`, `netas`, `marido`, `esposa`,
    `esposo`, `sogro`, `sogra`, `cunhado`, `cunhada`, `genro`, `nora`, `padrasto`, `madrasta`.
    `pais` is left out: without the accent it is also "país";
  - **sensitive topics** (word start): `morte`, `morre`, `morreu`, `falec`, `luto`, `velorio`,
    `enterro`, `doenc`, `doente`, `hospital`, `briga`, `brigou`, `divorc`, `separac`, `heranc`,
    `dinheiro`, `salari`, `religi`, `igreja`, `deus`, `politic`, `partido`, `namor`, `sexo`,
    `sexual`, `corpo`, `peso`, `aparencia`, `segredo`;
  - **ranking / presence**: `preferid`, `mais chat`, `pior`, `aqui da mesa`, `nesta mesa`,
    `olhe para`.
  `segredo` also blocks harmless phrases ("o segredo da receita"); kept on purpose, because
  "segredos de família" is the exposing theme FR-008 forbids, and recipes can say "truque".
  Tests 8–13 (length, count, `?`, yes/no openers, duplicates) already apply to every category.
- **Rationale**: cheap regression guard required by the constitution; the manual review in
  quickstart §2 is what actually guarantees tone and age-appropriateness (SC-002, SC-004).
- **Alternatives**: manual review only (no regression guard); applying the kinship list to every
  category (would flag legitimate wording elsewhere and is not this feature's scope).

## R5. Order on Home and in the filter

- **Decision**: insert `'familia'` at index 8 of `CATEGORY_IDS` (after `nostalgia`, before
  `futuro`) and the category object at index 8 of `data.json` `categories`; questions go right
  after `nostalgia-030`, keeping the file grouped in display order.
- **Rationale**: Home renders `getCategories()` in `data.json` order and test #2 pins it to
  `CATEGORY_IDS`; the mix filter and `activeMixCategories` use the same order (007 R5).
- **Alternatives**: before `nostalgia` (equally "next to", but keeps memory themes in the
  childhood → family → future narrative less well); an explicit `order` field (schema change).

## R6. Persisted data and migration

- **Decision**: nothing to migrate (same as 007 R6). The mix filter persists **excluded** IDs, so
  `familia` starts on for everyone and earlier exclusions stay (FR-013, SC-006). Favorites store
  question IDs; `familia-NNN` collides with nothing. Deck progress is in memory only.

## R7. Grid with 10 tiles

- **Decision**: no change. With 10 tiles the 2-column grid ends on a full row (Família and
  Futuro e Sonhos shift so the last row is complete), which also resolves the 9-tile odd row of 007 R7.

## R8. Description length

- **Decision**: "Histórias, memórias e risadas com quem é do seu sangue (ou do seu coração)."
  (75 chars) instead of the requested 93-char text, keeping the 80-char limit of test #3 that
  every category's Home tile is laid out for.
