# Data Model: Onboarding tutorial (005)

## OnboardingState (`src/store/onboarding.ts`)

| Field | Type | Persisted | Notes |
|---|---|---|---|
| `hasSeenTutorial` | `boolean` | yes | `false` on a fresh install; `true` after any close |
| `readFailed` | `boolean` | no | `true` when rehydration errored → tutorial not shown this run |
| `markSeen()` | `() => void` | — | idempotent; sets `hasSeenTutorial: true` |

Storage: AsyncStorage key `quebra-gelo/onboarding`, `version: 1`, `partialize` → `{ hasSeenTutorial }`.
`merge`: `hasSeenTutorial = persisted?.hasSeenTutorial === true`.

State transitions: `not seen` → (close: Pular / backdrop / back) → `seen` (terminal in this version).

## Derived

- `useOnboardingHydrated(): boolean` — persist hydration finished (used by the splash gate).
- `useShowTutorial(): boolean` — `hydrated && !hasSeenTutorial && !readFailed`.
