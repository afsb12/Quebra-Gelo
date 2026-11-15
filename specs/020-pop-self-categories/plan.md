# Implementation Plan: 12 Categorias — Cultura Pop e Autoconhecimento

**Branch**: `020-pop-self-categories` | **Date**: 2026-11-15 | **Spec**: [spec.md](./spec.md)

## Summary

`CATEGORY_IDS` gains `cultura-pop` and `autoconhecimento` at the end; `data.json` gains the two
categories (titles, colors and descriptions from the spec, icons `movie-open-outline` / `mirror`) and
30 questions each (`<categoria>-001…030`). `CATEGORY_INK` gets a hand-checked ink for each new color.
The content test pins the new palette/icons and adds a "self-safe" rule (16) for Autoconhecimento.
The mix filter needs no code change: it stores *excluded* IDs, so new categories start on (006 R1);
a test locks that in for a filter saved with the old 10 IDs. The Home grid already uses 3 columns
with a 12 pt gap (015): 12 cards close 4 rows; a Home test checks it.

## Technical Context

**Language/Version**: TypeScript 6 strict, React 19 / RN 0.88
**Primary Dependencies**: Zustand 5 + persist/AsyncStorage (unchanged), NativeWind 4
**Storage**: bundled JSON; mix filter in AsyncStorage (format unchanged)
**Testing**: Jest + RNTL 14 · **Target**: Android + iOS · **Type**: mobile app
**Constraints**: content rules 1–15 (001/007/010/013); offline; inclusive pt-BR
**Scale/Scope**: types.ts, data.json, categoryVisual.ts, tests (content, palette, store, Home, counts)

## Constitution Check

| Principle / rule | Status | Notes |
|---|---|---|
| I. Zero Fricção | ✅ | Bundled content, offline; still ≤ 2 taps to a card |
| II. Imersão Tátil | ✅ | No gesture change |
| III. Tipagem Estrita | ✅ | `CategoryId` union grows from `CATEGORY_IDS`; `CATEGORY_INK` stays `Record<CategoryId, string>` (compiler forces the new inks) |
| IV. Arquitetura Limpa | ✅ | Data layer only (JSON, types, palette); UI unchanged |
| Conteúdo: IDs únicos/estáveis, 1 categoria, nome/descrição/identidade | ✅ | Pattern `<cat>-NNN`; new color + icon each |
| Conteúdo: original, acolhedor, inclusivo | ✅ | 60 original questions; rule 16 guards Autoconhecimento; manual review below |
| Conteúdo validado por teste | ✅ | content.test.ts covers the new decks (rules 1–13 apply to all) |
| Acessibilidade (contraste AA) | ✅ | onColor and ink ≥ 4.5:1 (palette test) |
| Qualidade gates | ✅ | typecheck, lint, test |

**Post-design re-check**: all ✅.

## Project Structure

```text
src/data/types.ts                 # CATEGORY_IDS += cultura-pop, autoconhecimento
src/data/data.json                # 2 categories + 60 questions
src/theme/categoryVisual.ts       # CATEGORY_INK for the new colors
src/data/__tests__/content.test.ts   # palette/icons pinned, rule 16 (self-safe)
src/theme/__tests__/categoryVisual.test.ts  # TABLE rows
src/store/__tests__/mixFilter.test.ts       # old saved filter → new categories on
src/screens/__tests__/HomeScreen.test.tsx   # 12 cards, 4 full rows, "12 categorias"
```

See [research.md](./research.md), [data-model.md](./data-model.md), [quickstart.md](./quickstart.md).

## Complexity Tracking

None.
