import { fireEvent, render, screen } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { getCategory, getQuestionsByCategory } from '../../data/content';
import type { Category } from '../../data/types';
import { getCategoryVisual } from '../../theme';
import { swipeCard, tapCard } from '../../test-utils/gestures';
import { resistX, resolveSwipeRelease, SwipeCard, type SwipeCardProps } from '../SwipeCard';

const wrapper = ({ children }: { children: ReactNode }) => (
  <GestureHandlerRootView style={{ flex: 1 }}>{children}</GestureHandlerRootView>
);

const category = getCategory('casual') as Category;
const question = getQuestionsByCategory('casual')[0];

const setup = async (overrides: Partial<SwipeCardProps> = {}) => {
  const props: SwipeCardProps = {
    question,
    category,
    visual: getCategoryVisual(category),
    isFavorite: false,
    width: 250,
    height: 350,
    screenWidth: 400,
    canGoBack: true,
    onFlip: jest.fn(),
    onSwipeConfirmed: jest.fn(),
    onDiscard: jest.fn(),
    onToggleFavorite: jest.fn(),
    ...overrides,
  };
  await render(<SwipeCard {...props} />, { wrapper });
  return props;
};

const actionNames = () =>
  (screen.getByTestId('swipe-card').props.accessibilityActions as { name: string }[]).map((a) => a.name);

const act11y = (actionName: string) =>
  fireEvent(screen.getByTestId('swipe-card'), 'accessibilityAction', { nativeEvent: { actionName } });

describe('SwipeCard directional navigation (009)', () => {
  it('resistX damps a right drag and caps it at 40 pt', () => {
    expect(resistX(-30)).toBe(0);
    expect(resistX(50)).toBe(10);
    expect(resistX(1000)).toBe(40);
  });

  it('offers "voltar" only when there is a previous card', async () => {
    await setup({ canGoBack: true });
    expect(actionNames()).toEqual(['activate', 'favorite', 'skip', 'previous']);
    await setup({ canGoBack: false });
    expect(actionNames()).toEqual(['activate', 'favorite', 'skip']);
  });

  it('"próxima" goes left and "voltar" goes right', async () => {
    const props = await setup();
    await act11y('skip');
    expect(props.onSwipeConfirmed).toHaveBeenCalledWith('left');
    expect(props.onDiscard).toHaveBeenCalledWith('left');
    await act11y('previous');
    expect(props.onDiscard).toHaveBeenLastCalledWith('right');
  });

  it('starts face up when initialFace is "up"', async () => {
    await setup({ initialFace: 'up' });
    expect(screen.getByTestId('swipe-card').props.accessibilityLabel).toBe(question.text);
  });
});

describe('resolveSwipeRelease (012)', () => {
  const release = (translationX: number, velocityX = 0, canGoBack = true) =>
    resolveSwipeRelease({ translationX, velocityX, screenWidth: 400, canGoBack });

  it('past 30 % of the screen the drag direction decides', () => {
    expect(release(-121)).toBe('left');
    expect(release(121)).toBe('right');
    expect(release(-121, 0, false)).toBe('left');
  });

  it('a right release on the first card always springs back', () => {
    expect(release(300, 0, false)).toBeNull();
    expect(release(10, 1500, false)).toBeNull();
  });

  it('below the distance, a flick faster than 800 pt/s decides by its velocity', () => {
    expect(release(-20, -801)).toBe('left');
    expect(release(20, 801)).toBe('right');
    expect(release(-20, 800)).toBeNull();
  });

  it('exactly at the threshold, or below both thresholds, it springs back', () => {
    expect(release(-120)).toBeNull();
    expect(release(120)).toBeNull();
    expect(release(-50, -300)).toBeNull();
    expect(release(0)).toBeNull();
  });

  it('past the distance, the drag wins over an opposite flick', () => {
    expect(release(-200, 1500)).toBe('left');
  });
});

describe('SwipeCard real gestures (012)', () => {
  it('a left drag past the threshold confirms and discards to the left once', async () => {
    const props = await setup();
    await swipeCard(-200);
    expect(props.onSwipeConfirmed).toHaveBeenCalledTimes(1);
    expect(props.onSwipeConfirmed).toHaveBeenCalledWith('left');
    expect(props.onDiscard).toHaveBeenCalledTimes(1);
    expect(props.onDiscard).toHaveBeenCalledWith('left');
  });

  it('a right drag past the threshold goes back when there is a previous card', async () => {
    const props = await setup({ canGoBack: true });
    await swipeCard(200);
    expect(props.onSwipeConfirmed).toHaveBeenCalledWith('right');
    expect(props.onDiscard).toHaveBeenCalledTimes(1);
    expect(props.onDiscard).toHaveBeenCalledWith('right');
  });

  it('a right drag on the first card springs back without discarding', async () => {
    const props = await setup({ canGoBack: false });
    await swipeCard(200);
    expect(props.onSwipeConfirmed).not.toHaveBeenCalled();
    expect(props.onDiscard).not.toHaveBeenCalled();
  });

  it('a short drag springs back without discarding', async () => {
    const props = await setup();
    await swipeCard(-50);
    await swipeCard(50);
    expect(props.onSwipeConfirmed).not.toHaveBeenCalled();
    expect(props.onDiscard).not.toHaveBeenCalled();
  });

  it('a fast flick discards even when the drag is short', async () => {
    const props = await setup();
    await swipeCard(-30, -1200);
    expect(props.onDiscard).toHaveBeenCalledWith('left');
  });

  // One tap only: the Reanimated mock's useSharedValue is recreated on every render, so a second
  // tap in Jest would start from the initial face again (not the app's behaviour).
  it('a tap flips the face-down card face up, once', async () => {
    const props = await setup();
    await tapCard();
    expect(props.onFlip).toHaveBeenCalledTimes(1);
    expect(props.onFlip).toHaveBeenCalledWith('up');
    expect(screen.getByTestId('swipe-card').props.accessibilityLabel).toBe(question.text);
    expect(props.onDiscard).not.toHaveBeenCalled();
  });
});
