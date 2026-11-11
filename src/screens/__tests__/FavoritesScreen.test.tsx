import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { getQuestionsByCategory } from '../../data/content';
import { useFavoritesStore } from '../../store/favorites';
import { useProgressStore } from '../../store/progress';
import { DeckScreen } from '../DeckScreen';
import { FavoritesScreen } from '../FavoritesScreen';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn(), canGoBack: jest.fn(() => true) },
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <GestureHandlerRootView style={{ flex: 1 }}>{children}</GestureHandlerRootView>
);

const [p1, p2] = getQuestionsByCategory('profundo');
const [v1] = getQuestionsByCategory('viagens');

const save = (...ids: string[]) =>
  useFavoritesStore.setState({ favorites: ids.map((questionId, i) => ({ questionId, savedAt: i + 1 })) });

const press = async (testID: string) => {
  await act(async () => {
    fireEvent.press(screen.getByTestId(testID));
  });
};

describe('FavoritesScreen (017)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useProgressStore.setState({ decks: {} });
  });

  it('shows the empty state and no play button without favorites', async () => {
    save();
    await render(<FavoritesScreen />);
    expect(screen.getByText('Nenhuma pergunta favorita ainda')).toBeTruthy();
    expect(screen.queryByTestId('favorites-play')).toBeNull();
    expect(screen.queryByTestId('favorites-count')).toBeNull();
  });

  it('shows the count and one chip per category with favorites, "Todas" selected', async () => {
    save(p1.id, p2.id, v1.id);
    await render(<FavoritesScreen />);
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('3 perguntas');
    expect(screen.getByTestId('filter-chip-all')).toBeSelected();
    expect(screen.getByTestId('filter-chip-profundo')).toBeTruthy();
    expect(screen.getByTestId('filter-chip-viagens')).toBeTruthy();
    expect(screen.queryByTestId('filter-chip-casual')).toBeNull();
  });

  it('a category chip shows only that category; removing its last favorite falls back to "Todas"', async () => {
    save(p1.id, v1.id);
    await render(<FavoritesScreen />);
    await press('filter-chip-viagens');
    expect(screen.getByTestId('filter-chip-viagens')).toBeSelected();
    expect(screen.getByText(v1.text)).toBeTruthy();
    expect(screen.queryByText(p1.text)).toBeNull();

    await act(async () => {
      fireEvent.press(screen.getByLabelText(`Remover dos favoritos: ${v1.text}`));
    });
    expect(screen.queryByTestId('filter-chip-viagens')).toBeNull();
    expect(screen.getByTestId('filter-chip-all')).toBeSelected();
    expect(screen.getByText(p1.text)).toBeTruthy();
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('1 pergunta');
  });

  it('"Jogar com as favoritas" opens a fresh favorites deck', async () => {
    save(p1.id, v1.id);
    useProgressStore.getState().ensureDeck('favorites');
    useProgressStore.getState().discard('favorites');
    await render(<FavoritesScreen />);
    await press('favorites-play');
    expect(useProgressStore.getState().decks.favorites).toBeUndefined();
    expect(router.push).toHaveBeenCalledWith({ pathname: '/deck/[deckId]', params: { deckId: 'favorites' } });
  });
});

describe('DeckScreen — favorites deck (017)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useProgressStore.setState({ decks: {} });
  });

  it('deals every favorite once with neutral backs, no "Mudar o clima", then ends', async () => {
    save(p1.id, p2.id, v1.id);
    await render(<DeckScreen deckId="favorites" />, { wrapper });
    expect(screen.getByRole('header')).toHaveTextContent('Favoritas');
    expect(screen.getByLabelText('Carta 1 de 3')).toBeTruthy();
    expect(screen.getByTestId('swipe-card').props.accessibilityLabel).toBe('Carta do Quebra-Gelo, virada para baixo');
    expect(screen.queryByTestId('change-mood-button')).toBeNull();

    const seen = new Set<string>();
    for (let i = 0; i < 3; i += 1) {
      await act(async () => {
        fireEvent(screen.getByTestId('swipe-card'), 'accessibilityAction', { nativeEvent: { actionName: 'activate' } });
      });
      seen.add(String(screen.getByTestId('swipe-card').props.accessibilityLabel));
      await act(async () => {
        fireEvent(screen.getByTestId('swipe-card'), 'accessibilityAction', { nativeEvent: { actionName: 'skip' } });
      });
    }
    expect(seen.size).toBe(3);
    expect(screen.getByTestId('deck-complete')).toBeTruthy();
  });
});
