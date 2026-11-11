# Research: Fim do Baralho com Sugestões

## R1. Suggestion rule

- **Decision**: next `count` categories after the finished one in content order, wrapping; never the
  finished one (with 10 categories and count 2 this always holds).
- **Rationale**: deterministic and testable; follows the Home order people already see.
- **Alternatives**: random picks (unpredictable, harder to test); "least played" (needs history,
  which is in memory only and adds rules for little gain).

## R2. Fan

- **Decision**: three absolutely positioned 96×134 cards (cream frame, deck color face), outer two
  rotated ±18° and shifted ±48 pt; front card carries the deck icon in `onColor`; container hidden
  from accessibility.

## R3. Navigation

- **Decision**: `router.replace({ pathname: '/deck/[deckId]', params: { deckId } })` so back from the
  suggested deck returns to Home, not to a finished deck.
