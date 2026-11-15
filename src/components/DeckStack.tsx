import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { tokens } from '../theme';

export interface DeckStackProps {
  /** Size of the current card; the stacked cards use the same size. */
  width: number;
  height: number;
  /** Cards still after the current one; at most 2 show at rest (021). */
  remaining: number;
  /** Face color: the category color, or a neutral color in the mixed deck (004). */
  color: string;
  /**
   * 0 = rest, 1 = "one layer up" (the middle card at the top, the base at the middle). Written on the
   * UI thread by the swipe card (021); omitted = always at rest.
   */
  progress?: SharedValue<number>;
}

/** Pose of a stacked card; `rotate` in degrees. */
export interface StackPose {
  scale: number;
  translateX: number;
  translateY: number;
  rotate: number;
  opacity: number;
}

/** Slot poses (021 research R1): 0 top, 1 middle (tilted left), 2 base (tilted right), 3 hidden below. */
export const STACK_SLOTS: readonly StackPose[] = [
  { scale: 1, translateX: 0, translateY: 0, rotate: 0, opacity: 1 },
  { scale: 0.95, translateX: -8, translateY: 8, rotate: -3.5, opacity: 0.9 },
  { scale: 0.9, translateX: 8, translateY: 16, rotate: 3.5, opacity: 0.75 },
  { scale: 0.85, translateX: 0, translateY: 24, rotate: 0, opacity: 0 },
];

const LAST_SLOT = STACK_SLOTS.length - 1;

/** Layers drawn behind the current card: middle, base and the one that surfaces at the base. */
const LAYER_COUNT = 3;

/** Cards visible at rest behind the current one. */
const VISIBLE_AT_REST = 2;

const lerp = (a: number, b: number, t: number): number => {
  'worklet';
  return a + (b - a) * t;
};

/** Pose at a continuous slot, linear between the slot poses, clamped to [0, 3] (021). */
export const stackSlotPose = (slot: number): StackPose => {
  'worklet';
  const s = Math.min(Math.max(slot, 0), LAST_SLOT);
  const from = Math.min(Math.floor(s), LAST_SLOT - 1);
  const t = s - from;
  const a = STACK_SLOTS[from];
  const b = STACK_SLOTS[from + 1];
  return {
    scale: lerp(a.scale, b.scale, t),
    translateX: lerp(a.translateX, b.translateX, t),
    translateY: lerp(a.translateY, b.translateY, t),
    rotate: lerp(a.rotate, b.rotate, t),
    opacity: lerp(a.opacity, b.opacity, t),
  };
};

/**
 * 1 while the slot stands for a card that exists, fading to 0 one slot past the last one, so a layer
 * without a card is invisible at rest but never pops in or out while moving (021 research R2).
 */
export const stackVisibility = (slot: number, remaining: number): number => {
  'worklet';
  return Math.min(Math.max(remaining + 1 - slot, 0), 1);
};

interface StackLayerProps {
  /** 1 = nearest (middle at rest). */
  layer: number;
  remaining: number;
  progress?: SharedValue<number>;
  width: number;
  height: number;
  color: string;
}

function StackLayer({ layer, remaining, progress, width, height, color }: StackLayerProps) {
  const radius = width * tokens.card.radiusRatio;
  const frame = tokens.card.frame;
  const animated = useAnimatedStyle(() => {
    const slot = layer - (progress ? progress.get() : 0);
    const pose = stackSlotPose(slot);
    return {
      opacity: pose.opacity * stackVisibility(slot, remaining),
      transform: [
        { translateX: pose.translateX },
        { translateY: pose.translateY },
        { rotate: `${pose.rotate}deg` },
        { scale: pose.scale },
      ],
    };
  });
  const visibleAtRest = layer <= Math.min(VISIBLE_AT_REST, remaining);
  return (
    <Animated.View
      testID={visibleAtRest ? 'deck-stack-card' : 'deck-stack-incoming'}
      style={[styles.card, { width, height, borderRadius: radius, padding: frame }, animated]}
    >
      <View style={[styles.face, { borderRadius: Math.max(radius - frame, 4), backgroundColor: color }]} />
    </Animated.View>
  );
}

/**
 * Face-down cards behind the current one (016), moving like a real deck (021): each layer sits at
 * `layer − progress` and follows the drag, the exit and the next card's settle on the UI thread.
 * Purely decorative: no touches, hidden from screen readers.
 */
export const DeckStack = memo(function DeckStack({ width, height, remaining, color, progress }: DeckStackProps) {
  if (remaining <= 0) return null;
  // Farthest layer first, so the nearest one is drawn on top.
  const layers = Array.from({ length: Math.min(LAYER_COUNT, remaining + 1) }, (_, i) => i + 1).reverse();
  return (
    <View
      testID="deck-stack"
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[StyleSheet.absoluteFill, styles.center]}
    >
      {layers.map((layer) => (
        <StackLayer
          key={layer}
          layer={layer}
          remaining={remaining}
          progress={progress}
          width={width}
          height={height}
          color={color}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    backgroundColor: tokens.colors.cream,
  },
  face: {
    flex: 1,
  },
});
