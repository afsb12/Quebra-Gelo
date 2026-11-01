import json from './tokens.json';

/**
 * Design tokens. Colors and font names come from tokens.json, which is also read by
 * tailwind.config.js, so NativeWind classes and StyleSheet code share one source of truth.
 */
export const tokens = {
  colors: json.colors,
  fonts: json.fonts,
  card: {
    /** width / height */
    ratio: 5 / 7,
    maxWidth: 360,
    /** Outer cream frame (both faces), in pt. */
    frame: 6,
    /** Inner ink frame on the front: stroke and inset, in pt. */
    innerFrame: 1.5,
    innerInset: 10,
    radiusRatio: 0.06,
  },
  layout: {
    screenPadding: 24,
    gridGap: 16,
  },
  type: {
    minQuestionSize: 20,
    footerSize: 13,
  },
} as const;

export type Tokens = typeof tokens;
