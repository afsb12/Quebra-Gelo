import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { strings } from '../i18n/strings';
import { tokens } from '../theme';

export interface ReshuffleButtonProps {
  disabled: boolean;
  /** Never called while disabled. */
  onPress: () => void;
}

const SPIN_MS = 400;
const SIZE = 44;

/**
 * Discreet ice-blue shuffle button for the bottom-right of the deck screen (008). Spins once on
 * the UI thread when pressed; the spin is skipped under reduced motion.
 */
export function ReshuffleButton({ disabled, onPress }: ReshuffleButtonProps) {
  const reducedMotion = useReducedMotion();
  const rotation = useSharedValue(0);

  const handlePress = useCallback(() => {
    if (disabled) return;
    onPress();
    if (reducedMotion) return;
    rotation.set(0);
    rotation.set(withTiming(360, { duration: SPIN_MS }));
  }, [disabled, onPress, reducedMotion, rotation]);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.get()}deg` }] }));

  return (
    <Pressable
      testID="reshuffle-button"
      accessibilityRole="button"
      accessibilityLabel={strings.deck.reshuffleLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={handlePress}
      hitSlop={8}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Animated.View style={iconStyle}>
        <MaterialCommunityIcons name="shuffle-variant" size={24} color={tokens.colors.iceBlue} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    // `surface` (#221E2B) at 60 %: a translucent dark disc, not a filled button.
    backgroundColor: 'rgba(34, 30, 43, 0.6)',
  },
  disabled: {
    opacity: 0.4,
  },
});
