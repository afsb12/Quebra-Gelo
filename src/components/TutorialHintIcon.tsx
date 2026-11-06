import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, type ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type HintMotion = 'pulse' | 'nudge-x' | 'nudge-y' | 'none';

export interface TutorialHintIconProps {
  name: IconName;
  size: number;
  color: string;
  motion: HintMotion;
  /** Nudge toward the negative axis (e.g. the left chevron). */
  reverse?: boolean;
}

const HALF_CYCLE_MS = 450;
const NUDGE = 8;
const PULSE = 0.15;

/** Tutorial icon with a subtle UI-thread loop (tap pulse / swipe nudge); static under reduced motion. */
export function TutorialHintIcon({ name, size, color, motion, reverse = false }: TutorialHintIconProps) {
  const reducedMotion = useReducedMotion();
  const nudge = reverse ? -NUDGE : NUDGE;
  const progress = useSharedValue(0);
  const animated = motion !== 'none' && !reducedMotion;

  useEffect(() => {
    if (!animated) return undefined;
    progress.set(
      withRepeat(
        withSequence(withTiming(1, { duration: HALF_CYCLE_MS }), withTiming(0, { duration: HALF_CYCLE_MS })),
        -1,
      ),
    );
    return () => cancelAnimation(progress);
  }, [animated, progress]);

  const style = useAnimatedStyle(() => {
    const p = progress.get();
    if (motion === 'pulse') return { transform: [{ scale: 1 + PULSE * p }] };
    if (motion === 'nudge-x') return { transform: [{ translateX: nudge * p }] };
    if (motion === 'nudge-y') return { transform: [{ translateY: nudge * p }] };
    return {};
  });

  return (
    <Animated.View testID={`tutorial-icon-${name}`} style={[styles.icon, style]} pointerEvents="none">
      <MaterialCommunityIcons name={name} size={size} color={color} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
