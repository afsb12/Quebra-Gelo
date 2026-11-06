import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { tokens } from '../theme';

export interface HintLineProps {
  hint: string;
  /** When set, replaces the hint with a small toast pill that ignores touches (008). */
  toast?: string;
}

const HEIGHT = 28;
const FADE_MS = 150;

/** Fixed-height line under the deck controls: the gestures hint, or a short toast in its place. */
export function HintLine({ hint, toast }: HintLineProps) {
  return <View style={styles.line}>{toast ? <Toast text={toast} /> : <Text style={styles.hint}>{hint}</Text>}</View>;
}

function Toast({ text }: { text: string }) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.set(withTiming(1, { duration: FADE_MS }));
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  return (
    <Animated.View testID="deck-toast" pointerEvents="none" style={[styles.pill, style]}>
      <Text style={styles.toast} numberOfLines={1}>
        {text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  line: {
    // minHeight (not height) so a large system font never clips the hint.
    minHeight: HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  hint: {
    fontFamily: tokens.fonts.body,
    fontSize: 14,
    color: tokens.colors.textSecondary,
    textAlign: 'center',
  },
  pill: {
    minHeight: HEIGHT,
    paddingVertical: 4,
    borderRadius: HEIGHT / 2,
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: tokens.colors.surface,
  },
  toast: {
    fontFamily: tokens.fonts.body,
    fontSize: 14,
    color: tokens.colors.iceBlue,
  },
});
