import * as Haptics from 'expo-haptics';
import { useMemo } from 'react';

/** Fire-and-forget haptics; devices without a vibration motor simply do nothing. */
const fire = (style: Haptics.ImpactFeedbackStyle) => {
  Haptics.impactAsync(style).catch(() => undefined);
};

export interface UseHapticsResult {
  /** Light impact when a card flips. */
  flip: () => void;
  /** Medium impact when a discard is confirmed (never on snap-back). */
  discard: () => void;
  /** System "success" notification pattern when the mood is changed in the mixed deck (011). */
  changeMood: () => void;
}

const success = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
};

export const useHaptics = (): UseHapticsResult =>
  useMemo(
    () => ({
      flip: () => fire(Haptics.ImpactFeedbackStyle.Light),
      discard: () => fire(Haptics.ImpactFeedbackStyle.Medium),
      changeMood: success,
    }),
    [],
  );
