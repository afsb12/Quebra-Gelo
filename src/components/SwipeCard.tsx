import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, type AccessibilityActionEvent } from 'react-native';
import { GestureDetector, useExclusiveGestures, usePanGesture, useTapGesture } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import type { Category, Question } from '../data/types';
import { strings } from '../i18n/strings';
import type { CategoryVisual } from '../theme';
import { BrandCardBack } from './BrandCardBack';
import { CardBack } from './CardBack';
import { CardFront } from './CardFront';

export type CardFace = 'up' | 'down';
export type SwipeDirection = 'left' | 'right';
/** `mixed`: neutral brand back, no category in the face-down label, origin badge on the front (004). */
export type SwipeCardMode = 'category' | 'mixed';

export interface SwipeCardProps {
  mode?: SwipeCardMode;
  question: Question;
  category: Category;
  visual: CategoryVisual;
  isFavorite: boolean;
  /** False on the first card: a right drag only resists (`resistX`) and springs back (009). */
  canGoBack: boolean;
  /** Side shown when the card mounts (a card brought back by "voltar" starts face up, 009). */
  initialFace?: CardFace;
  width: number;
  height: number;
  /** Screen width, used for the discard threshold and fly-off distance. */
  screenWidth: number;
  fontScale?: number;
  /** Called after every flip (the screen triggers the flip haptic and tracks the face). */
  onFlip: (face: CardFace) => void;
  /** Called the moment a discard is confirmed (release past the threshold) — haptic timing. */
  onSwipeConfirmed?: (direction: SwipeDirection) => void;
  /** Called exactly once per card, after the exit animation: 'left' = next card, 'right' = previous (009). */
  onDiscard: (direction: SwipeDirection) => void;
  /** Only used by the "favoritar" accessibility action; the star button lives outside the card. */
  onToggleFavorite: () => void;
}

const DISCARD_RATIO = 0.3;
const DISCARD_VELOCITY = 800;
const MAX_ROTATION = 15;
const FLIP_MS = 320;
const EXIT_MS = 220;
const FADE_MS = 150;
const RESIST_FACTOR = 0.2;
const RESIST_MAX = 40;

/** Elastic resistance for a blocked right drag: follows the finger a little, never past 40 pt (009). */
export const resistX = (translationX: number): number => {
  'worklet';
  return Math.min(Math.max(translationX, 0) * RESIST_FACTOR, RESIST_MAX);
};

export interface SwipeRelease {
  translationX: number;
  velocityX: number;
  screenWidth: number;
  canGoBack: boolean;
}

/**
 * Where a released drag goes: past 30 % of the screen (or flicked faster than 800 pt/s) it leaves
 * left (next) or right (previous); `null` springs it back. A right release on the first card has
 * nothing to go back to, so it always springs back (009 FR-006, 012).
 */
export const resolveSwipeRelease = ({ translationX, velocityX, screenWidth, canGoBack }: SwipeRelease): SwipeDirection | null => {
  'worklet';
  const passed = Math.abs(translationX) > screenWidth * DISCARD_RATIO;
  const flicked = Math.abs(velocityX) > DISCARD_VELOCITY;
  if (!passed && !flicked) return null;
  const direction: SwipeDirection = (passed ? translationX : velocityX) < 0 ? 'left' : 'right';
  return direction === 'right' && !canGoBack ? null : direction;
};

