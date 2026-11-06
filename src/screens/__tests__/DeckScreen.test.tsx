import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { AccessibilityInfo } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import * as Haptics from 'expo-haptics';

import { getAllQuestions, getCategories, getQuestion, getQuestionsByCategory } from '../../data/content';
import { useFavoritesStore } from '../../store/favorites';
import { useMixFilterStore } from '../../store/mixFilter';
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
    await render(<DeckScreen deckId="dilemas" />, { wrapper });
    expect(screen.getByText(`Carta 1 de ${total}`)).toBeTruthy();
    await skip();
    expect(screen.getByText(`Carta 2 de ${total}`)).toBeTruthy();
  });

  it('favorite button is disabled face down, toggles the favorite once revealed, never discards', async () => {
    useFavoritesStore.setState({ favorites: [] });
    await render(<DeckScreen deckId="dilemas" />, { wrapper });
    expect(screen.getByTestId('favorite-button')).toBeDisabled();

    await act(async () => {
      fireEvent(screen.getByTestId('swipe-card'), 'accessibilityAction', { nativeEvent: { actionName: 'activate' } });
    });
    expect(screen.getByTestId('favorite-button')).toBeEnabled();

    await act(async () => {
      fireEvent.press(screen.getByTestId('favorite-button'));
    });
    expect(useFavoritesStore.getState().favorites).toHaveLength(1);
    expect(screen.getByLabelText('Remover dos favoritos')).toBeTruthy();
    expect(screen.getByText(`Carta 1 de ${total}`)).toBeTruthy();
  });

  it('shows "Fim do Baralho" after the last card, with reshuffle and choose-another', async () => {
    await render(<DeckScreen deckId="dilemas" />, { wrapper });
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

describe('DeckScreen — Tudo Misturado (004)', () => {
  const mixedTotal = getAllQuestions().length;
  const titles = getCategories().map((c) => c.title);
  const currentId = () => useProgressStore.getState().decks.mixed?.order[useProgressStore.getState().decks.mixed?.cursor ?? 0];
  const flip = async () => {
    await act(async () => {
      fireEvent(screen.getByTestId('swipe-card'), 'accessibilityAction', { nativeEvent: { actionName: 'activate' } });
    });
  };

  beforeEach(() => {
    useProgressStore.setState({ decks: {} });
    useFavoritesStore.setState({ favorites: [] });
    jest.clearAllMocks();
  });

  it('header says "Tudo Misturado"; the face-down card shows the brand back and never names a category', async () => {
    await render(<DeckScreen deckId="mixed" />, { wrapper });
    expect(screen.getByText('Tudo Misturado')).toBeTruthy();
    expect(screen.getByTestId('brand-card-back')).toBeTruthy();
    for (let i = 0; i < 5; i += 1) {
      const label = String(screen.getByTestId('swipe-card').props.accessibilityLabel);
      expect(label).toBe('Carta do Quebra-Gelo, virada para baixo');
      for (const title of titles) expect(label).not.toContain(title);
      expect(screen.queryByTestId('card-back-title')).toBeNull();
      await skip();
    }
  });

  it('walks every question of every category once, then shows "Fim do Baralho"', async () => {
    await render(<DeckScreen deckId="mixed" />, { wrapper });
    const seen = new Set<string>();
    for (let i = 0; i < mixedTotal; i += 1) {
      const id = currentId();
      if (id) seen.add(id);
      await skip();
    }
    expect(seen.size).toBe(mixedTotal);
    expect(screen.getByTestId('deck-complete')).toBeTruthy();
    expect(screen.getByText('Vocês viram todas as perguntas de Tudo Misturado.')).toBeTruthy();
  });

  it('flipping triggers the flip haptic and reveals the origin badge; favoriting keeps the question', async () => {
    await render(<DeckScreen deckId="mixed" />, { wrapper });
    const question = getQuestion(currentId() ?? '');
    const category = getCategories().find((c) => c.id === question?.categoryId);
    await flip();
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    expect(screen.getByTestId('category-badge-title')).toHaveTextContent(category?.title ?? '');
    expect(String(screen.getByTestId('swipe-card').props.accessibilityLabel)).toBe(`${category?.title}: ${question?.text}`);

    await act(async () => {
      fireEvent.press(screen.getByTestId('favorite-button'));
    });
    expect(useFavoritesStore.getState().favorites.map((f) => f.questionId)).toEqual([question?.id]);
  });
});

describe('DeckScreen — filtered mix (006)', () => {
  beforeEach(() => {
    useProgressStore.setState({ decks: {} });
    useMixFilterStore.setState({ excluded: [] });
  });

  it('only deals questions of the chosen categories, each once, then ends', async () => {
    useMixFilterStore.getState().save(['casais', 'futuro']);
    const allowed = new Set([...getQuestionsByCategory('casais'), ...getQuestionsByCategory('futuro')].map((q) => q.id));
    await render(<DeckScreen deckId="mixed" />, { wrapper });
    const seen = new Set<string>();
    for (let i = 0; i < allowed.size; i += 1) {
      const deck = useProgressStore.getState().decks.mixed;
      const id = deck?.order[deck.cursor];
      if (id) seen.add(id);
      await skip();
    }
    expect(seen).toEqual(allowed);
    expect(screen.getByTestId('deck-complete')).toBeTruthy();
  });

  it('a category left out of the mix still has its full deck (FR-011)', async () => {
    useMixFilterStore.getState().save(['casais', 'futuro']);
    await render(<DeckScreen deckId="dilemas" />, { wrapper });
    expect(screen.getByText(`Carta 1 de ${total}`)).toBeTruthy();
  });
});

describe('DeckScreen — reshuffle the remaining cards (008)', () => {
  const currentText = () => getQuestion(useProgressStore.getState().decks.dilemas?.order[useProgressStore.getState().decks.dilemas?.cursor ?? 0] ?? '')?.text ?? '';
  const press = async () => {
    await act(async () => {
      fireEvent.press(screen.getByTestId('reshuffle-button'));
    });
  };

  beforeEach(() => {
    useProgressStore.setState({ decks: {} });
    useFavoritesStore.setState({ favorites: [] });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('keeps the face-up card and counter, and vibrates with the success pattern', async () => {
    await render(<DeckScreen deckId="dilemas" />, { wrapper });
    await skip();
    await skip();
    await act(async () => {
      fireEvent(screen.getByTestId('swipe-card'), 'accessibilityAction', { nativeEvent: { actionName: 'activate' } });
    });
    const text = currentText();
    const before = useProgressStore.getState().decks.dilemas?.order.slice(3);

    await press();

    expect(currentText()).toBe(text);
    expect(screen.getByText(`Carta 3 de ${total}`)).toBeTruthy();
    expect(screen.getByTestId('favorite-button')).toBeEnabled();
    expect(useProgressStore.getState().decks.dilemas?.order.slice(3)).not.toEqual(before);
    expect(Haptics.notificationAsync).toHaveBeenCalledTimes(1);
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
  });

  it('pressing it with the card face down neither flips nor discards it', async () => {
    await render(<DeckScreen deckId="dilemas" />, { wrapper });
    await press();
    expect(screen.getByTestId('favorite-button')).toBeDisabled();
    expect(screen.getByText(`Carta 1 de ${total}`)).toBeTruthy();
  });

  it('is disabled on the last two cards and hidden on "Fim do Baralho"', async () => {
    await render(<DeckScreen deckId="dilemas" />, { wrapper });
    for (let i = 0; i < total - 2; i += 1) await skip();
    expect(screen.getByTestId('reshuffle-button')).toBeDisabled();
    await press();
    expect(Haptics.notificationAsync).not.toHaveBeenCalled();
    expect(screen.queryByTestId('deck-toast')).toBeNull();
    await skip();
    expect(screen.getByTestId('reshuffle-button')).toBeDisabled();
    await skip();
    expect(screen.getByTestId('deck-complete')).toBeTruthy();
    expect(screen.queryByTestId('reshuffle-button')).toBeNull();
  });

  it('shows "Cartas embaralhadas" for 2 s, announces it, and never stacks toasts', async () => {
    jest.useFakeTimers();
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    await render(<DeckScreen deckId="dilemas" />, { wrapper });

    await press();
    expect(screen.getByTestId('deck-toast')).toHaveTextContent('Cartas embaralhadas');
    expect(screen.queryByText('Toque para virar · ← próxima · anterior →')).toBeNull();
    expect(announce).toHaveBeenCalledWith('Cartas embaralhadas');

    await act(async () => {
      jest.advanceTimersByTime(1500);
    });
    await press();
    expect(screen.getAllByTestId('deck-toast')).toHaveLength(1);

    await act(async () => {
      jest.advanceTimersByTime(1500);
    });
    expect(screen.getByTestId('deck-toast')).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(600);
    });
    expect(screen.queryByTestId('deck-toast')).toBeNull();
    expect(screen.getByText('Toque para virar · ← próxima · anterior →')).toBeTruthy();
  });
});

describe('DeckScreen — directional navigation (009)', () => {
  const deck = () => useProgressStore.getState().decks.dilemas;
  const action = async (actionName: string) => {
    await act(async () => {
      fireEvent(screen.getByTestId('swipe-card'), 'accessibilityAction', { nativeEvent: { actionName } });
    });
  };
  const actions = () =>
    (screen.getByTestId('swipe-card').props.accessibilityActions as { name: string }[]).map((a) => a.name);

  beforeEach(() => {
    useProgressStore.setState({ decks: {} });
    useFavoritesStore.setState({ favorites: [] });
    jest.clearAllMocks();
  });

  it('"voltar" brings back the previous card face up, and "próxima" replays the history', async () => {
    await render(<DeckScreen deckId="dilemas" />, { wrapper });
    expect(actions()).not.toContain('previous');
    await skip();
    await skip();
    await skip();
    const order = deck()?.order ?? [];

    await action('previous');
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);
    await action('previous');
    expect(screen.getByText(`Carta 2 de ${total}`)).toBeTruthy();
    expect(screen.getByTestId('swipe-card').props.accessibilityLabel).toBe(getQuestion(order[1])?.text);
    expect(screen.getByTestId('favorite-button')).toBeEnabled();

    await skip();
    expect(deck()?.order[deck()?.cursor ?? 0]).toBe(order[2]);
    await skip();
    expect(deck()?.order[deck()?.cursor ?? 0]).toBe(order[3]);
    expect(screen.getByText(`Carta 4 de ${total}`)).toBeTruthy();
    expect(screen.getByTestId('favorite-button')).toBeDisabled();
  });
});
