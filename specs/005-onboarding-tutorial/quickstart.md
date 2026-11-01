# Quickstart: validating 005

## Automated

```bash
npm run typecheck && npm run lint && npm test
npx jest src/store/__tests__/onboarding.test.ts            # default, persist, rehydrate, read failure
npx jest src/components/__tests__/TutorialOverlay.test.tsx # hints, Pular, backdrop, card, back
npx jest src/screens/__tests__/HomeScreen.test.tsx         # shown first time, gone after closing
```

| Check | Spec |
|---|---|
| fresh store → tutorial shown; after `markSeen` → `quebra-gelo/onboarding` stores `true` | FR-001–FR-003, SC-001 |
| rehydrated `true` → not shown; read error → not shown | FR-006, edge cases |
| Pular / backdrop / `onRequestClose` call `onClose`; card press doesn't | FR-007–FR-009 |
| exactly 3 hints with the spec texts, each ≤ 50 chars | FR-012, FR-013 |
| Home: closing hides the overlay and a deck is 1 tap away | FR-010, SC-004 |

## Manual (device)

1. Clear app data (Android: Configurações → Apps → Quebra-Gelo → Armazenamento → Limpar dados).
2. Open: the overlay is there from the first frame (no flash) over a dimmed Home.
3. Tap the card: nothing. Tap outside: closes. Kill and reopen: no tutorial.
4. Clear data again; open; press Android back: closes without leaving the app.
5. Enable "Remover animações": icons are static.
6. TalkBack: focus stays in the tutorial; reads the 3 hints and "Pular tutorial".
