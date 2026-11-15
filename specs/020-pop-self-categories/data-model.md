# Data Model: 12 Categorias (020)

No new entity. Changes to existing ones (see [001 data model](../001-icebreaker-cards-mvp/data-model.md)):

- **CategoryId** (`CATEGORY_IDS`): `…, 'futuro', 'cultura-pop', 'autoconhecimento'` (12).
- **Category** (data.json):

| id | title | icon | color | description |
|---|---|---|---|---|
| `cultura-pop` | Cultura Pop | `movie-open-outline` | `#E84393` | Filmes, séries, músicas e opiniões polêmicas sobre entretenimento. |
| `autoconhecimento` | Autoconhecimento | `mirror` | `#00A8FF` | Reflexões sobre hábitos, valores, gatilhos e descobertas pessoais. |

- **Question**: `{ id, categoryId, text }`, 30 per new category, IDs `<categoryId>-001…030`.
- **CATEGORY_INK**: `cultura-pop: '#CF1972'`, `autoconhecimento: '#0072AD'`.
- **Mix filter (persisted)**: unchanged `{ excluded: CategoryId[] }`; unknown IDs dropped, new IDs on.
