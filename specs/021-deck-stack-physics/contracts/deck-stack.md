# UI Contract: DeckStack + SwipeCard (021)

```ts
// src/components/DeckStack.tsx
export interface StackPose { scale: number; translateX: number; translateY: number; rotate: number; opacity: number }
export const STACK_SLOTS: readonly StackPose[];          // research R1 table (4 slots)
export const stackSlotPose: (slot: number) => StackPose;  // worklet, linear, clamped to [0, 3]
export const stackVisibility: (slot: number, remaining: number) => number; // worklet, 0…1

export interface DeckStackProps {
  width: number; height: number;
  remaining: number;                 // cards after the current one (≥ 0)
  color: string;                     // deck color, neutral in mix/favorites
  progress?: SharedValue<number>;    // 0 rest … 1 one layer up; omitted = rest
}

// src/components/SwipeCard.tsx (new props)
stackProgress?: SharedValue<number>;   // written on the UI thread (R3)
enterFrom?: 'left';                    // card brought back by "voltar" slides in from the left
export const stackDragProgress: (translationX: number, screenWidth: number) => number; // worklet
```

| testID | Contract |
|---|---|
| `deck-stack` | container; `pointerEvents="none"`, hidden from accessibility; absent when `remaining = 0` |
| `deck-stack-card` | layers visible at rest, `min(2, remaining)` of them |
| `deck-stack-incoming` | the layer invisible at rest (`i > remaining` or `i = 3`), ready to fade in while the stack moves |
