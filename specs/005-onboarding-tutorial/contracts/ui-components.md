# UI Contracts (005)

## TutorialOverlay

```ts
interface TutorialOverlayProps { visible: boolean; onClose: () => void }
```

- Renders nothing when `visible` is false.
- `Modal` transparent; `onRequestClose` → `onClose` (Android back).
- `testID="tutorial-backdrop"`: full-screen, `rgba(0,0,0,0.8)`, press → `onClose`.
- `testID="tutorial-skip"`: "Pular", top right, role button, label "Pular tutorial", press → `onClose`.
- `testID="tutorial-card"`: `BrandCardBack` inside a press-absorbing area; press does **not** call `onClose`.
- Hints (`testID="tutorial-hint-swipe" | "tutorial-hint-flip" | "tutorial-hint-deck"`), each ≤ 50 chars:
  - swipe: "Deslize para os lados para a próxima carta", chevrons left/right of the card (`nudge-x`)
  - flip: "Toque na carta para revelar a pergunta", `gesture-tap` icon over the card center (`pulse`)
  - deck: "Toque em um baralho para começar", `chevron-double-down` below the card (`nudge-y`)
- Container: `accessibilityViewIsModal`; hints readable in order swipe → flip → deck → Pular.

## TutorialHintIcon

```ts
interface TutorialHintIconProps { name: string; size: number; color: string; motion: 'pulse' | 'nudge-x' | 'nudge-y' | 'none' }
```

Loops on the UI thread; `useReducedMotion()` → static. `testID="tutorial-icon-{name}"`.

## HomeScreen

Renders `<TutorialOverlay visible={useShowTutorial()} onClose={markSeen} />`.
