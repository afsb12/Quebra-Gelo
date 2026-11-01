import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { getQuestionsByCategory } from '../../data/content';
import { useProgressStore } from '../../store/progress';
import { DeckScreen } from '../DeckScreen';

jest.mock('expo-router', () => ({
  router: { replace: jest.fn(), back: jest.fn(), push: jest.fn(), canGoBack: jest.fn(() => true) },
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <GestureHandlerRootView style={{ flex: 1 }}>{children}</GestureHandlerRootView>
);

const total = getQuestionsByCategory('dilemas').length;

const skip = async () => {
  await act(async () => {
    fireEvent(screen.getByTestId('swipe-card'), 'accessibilityAction', { nativeEvent: { actionName: 'skip' } });
  });
};

describe('DeckScreen', () => {
  beforeEach(() => {
    useProgressStore.setState({ decks: {} });
    jest.clearAllMocks();
  });

  it('pular advances to the next question', async () => {
    await render(<DeckScreen categoryId="dilemas" />, { wrapper });
    expect(screen.getByText(`Carta 1 de ${total}`)).toBeTruthy();
    await skip();
    expect(screen.getByText(`Carta 2 de ${total}`)).toBeTruthy();
  });

  it('shows "Fim do Baralho" after the last card, with reshuffle and choose-another', async () => {
    await render(<DeckScreen categoryId="dilemas" />, { wrapper });
    for (let i = 0; i < total; i += 1) await skip();

    expect(screen.getByTestId('deck-complete')).toBeTruthy();
    expect(screen.getByText('Fim do Baralho')).toBeTruthy();

    await act(async () => {
      fireEvent.press(screen.getByText('Escolher outra categoria'));
    });
    expect(router.replace).toHaveBeenCalledWith('/');

    await act(async () => {
      fireEvent.press(screen.getByText('Embaralhar de novo'));
    });
    expect(screen.getByTestId('swipe-card')).toBeTruthy();
    expect(screen.getByText(`Carta 1 de ${total}`)).toBeTruthy();
  });
});
