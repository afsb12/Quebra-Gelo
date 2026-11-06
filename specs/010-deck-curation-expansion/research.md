# Research: Expansão e Curadoria Psicológica do Baralho

## R1. ID scheme and favorites compatibility

- **Decision**: keep `<categoria>-NNN` (three digits). Existing `-001…020` keep their IDs, even when
  rewritten; new questions are `-021…030`. No ID is removed or reused for another theme.
- **Rationale**: favorites persist `questionId`; `useFavoriteQuestions` silently drops unknown IDs,
  so renumbering to `casais-1` would make every saved favorite disappear (violates FR-016). Content
  test rule 6 already requires `^<cat>-\d{3}$`.
- **Alternatives**: `casais-1…30` as the request suggested (breaks favorites, needs a migration);
  new IDs for every rewrite (orphans favorites of rewritten cards).

## R2. Detecting closed (yes/no) questions automatically

- **Decision**: a blocklist of yes/no openers, matched on the normalized text (lowercase, no
  accents) at the start of the question or right after a leading clause ("Se …, "):
  `voce ja`, `voce toparia`, `voce aceitaria`, `voce mudaria`, `voce abriria`, `voce contaria`,
  `voce gosta`, `voce acha que`, `voce costuma`, `voce consegue`, `voce faria`, `voce teria`,
  `voce seria`, `voce sente`, `voce tem`, `tem algo`, `tem alguma`, `existe`, `ha algo`, `e verdade`.
  A match is allowed only when the text offers alternatives with ` ou ` (e.g. "Você contaria A ou
  B?"). Also: every text MUST end with `?`.
- **Rationale**: Portuguese closed questions almost always start with a conjugated verb aimed at
  "você" or with "tem/existe"; open ones start with interrogatives (qual, o que, como, por que,
  quando, quem, onde) or a hypothetical. A blocklist is deterministic and readable; the manual
  review (SC-002) catches what it misses.
- **Alternatives**: an allowlist of interrogative openers (rejects valid "Se você…, qual…?" forms
  unless it parses clauses); NLP classification (no dependency allowed, non-deterministic).

## R3. Variety without order

- **Decision**: verify variety by topic coverage recorded in `content-review.md`: each question
  gets one topic tag; each category has ≥ 6 topics and no topic has > 5 of its 30 cards.
- **Rationale**: `createDeck` shuffles (Fisher–Yates) every session, so file order never reaches
  the player (clarify Q2). A topic field in the JSON would change the content contract (rule 5
  requires exactly `id`, `categoryId`, `text`), so tags live in the review document.
- **Alternatives**: `topic` field in `data.json` (contract change, no runtime use); order rule
  (meaningless after shuffle).

## R4. Safety guards per category

- **Decision**: keep the 007 date-safe test for `primeiros-encontros` (updated to 30 and IDs
  `001…030`) and add the same mechanism for `happy-hour` with a workplace list: álcool/bebida/
  bêbado/ressaca, salário/dinheiro, chefe/demissão/promoção/desempenho, namoro/ex/sexo, religião,
  política. The expected tone (absurdo, humanista…) is checked by the manual review only.
- **Rationale**: these are the two decks with explicit "must not touch" lists (FR-012); the rest is
  qualitative.
- **Alternatives**: forbidden lists for every category (high false-positive rate: "Profundo" may
  legitimately mention fear; "Nostalgia" mentions family-free childhood memories).

## R5. Writing guidelines applied (psychology framing)

- **Absurdo** (casual, dilemas): concrete, vivid, impossible premises with low stakes ("Se o seu
  travesseiro pudesse falar…"); dilemmas with two attractive or two funny costs; avoid moral
  traps about real harm.
- **Humanista** (profundo, futuro): invite meaning, values and growth; "o que", "como" and
  "quando" over "por que" for painful topics; offer a choice of depth ("um medo que você já
  superou" instead of "seu maior medo"); no assumed loss, illness or trauma.
- **Apego seguro** (casais): appreciation, bids for connection, repair after conflict, love
  languages, shared rituals and memories; phrased as "a gente/nós" with no assumed gender.
  **Primeiros encontros**: curiosity and affinity, no intimacy or history assumed (007 rules).
- **Organizacional positiva** (happy-hour): strengths, hobbies, small joys, light stories,
  stress relief; no performance, money, hierarchy, alcohol or private life.
- **Memória autobiográfica** (viagens, nostalgia): sensory cues (cheiro, som, sabor, textura),
  specific moments, lessons learned and culture shock; "viagem" includes short trips and one's own
  city so no one is excluded for never having travelled far; childhood memories phrased so a hard
  childhood is not assumed.
- **Length**: target ≤ 120 characters (largest card font); hard limit 200.

## R6. Delivery format

- **Decision**: the "unified JSON array" of the request is `data.json`'s `questions` array (same
  shape `{ id, categoryId, text }`), ordered by category in `CATEGORY_IDS` order and by ID.
- **Rationale**: the app reads exactly this file; a separate JSON would be dead content.
