# Research: 12 Categorias — Cultura Pop e Autoconhecimento (020)

## R1 — Icons

- **Decision**: `movie-open-outline` (Cultura Pop, for 🎬) and `mirror` (Autoconhecimento, for 🪞),
  both MaterialCommunityIcons glyphs.
- **Rationale**: content rule 4 (icon is a library glyph or an app-drawn custom icon); emojis render
  differently per device and clash with the outline icons. Spec Clarifications.
- **Alternatives**: `popcorn`, `filmstrip` (less readable at mini size); `head-heart-outline`
  (reads as health/therapy, against the Autoconhecimento tone).

## R2 — Colors and inks

| Category | Back | onColor | Contrast | Ink on cream | Contrast | Closest back (ΔE) |
|---|---|---|---|---|---|---|
| cultura-pop | `#E84393` | dark `#1B1A22` | 4.65 | `#CF1972` | 4.59 | nostalgia (30) |
| autoconhecimento | `#00A8FF` | dark `#1B1A22` | 6.61 | `#0072AD` | 4.62 | profundo (50) |

- **Decision**: keep the user's back colors; inks = `inkOnCream(color)` pinned in `CATEGORY_INK`.
- **Rationale**: both pass AA on both faces; back ΔE ≥ 25 against every other category (the 013
  distinctness bar), locked in by a new palette test. Ink ΔE to Nostalgia is 19 (pink family), but the
  front also carries the category icon and name, and the 013 ink rule is scoped to Família.

## R3 — IDs and order

- **Decision**: `cultura-pop-001…030`, `autoconhecimento-001…030`; categories appended after `futuro`.
- **Rationale**: content rules 6 and 9 (`<cat>-NNN`); the favorites store keeps IDs, so one format
  avoids special cases. Spec Clarifications.

## R4 — Mix filter migration

- **Decision**: no code change; the store persists `excluded` IDs, so a filter saved with the old 10 IDs
  leaves the 2 new ones on (006 R1, FR-014). Add a store test that hydrates `{ excluded: ['dilemas'] }`
  and expects 11 of 12 active.
- **Alternatives**: storing *included* IDs plus a version migration (rejected: needless).

## R5 — Content strategy (behavioral psychologist persona)

- **Cultura Pop**: preferences and opinions anyone can answer without a specific repertoire ("qual",
  "que", "se pudesse"); light controversy is about works, never about people's taste being wrong.
- **Autoconhecimento**: observable behavior, choices, values, triggers framed as everyday reactions,
  growth; never asks to disclose traumas, health/diagnoses, religion, money or love life; gender-neutral
  wording ("de si", "com orgulho").
- **Guard**: content rule 16 — `SELF_UNSAFE` regex over the normalized text (trauma, terapia,
  diagnóstico, ansiedade, depressão, doença, remédio, religião, igreja, deus, dinheiro, salário, dívida,
  namoro, casamento, ex, sexo, morte, luto). The manual review remains the real check.
