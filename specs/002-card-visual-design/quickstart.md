# Quickstart & Validation: Identidade Visual das Cartas

Run and command setup are the same as
[001 quickstart](../001-icebreaker-cards-mvp/quickstart.md). This guide lists what proves the
visual feature works. Rules: [data-model.md](./data-model.md); components:
[contracts/visual-components.md](./contracts/visual-components.md).

## Automated checks

```bash
npm test                                   # all tests
npx jest src/theme                         # palette, contrast, patterns, text sizing
npx jest -t "verso não mostra a pergunta"  # single test by name
```

| Check | Covers |
|---|---|
| Palette test: 8 colors match table; `onColor`/`ink`/question contrast ≥ 4.5:1 | FR-001, FR-012, SC-002 |
| Pattern map: 8 distinct kinds | FR-007 |
| `CardBack` renders name + icon, no question text | FR-007, FR-008, FR-013 |
| `CardFront` renders footer + icon; star only when favorited | FR-010, FR-011 |
| Text fit: longest question per category fits at ≥ 20pt on 320×568 | FR-009, SC-003 |

## Manual scenarios (physical phone)

1. **Home** — 8 mini cards in 2 columns on a small phone, each identical to its deck's back,
   name + description below.
2. **Backs** — open each category: color, pattern, big icon and bold name; no question text; light
   frame + shadow separate the card from the dark background (also for índigo/roxo/verde).
3. **Front** — flip: cream paper, dark question text, inner frame/icon/footer in category color;
   favorite a question → star indicator appears top-right without covering text.
4. **Long text** — the longest question of each category fits fully on a 320pt-wide device.
5. **Large font** — set the system font size to the largest step: questions still fit (card grows
   first, text never below 20pt or cut).
6. **Consistency** — the same color/icon appear in Favorites items and the "Fim do Baralho" screen.
7. **Color-blind check** — with a grayscale/deuteranopia filter (OS accessibility setting), all 8
   categories remain distinguishable by name, icon and pattern (SC-004).
8. **Fonts offline** — fresh install in airplane mode: all text uses Outfit from the first frame
   (no fallback flash).
9. **Originality review** — compare against `Assets/` references: no names, logos, characters,
   illustrations or typefaces reproduced (SC-006).
10. **User tests** — SC-001 (associate back → category), SC-005 (read at 60 cm) with ≥ 10 people.
