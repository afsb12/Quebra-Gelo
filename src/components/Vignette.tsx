import { memo, useId } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

/** Drawing space: 100 × 140 units (5:7, the card ratio). */
const W = 100;
const H = 140;

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

/** Edge vignette overlay, shared by the cream front and the solid-color back. */
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
