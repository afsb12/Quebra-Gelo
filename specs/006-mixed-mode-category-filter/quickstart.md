# Quickstart: validating 006

## Automated

```bash
npm run typecheck && npm run lint && npm test
npx jest src/data/__tests__/mixFilter.test.ts src/store/__tests__/mixFilter.test.ts
npx jest src/components/__tests__/MixFilterSheet.test.tsx src/components/__tests__/MixedHeroCard.test.tsx
npx jest src/screens
```

| Check | Spec |
|---|---|
| default all 8 on; `save` with < 2 rejected | FR-004, FR-007, FR-009, SC-002 |
| mixed deck contains only active categories' questions, each once | FR-008, SC-001 |
| changing the set resets mixed progress; same set keeps it | FR-010 |
| persisted under `quebra-gelo/mix-filter`; rehydrate restores; unknown IDs dropped; < 2 → all on; new category on | FR-012–FR-014, SC-004 |
| sheet: 8 switches, minimum message + disabled "Salvar", close discards | FR-003, FR-005–FR-007 |
| hero: filter button opens the sheet without starting; body starts; summary only when < 8 | FR-001, FR-002, FR-015 |
| category decks unaffected | FR-011 |

## Manual (device)

1. Home: funnel icon in ice blue at the hero's top right.
2. Open it: sheet slides up with 8 switches, all on. Turn off 6 → "Salvar" disabled + message.
3. Leave 6 on, Salvar: hero shows "6 de 8 categorias". Play: badges only from those 6.
4. Kill and reopen: same filter and summary.
5. Open the sheet, change switches, tap outside: nothing changed.
