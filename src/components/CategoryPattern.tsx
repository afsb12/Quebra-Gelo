import { memo, useId, useMemo, type ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Circle, Defs, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import type { PatternKind } from '../theme';

/** Pattern drawing space: 100 × 140 units (5:7, the card ratio). */
const W = 100;
const H = 140;
const STEP = 14;

const range = (from: number, to: number, step: number) => {
  const out: number[] = [];
  for (let v = from; v <= to; v += step) out.push(v);
  return out;
};

/** Small deterministic PRNG so "bubbles" look scattered but never change between renders. */
const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const shapes = (kind: PatternKind, ink: string): ReactElement[] => {
  switch (kind) {
    case 'dots':
      return range(STEP / 2, H, STEP).flatMap((y, row) =>
        range(row % 2 ? STEP : STEP / 2, W, STEP).map((x) => <Circle key={`${x}-${y}`} cx={x} cy={y} r={2.2} fill={ink} />),
      );
    case 'concentric':
      return range(STEP, 200, STEP).map((r) => (
        <Circle key={r} cx={0} cy={H} r={r} stroke={ink} strokeWidth={2} fill="none" />
      ));
    case 'diamonds':
      return [
        <Path
          key="d"
          d={[
            ...range(-H, W, STEP).map((x) => `M${x} 0 L${x + H} ${H}`),
            ...range(0, W + H, STEP).map((x) => `M${x} 0 L${x - H} ${H}`),
          ].join(' ')}
          stroke={ink}
          strokeWidth={1.5}
          fill="none"
        />,
      ];
    case 'bubbles': {
      const random = seeded(7);
      return Array.from({ length: 34 }, (_, i) => {
        const r = [2.5, 5, 8][i % 3];
        return <Circle key={i} cx={random() * W} cy={random() * H} r={r} stroke={ink} strokeWidth={1.5} fill="none" />;
      });
    }
    case 'checker':
      return range(0, H, STEP).flatMap((y, row) =>
        range(row % 2 ? STEP : 0, W, STEP * 2).map((x) => (
          <Rect key={`${x}-${y}`} x={x} y={y} width={STEP} height={STEP} fill={ink} />
        )),
      );
    case 'waves':
      return range(STEP / 2, H, STEP).map((y) => {
        const segments = range(0, W, 20).map((x) => `Q${x + 5} ${y - 3.5} ${x + 10} ${y} T${x + 20} ${y}`);
        return <Path key={y} d={`M0 ${y} ${segments.join(' ')}`} stroke={ink} strokeWidth={2} fill="none" />;
      });
    case 'stripes':
      return range(-H, W, STEP).map((x) => (
        <Path key={x} d={`M${x} ${H} L${x + H} 0 L${x + H + 5} 0 L${x + 5} ${H} Z`} fill={ink} />
      ));
    case 'chevrons':
      return range(STEP, H + STEP, STEP).map((y) => (
        <Path
          key={y}
          d={range(0, W, 14)
            .map((x) => `M${x} ${y} L${x + 7} ${y - 6} L${x + 14} ${y}`)
            .join(' ')}
          stroke={ink}
          strokeWidth={2}
          fill="none"
        />
      ));
  }
};

export interface CategoryPatternProps {
  kind: PatternKind;
  color: string;
  onColor: string;
  width: number;
  height: number;
}

/** Static, tone-on-tone geometric background of a card back, with a subtle vignette. */
export const CategoryPattern = memo(function CategoryPattern({ kind, color, onColor, width, height }: CategoryPatternProps) {
  const drawn = useMemo(() => shapes(kind, onColor), [kind, onColor]);
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" style={StyleSheet.absoluteFill}>
      <Rect x={0} y={0} width={W} height={H} fill={color} />
      <Svg opacity={0.12}>{drawn}</Svg>
      <VignetteShape tint="#000000" strength={0.16} />
    </Svg>
  );
});

interface VignetteShapeProps {
  tint: string;
  strength: number;
}

/** Radial gradient: transparent center → slightly darker edges (printed-paper feel). */
function VignetteShape({ tint, strength }: VignetteShapeProps) {
  const id = `v${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <>
      <Defs>
        <RadialGradient id={id} cx="50%" cy="50%" rx="75%" ry="75%">
          <Stop offset="55%" stopColor={tint} stopOpacity={0} />
          <Stop offset="100%" stopColor={tint} stopOpacity={strength} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={W} height={H} fill={`url(#${id})`} />
    </>
  );
}

export interface VignetteProps {
  width: number;
  height: number;
  tint: string;
  strength: number;
}

/** Standalone vignette overlay (used on the cream front). */
export const Vignette = memo(function Vignette({ width, height, tint, strength }: VignetteProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      <VignetteShape tint={tint} strength={strength} />
    </Svg>
  );
});
