import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { tokens } from '../theme';

export interface DeckStackProps {
  /** Size of the current card; the stacked cards use the same size. */
  width: number;
  height: number;
  /** Face-down cards still after the current one, capped at 2. */
  count: 0 | 1 | 2;
  /** Face color: the category color, or a neutral color in the mixed deck (004). */
  color: string;
}

/** Offset/rotation/opacity of the stacked cards, closest first (canvas "Jogo — proposta"). */
const LAYERS = [
  { x: -6, y: 8, rotate: '-2.5deg', opacity: 0.85 },
  { x: 10, y: 14, rotate: '4deg', opacity: 0.55 },
] as const;

/**
 * Static face-down cards behind the current one (016), showing it is a deck and that more cards
 * follow. Purely decorative: no touches, hidden from screen readers, no animation.
 */
export const DeckStack = memo(function DeckStack({ width, height, count, color }: DeckStackProps) {
  if (count === 0) return null;
  const radius = width * tokens.card.radiusRatio;
  const frame = tokens.card.frame;
  // Farthest card first, so the closest one is drawn on top.
  const layers = LAYERS.slice(0, count).reverse();
  return (
    <View
      testID="deck-stack"
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[StyleSheet.absoluteFill, styles.center]}
    >
      {layers.map((layer) => (
        <View
          key={layer.rotate}
          testID="deck-stack-card"
          style={[
            styles.card,
            {
              width,
              height,
              borderRadius: radius,
              padding: frame,
              opacity: layer.opacity,
              transform: [{ translateX: layer.x }, { translateY: layer.y }, { rotate: layer.rotate }],
            },
          ]}
        >
          <View style={[styles.face, { borderRadius: Math.max(radius - frame, 4), backgroundColor: color }]} />
        </View>
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
