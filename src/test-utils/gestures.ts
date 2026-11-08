/**
 * Test-only helpers that drive the real SwipeCard gestures (012). Never imported by app code.
 * They go through Gesture Handler's jest-utils, so the actual onUpdate/onDeactivate/onActivate
 * callbacks and thresholds run — unlike the accessibility actions, which bypass the gesture.
 */
import { act } from '@testing-library/react-native';
import { State } from 'react-native-gesture-handler';
import { fireGestureHandler, getByGestureTestId } from 'react-native-gesture-handler/jest-utils';

export const PAN_TEST_ID = 'swipe-card-pan';
export const TAP_TEST_ID = 'swipe-card-tap';

/** Drags the card horizontally by `translationX` and releases it with `velocityX` (pt/s). */
export const swipeCard = async (translationX: number, velocityX = 0): Promise<void> => {
  await act(async () => {
    fireGestureHandler(getByGestureTestId(PAN_TEST_ID), [
      { state: State.BEGAN, translationX: 0, velocityX: 0 },
      { state: State.ACTIVE, translationX: translationX / 2, velocityX },
      { translationX, velocityX },
      { state: State.END, translationX, velocityX },
    ]);
  });
};

/** Taps the card (flips it). */
export const tapCard = async (): Promise<void> => {
  await act(async () => {
    fireGestureHandler(getByGestureTestId(TAP_TEST_ID), [{ state: State.BEGAN }, { state: State.ACTIVE }, { state: State.END }]);
  });
};
