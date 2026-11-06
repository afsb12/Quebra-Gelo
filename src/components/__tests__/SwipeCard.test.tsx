import { fireEvent, render, screen } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { getCategory, getQuestionsByCategory } from '../../data/content';
import type { Category } from '../../data/types';
import { getCategoryVisual } from '../../theme';
import { resistX, SwipeCard, type SwipeCardProps } from '../SwipeCard';

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
