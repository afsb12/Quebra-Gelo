import { memo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { tokens } from '../theme';
import { BrandSymbol } from './BrandSymbol';
import { Vignette } from './Vignette';

export interface BrandCardBackProps {
  width: number;
  /** Defaults to the 5:7 card ratio; required in practice for `wide`. */
  height?: number;
  /** `full`: deck card · `mini`: half frame · `wide`: horizontal Home hero (content via `children`). */
  variant: 'full' | 'mini' | 'wide';
  /** Only rendered by the `wide` variant. */
  children?: ReactNode;
}

/**
 * Neutral face-down side of the "Tudo Misturado" cards: cream frame, the app's dark background
 * and the app symbol. Takes no category or question data, so nothing about the next card leaks.
 */
export const BrandCardBack = memo(function BrandCardBack({
  width,
  height = width / tokens.card.ratio,
  variant,
  children,
}: BrandCardBackProps) {
  const radius = width * tokens.card.radiusRatio;
  const frame = variant === 'full' ? tokens.card.frame : tokens.card.frame / 2;
  const innerWidth = width - frame * 2;
  const innerHeight = height - frame * 2;

  return (
    <View style={[styles.frame, { width, height, borderRadius: radius, padding: frame }]}>
      <View testID="brand-card-back" style={[styles.face, { borderRadius: Math.max(radius - frame, 4) }]}>
        <Vignette width={innerWidth} height={innerHeight} tint="#000000" strength={0.3} />
        {variant === 'wide' ? children : (
          <View style={styles.center}>
            <BrandSymbol size={Math.round(width * 0.46)} />
          </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  frame: {
    backgroundColor: tokens.colors.cream,
  },
  face: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: tokens.colors.appBackground,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
