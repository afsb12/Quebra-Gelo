import { memo, useId } from 'react';
import Svg, { ClipPath, Defs, Rect } from 'react-native-svg';

import { BRAND_SYMBOL } from '../theme';

export interface BrandSymbolProps {
  /** Side of the square canvas, in pt. */
  size: number;
}

/** Outer bounding-box side of the symbol (stroke included), in symbol units. */
const EXTENT = BRAND_SYMBOL.side + BRAND_SYMBOL.offset + BRAND_SYMBOL.stroke;

/**
 * The app symbol on a transparent background: two rounded squares overlapping on the diagonal,
 * cream outlines and the shared area in the accent (same geometry as the app icon, 003).
 */
export const BrandSymbol = memo(function BrandSymbol({ size }: BrandSymbolProps) {
  const clipId = `b${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const scale = size / EXTENT;
  const side = BRAND_SYMBOL.side * scale;
  const radius = BRAND_SYMBOL.radius * scale;
  const shift = (BRAND_SYMBOL.offset / 2) * scale;
  const start = (sign: -1 | 1) => size / 2 + sign * shift - side / 2;
  const { outline, accent } = BRAND_SYMBOL.colors;
  const stroke = BRAND_SYMBOL.stroke * scale;

  return (
    <Svg testID="brand-symbol" width={size} height={size} viewBox={`0 0 ${size} ${size}`} pointerEvents="none">
      <Defs>
        <ClipPath id={clipId}>
          <Rect x={start(-1)} y={start(-1)} width={side} height={side} rx={radius} />
        </ClipPath>
      </Defs>
      <Rect x={start(1)} y={start(1)} width={side} height={side} rx={radius} fill={accent} clipPath={`url(#${clipId})`} />
      <Rect x={start(-1)} y={start(-1)} width={side} height={side} rx={radius} fill="none" stroke={outline} strokeWidth={stroke} />
      <Rect x={start(1)} y={start(1)} width={side} height={side} rx={radius} fill="none" stroke={outline} strokeWidth={stroke} />
    </Svg>
  );
});
