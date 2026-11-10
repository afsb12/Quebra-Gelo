# Contract: "Família" content in `src/data/data.json`

Extends [001 content-schema](../../001-icebreaker-cards-mvp/contracts/content-schema.md) (rules
1–10) and the 007/010 rules (11–14). Enforced by `src/data/__tests__/content.test.ts` and
`src/theme/__tests__/categoryVisual.test.ts`.

## Category object (exact)

```json
{
  "id": "familia",
  "title": "Família",
  "icon": "home-heart",
  "color": "#27AE60",
  "description": "Histórias, memórias e risadas com quem é do seu sangue (ou do seu coração)."
}
```

## Order

`categories[i].id` equals `CATEGORY_IDS[i]` for every `i`:

```text
casual, primeiros-encontros, profundo, casais, happy-hour, dilemas, viagens, nostalgia, familia, futuro
```

Questions of `familia` appear right after `nostalgia-030` and before `futuro-001`.

## Palette rows

| Where | Row |
|---|---|
| `content.test.ts` `PALETTE` | `familia: '#27AE60'` |
| `categoryVisual.ts` `CATEGORY_INK` | `familia: '#007A15'` |
| `categoryVisual.test.ts` `TABLE` | `familia: { color: '#27AE60', onColor: 'dark', ink: '#007A15' }` |

## New test rules

- **3c** — `familia` back and front ink are each at CIE76 ΔE ≥ 25 from the back / ink of every
  other category (research R2).
- **15** — `familia` has `familia-001…030`; every normalized text is free of the kinship words,
  sensitive topics and ranking/presence phrases listed in research R4.

## Questions (per item)

`{ "id": "familia-NNN", "categoryId": "familia", "text": "…?" }`: pt-BR, ≤ 200 chars, addressed to
"você", answerable whether or not relatives are present, no specific relative named, open
(not yes/no), not a duplicate of any other question.
