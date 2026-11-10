import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { strings } from '../i18n/strings';
import { tokens } from '../theme';

export interface ChangeMoodButtonProps {
  disabled: boolean;
  /** Never called while disabled. */
  onPress: () => void;
}

const POP_MS = 150;
const SIZE = 44;

/**
 * Discreet ice-blue "Mudar o clima" button for the bottom-right of the mixed deck (011). The icon
 * pops once on the UI thread when pressed; the pop is skipped under reduced motion.
 */
export function ChangeMoodButton({ disabled, onPress }: ChangeMoodButtonProps) {
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const handlePress = useCallback(() => {
    if (disabled) return;
    onPress();
    if (reducedMotion) return;
    scale.set(1);
    scale.set(withSequence(withTiming(1.2, { duration: POP_MS }), withTiming(1, { duration: POP_MS })));
  }, [disabled, onPress, reducedMotion, scale]);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <Pressable
      testID="change-mood-button"
      accessibilityRole="button"
      accessibilityLabel={strings.deck.changeMoodLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={handlePress}
      hitSlop={8}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Animated.View style={iconStyle}>
        <MaterialCommunityIcons name="weather-partly-cloudy" size={24} color={tokens.colors.iceBlue} />
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