export function SwipeCard({
  mode = 'category',
  question,
  category,
  visual,
  isFavorite,
  canGoBack,
  initialFace = 'down',
  width,
  height,
  screenWidth,
  fontScale = 1,
  onFlip,
  onSwipeConfirmed,
  onDiscard,
  onToggleFavorite,
}: SwipeCardProps) {
  const reducedMotion = useReducedMotion();
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(initialFace === 'up' ? 180 : 0); // 0 = face down, 180 = face up
  const opacity = useSharedValue(1);
  const isAnimating = useSharedValue(false);
  const faceUp = useSharedValue(initialFace === 'up');
  const [face, setFace] = useState<CardFace>(initialFace);
  // Mirrored into a shared value so the gesture worklets always read the current value.
  const canGoBackSV = useSharedValue(canGoBack);

  useEffect(() => {
    canGoBackSV.set(canGoBack);
  }, [canGoBack, canGoBackSV]);

  // Each card is mounted with key={question.id}: just settle in once.
  useEffect(() => {
    if (!reducedMotion) {
      opacity.set(0);
      opacity.set(withTiming(1, { duration: FADE_MS }));
    }
  }, [opacity, reducedMotion]);

  const handleFlipped = useCallback(
    (up: boolean) => {
      const next: CardFace = up ? 'up' : 'down';
      setFace(next);
      onFlip(next);
    },
    [onFlip],
  );

  /** Starts the flip animation; returns the new face, or null when a gesture/animation is running. */
  const startFlip = useCallback((): boolean | null => {
    'worklet';
    if (isAnimating.get()) return null;
    const up = !faceUp.get();
    faceUp.set(up);
    if (reducedMotion) {
      rotation.set(up ? 180 : 0);
      opacity.set(0.6);
      opacity.set(withTiming(1, { duration: FADE_MS }));
    } else {
      isAnimating.set(true);
      rotation.set(
        withTiming(up ? 180 : 0, { duration: FLIP_MS }, () => {
          isAnimating.set(false);
        }),
      );
    }
    return up;
  }, [faceUp, isAnimating, opacity, reducedMotion, rotation]);

  /** Flip from the gesture (UI thread). */
  const flip = useCallback(() => {
    'worklet';
    const up = startFlip();
    if (up !== null) scheduleOnRN(handleFlipped, up);
  }, [handleFlipped, startFlip]);

  const discard = useCallback(
    (direction: SwipeDirection) => {
      'worklet';
      isAnimating.set(true);
      if (onSwipeConfirmed) scheduleOnRN(onSwipeConfirmed, direction);
      const done = (finished?: boolean) => {
        'worklet';
        if (finished) scheduleOnRN(onDiscard, direction);
      };
      if (reducedMotion) {
        opacity.set(withTiming(0, { duration: FADE_MS }, done));
      } else {
        const target = (direction === 'left' ? -1 : 1) * screenWidth * 1.5;
        translateX.set(withTiming(target, { duration: EXIT_MS }, done));
      }
    },
    [isAnimating, onDiscard, onSwipeConfirmed, opacity, reducedMotion, screenWidth, translateX],
  );

  const pan = usePanGesture({
    testID: 'swipe-card-pan',
    activeOffsetX: [-10, 10],
    onUpdate: (event) => {
      'worklet';
      if (isAnimating.get()) return;
      const blocked = !canGoBackSV.get() && event.translationX > 0;
      translateX.set(blocked ? resistX(event.translationX) : event.translationX);
    },
    onDeactivate: (event) => {
      'worklet';
      if (isAnimating.get()) return;
      const direction = resolveSwipeRelease({
        translationX: event.translationX,
        velocityX: event.velocityX,
        screenWidth,
        canGoBack: canGoBackSV.get(),
      });
      if (direction) {
        discard(direction);
      } else {
        translateX.set(withSpring(0, { damping: 18, stiffness: 220 }));
      }
    },
  });

  const tap = useTapGesture({
    testID: 'swipe-card-tap',
    onActivate: () => {
      'worklet';
      flip();
    },
  });

  const gesture = useExclusiveGestures(pan, tap);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [
      { translateX: translateX.get() },
      {
        rotateZ: `${interpolate(translateX.get(), [-screenWidth, 0, screenWidth], [-MAX_ROTATION, 0, MAX_ROTATION], Extrapolation.CLAMP)}deg`,
      },
    ],
  }));

  const backStyle = useAnimatedStyle(() => ({
    opacity: rotation.get() < 90 ? 1 : 0,
    transform: [{ perspective: 1200 }, { rotateY: `${rotation.get()}deg` }],
  }));

  const frontStyle = useAnimatedStyle(() => ({
    opacity: rotation.get() >= 90 ? 1 : 0,
    transform: [{ perspective: 1200 }, { rotateY: `${rotation.get() - 180}deg` }],
  }));

  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    switch (event.nativeEvent.actionName) {
      case 'activate': {
        // Flip from an accessibility action (JS thread).
        const up = startFlip();
        if (up !== null) handleFlipped(up);
        break;
      }
      case 'favorite':
        onToggleFavorite();
        break;
      case 'skip':
        onSwipeConfirmed?.('left');
        onDiscard('left');
        break;
      case 'previous':
        if (!canGoBack) break;
        onSwipeConfirmed?.('right');
        onDiscard('right');
        break;
    }
  };

  const mixed = mode === 'mixed';
  const faceUpLabel = mixed ? strings.card.faceUpMixedLabel(category.title, question.text) : question.text;
  const faceDownLabel = mixed ? strings.card.faceDownMixedLabel : strings.card.faceDownLabel(category.title);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        testID="swipe-card"
        style={[styles.container, { width, height }, containerStyle]}
        accessible
        accessibilityRole="button"
        accessibilityLabel={face === 'up' ? faceUpLabel : faceDownLabel}
        accessibilityHint={strings.deck.tapHint}
        accessibilityActions={[
          { name: 'activate', label: strings.card.actions.flip },
          { name: 'favorite', label: strings.card.actions.favorite },
          { name: 'skip', label: strings.card.actions.next },
          ...(canGoBack ? [{ name: 'previous', label: strings.card.actions.previous }] : []),
        ]}
        onAccessibilityAction={onAccessibilityAction}
      >
        <Animated.View style={[styles.face, backStyle]}>
          {mixed ? (
            <BrandCardBack width={width} height={height} variant="full" />
          ) : (
            <CardBack category={category} visual={visual} width={width} variant="full" />
          )}
        </Animated.View>
        <Animated.View style={[styles.face, frontStyle]}>
          <View style={styles.fill}>
            <CardFront
              category={category}
              visual={visual}
              question={question}
              isFavorite={isFavorite}
              width={width}
              height={height}
              fontScale={fontScale}
              showOriginBadge={mixed}
            />
          </View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  face: {
    ...StyleSheet.absoluteFill,
    backfaceVisibility: 'hidden',
  },
  fill: {
    flex: 1,
  },
});
