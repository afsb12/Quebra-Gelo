import { render, screen } from '@testing-library/react-native';
import { StyleSheet, type ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import { DeckStack, STACK_SLOTS, stackSlotPose, stackVisibility, type StackPose } from '../DeckStack';

const progressAt = (value: number) => ({ get: () => value }) as SharedValue<number>;

const round = (pose: StackPose): StackPose => ({
  scale: Math.round(pose.scale * 1000) / 1000,
  translateX: Math.round(pose.translateX * 1000) / 1000,
  translateY: Math.round(pose.translateY * 1000) / 1000,
  rotate: Math.round(pose.rotate * 1000) / 1000,
  opacity: Math.round(pose.opacity * 1000) / 1000,
});

type Transform = Record<string, number | string>;

/** Pose read back from a rendered layer's animated style. */
const renderedPose = (testID: string, index = 0): StackPose => {
  const layer = screen.getAllByTestId(testID, { includeHiddenElements: true })[index];
  const style: ViewStyle = StyleSheet.flatten(layer.props.style);
  const transform = (style.transform ?? []) as Transform[];
  const pick = (key: string) => transform.find((t) => key in t)?.[key];
  return round({
    scale: Number(pick('scale')),
    translateX: Number(pick('translateX')),
    translateY: Number(pick('translateY')),
    rotate: parseFloat(String(pick('rotate'))),
    opacity: Number(style.opacity),
  });
};

describe('stackSlotPose (021)', () => {
  it('matches the spec poses at the top, middle and base slots', () => {
    expect(stackSlotPose(0)).toEqual({ scale: 1, translateX: 0, translateY: 0, rotate: 0, opacity: 1 });
    expect(stackSlotPose(1)).toEqual({ scale: 0.95, translateX: -8, translateY: 8, rotate: -3.5, opacity: 0.9 });
    expect(stackSlotPose(2)).toEqual({ scale: 0.9, translateX: 8, translateY: 16, rotate: 3.5, opacity: 0.75 });
    expect(stackSlotPose(3)).toEqual(STACK_SLOTS[3]);
    expect(stackSlotPose(3).opacity).toBe(0);
  });

  it('is linear between slots: the middle half-way to the top, the base flipping its tilt', () => {
    expect(round(stackSlotPose(0.5))).toEqual({ scale: 0.975, translateX: -4, translateY: 4, rotate: -1.75, opacity: 0.95 });
    expect(round(stackSlotPose(1.5))).toEqual({ scale: 0.925, translateX: 0, translateY: 12, rotate: 0, opacity: 0.825 });
  });

  it('clamps outside [0, 3]', () => {
    expect(stackSlotPose(-1)).toEqual(stackSlotPose(0));
    expect(stackSlotPose(4)).toEqual(stackSlotPose(3));
  });
});

describe('stackVisibility (021)', () => {
  it('shows slots with a card, hides the one past the last card and fades in between', () => {
    expect(stackVisibility(1, 2)).toBe(1);
    expect(stackVisibility(2, 2)).toBe(1);
    expect(stackVisibility(3, 2)).toBe(0);
    expect(stackVisibility(2, 1)).toBe(0);
    expect(stackVisibility(1.5, 1)).toBe(0.5);
  });
});

describe('DeckStack (016/021)', () => {
  it('shows at most 2 cards at rest, hidden from screen readers, none at the end', async () => {
    const view = await render(<DeckStack width={200} height={280} remaining={5} color="#3D3FA6" />);
    expect(screen.getAllByTestId('deck-stack-card', { includeHiddenElements: true })).toHaveLength(2);
    expect(screen.getAllByTestId('deck-stack-incoming', { includeHiddenElements: true })).toHaveLength(1);
    expect(screen.getByTestId('deck-stack', { includeHiddenElements: true }).props.importantForAccessibility).toBe(
      'no-hide-descendants',
    );
    expect(screen.getByTestId('deck-stack', { includeHiddenElements: true }).props.pointerEvents).toBe('none');
    await view.rerender(<DeckStack width={200} height={280} remaining={1} color="#3D3FA6" />);
    expect(screen.getAllByTestId('deck-stack-card', { includeHiddenElements: true })).toHaveLength(1);
    await view.rerender(<DeckStack width={200} height={280} remaining={0} color="#3D3FA6" />);
    expect(screen.queryByTestId('deck-stack', { includeHiddenElements: true })).toBeNull();
  });

  it('at rest draws the base (+3.5°) behind the middle (−3.5°), the incoming layer invisible', async () => {
    await render(<DeckStack width={200} height={280} remaining={5} color="#3D3FA6" progress={progressAt(0)} />);
    // Farthest first: base, then middle.
    expect(renderedPose('deck-stack-card', 0)).toEqual(STACK_SLOTS[2]);
    expect(renderedPose('deck-stack-card', 1)).toEqual(STACK_SLOTS[1]);
    expect(renderedPose('deck-stack-incoming').opacity).toBe(0);
  });

  it('at progress 1 the middle is centered, the base is the middle and a new card is at the base', async () => {
    await render(<DeckStack width={200} height={280} remaining={5} color="#3D3FA6" progress={progressAt(1)} />);
    expect(renderedPose('deck-stack-card', 1)).toEqual(STACK_SLOTS[0]);
    expect(renderedPose('deck-stack-card', 0)).toEqual(STACK_SLOTS[1]);
    expect(renderedPose('deck-stack-incoming')).toEqual(STACK_SLOTS[2]);
  });

  it('never shows a layer without a card, even when promoted', async () => {
    await render(<DeckStack width={200} height={280} remaining={1} color="#3D3FA6" progress={progressAt(0)} />);
    expect(renderedPose('deck-stack-incoming').opacity).toBe(0);
  });
});
