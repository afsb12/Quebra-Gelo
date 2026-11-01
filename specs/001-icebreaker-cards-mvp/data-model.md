# Data Model: Quebra-Gelo MVP

Phase 1 output for [plan.md](./plan.md). Content entities come from the bundled `data.json`
([schema](./contracts/content-schema.md)); user state entities live only on the device.

## Content (read-only, bundled)

### Category

| Field         | Type           | Rules                                                                 |
|---------------|----------------|-----------------------------------------------------------------------|
| `id`          | `CategoryId`   | One of the 8 fixed IDs; unique.                                       |
| `title`       | `string`       | Non-empty, ≤ 30 chars (pt-BR display name).                           |
| `icon`        | `string`       | Icon name from the bundled vector icon set; non-empty.                |
| `color`       | `string`       | Hex `#RRGGBB`; distinct per category; AA contrast with card text.     |
| `description` | `string`       | Non-empty, ≤ 80 chars.                                                |

`CategoryId` = `'casual' | 'profundo' | 'casais' | 'happy-hour' | 'dilemas' | 'viagens' |
'nostalgia' | 'futuro'`.

Fixed set (display order on Home = this order):

| id           | title                 |
|--------------|-----------------------|
| `casual`     | Descontraído          |
| `profundo`   | Profundo              |
| `casais`     | Casais                |
| `happy-hour` | Happy Hour            |
| `dilemas`    | Dilemas               |
| `viagens`    | Viagens e Aventuras   |
| `nostalgia`  | Nostalgia e Infância  |
| `futuro`     | Futuro e Sonhos       |

### Question

| Field        | Type         | Rules                                                         |
|--------------|--------------|---------------------------------------------------------------|
| `id`         | `string`     | Unique across all questions; pattern `<categoryId>-NNN`; never reused. |
| `categoryId` | `CategoryId` | Must reference an existing category.                          |
| `text`       | `string`     | Trimmed, non-empty, ≤ 200 chars, pt-BR.                       |

Relationship: Category 1 — N Question (≥ 20 per category).

## Device state

### Favorite (persisted)

| Field        | Type     | Rules                                               |
|--------------|----------|-----------------------------------------------------|
| `questionId` | `string` | References an existing Question; unique in the list. |
| `savedAt`    | `number` | Epoch ms when favorited; list sorted by `savedAt` desc. |

Persisted as `{ version: 1, state: { favorites: Favorite[] } }` under key
`quebra-gelo/favorites`. On rehydrate, entries whose `questionId` no longer exists are dropped.

### DeckProgress (in memory only; one per category played in the current app session)

| Field     | Type       | Rules                                                                 |
|-----------|------------|-----------------------------------------------------------------------|
| `order`   | `string[]` | Permutation of all question IDs of the category (Fisher–Yates).       |
| `cursor`  | `number`   | Index of the current card in `order`; `0 ≤ cursor ≤ order.length`.    |

Held as `decks: Partial<Record<CategoryId, DeckProgress>>` in a non-persisted store. Content
cannot change while the app is running, so no reconciliation is needed.

### State transitions — DeckProgress

```text
(no entry) --open deck--> ACTIVE(order=shuffle(ids), cursor=0)
ACTIVE(cursor < n-1) --discard--> ACTIVE(cursor+1)
ACTIVE(cursor = n-1) --discard--> COMPLETED(cursor = n)
COMPLETED --"Embaralhar de novo"--> ACTIVE(order=shuffle(ids), cursor=0)
COMPLETED --"Escolher outra categoria"--> COMPLETED (kept; reopening shows completion screen)
ACTIVE/COMPLETED --leave screen / background app--> unchanged (resumes on reopen)
any --app process closed--> (no entry)  # next open reshuffles
```

### Card view state (ephemeral, not persisted)

`face: 'down' | 'up'` — each new card starts `down`; tap toggles; discard resets for the next
card. Favoriting does not change `face`, `order` or `cursor`. The favorite button is enabled
only when `face === 'up'`.
