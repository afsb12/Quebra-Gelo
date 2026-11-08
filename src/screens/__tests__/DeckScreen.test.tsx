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

describe('DeckScreen — change the mood (011)', () => {
  const mixed = () => useProgressStore.getState().decks.mixed;
  const currentQuestion = () => getQuestion(mixed()?.order[mixed()?.cursor ?? 0] ?? '');
  const titles = getCategories().map((c) => c.title);
  const action = async (actionName: string) => {
    await act(async () => {
      fireEvent(screen.getByTestId('swipe-card'), 'accessibilityAction', { nativeEvent: { actionName } });
    });
  };
  const press = async () => {
    await act(async () => {
      fireEvent.press(screen.getByTestId('change-mood-button'));
    });
  };

  beforeEach(() => {
    useProgressStore.setState({ decks: {} });
    useFavoritesStore.setState({ favorites: [] });
    useMixFilterStore.setState({ excluded: [] });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deals a face-down card of another category, advances the counter and vibrates', async () => {
    await render(<DeckScreen deckId="mixed" />, { wrapper });
    const totalCards = mixed()?.order.length ?? 0;
    for (let i = 0; i < 5; i += 1) {
      await action('activate');
      const before = currentQuestion();
      await press();
      const after = currentQuestion();
      expect(after?.categoryId).not.toBe(before?.categoryId);
      expect(screen.getByText(`Carta ${i + 2} de ${totalCards}`)).toBeTruthy();
      expect(screen.getByTestId('favorite-button')).toBeDisabled();
      // Face down: nothing names the new card's category before it is flipped (004, FR-008).
      expect(screen.getByTestId('swipe-card').props.accessibilityLabel).toBe('Carta do Quebra-Gelo, virada para baixo');
      expect(screen.getByTestId('brand-card-back')).toBeTruthy();
      expect(screen.queryByTestId('card-back-title')).toBeNull();
      for (const title of titles) expect(screen.getByTestId('deck-toast')).not.toHaveTextContent(title);
    }
    expect(Haptics.notificationAsync).toHaveBeenCalledTimes(5);
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
  });

  it('swiping right brings back the replaced card face up; the button is off while reviewing', async () => {
    await render(<DeckScreen deckId="mixed" />, { wrapper });
    await action('activate');
    const replaced = currentQuestion();
    await press();
    await action('previous');
    expect(currentQuestion()?.id).toBe(replaced?.id);
    expect(screen.getByTestId('favorite-button')).toBeEnabled();
    expect(screen.getByTestId('change-mood-button')).toBeDisabled();
    await press();
    expect(currentQuestion()?.id).toBe(replaced?.id);

    await action('skip');
    expect(screen.getByTestId('change-mood-button')).toBeDisabled();
    await action('activate');
    expect(screen.getByTestId('change-mood-button')).toBeEnabled();
  });

  it('is disabled while the card is face down: pressing does nothing', async () => {
    await render(<DeckScreen deckId="mixed" />, { wrapper });
    const id = currentQuestion()?.id;
    expect(screen.getByTestId('change-mood-button')).toBeDisabled();
    await press();
    expect(currentQuestion()?.id).toBe(id);
    expect(Haptics.notificationAsync).not.toHaveBeenCalled();
    expect(screen.queryByTestId('deck-toast')).toBeNull();
  });

  it('is disabled when only cards of the current category are left, and gone on "Fim do Baralho"', async () => {
    const casais = getQuestionsByCategory('casais').map((q) => q.id);
    const futuro = getQuestionsByCategory('futuro').map((q) => q.id);
    useMixFilterStore.getState().save(['casais', 'futuro']);
    useProgressStore.setState({ decks: { mixed: { order: [...futuro, ...casais], cursor: futuro.length, furthest: futuro.length } } });
    await render(<DeckScreen deckId="mixed" />, { wrapper });
    await action('activate');
    expect(screen.getByTestId('change-mood-button')).toBeDisabled();
    for (let i = 0; i < casais.length; i += 1) await action('skip');
    expect(screen.getByTestId('deck-complete')).toBeTruthy();
    expect(screen.queryByTestId('change-mood-button')).toBeNull();
  });

  it('shows "Clima trocado" for 2 s, announces it, and never stacks toasts', async () => {
    jest.useFakeTimers();
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    await render(<DeckScreen deckId="mixed" />, { wrapper });

    await action('activate');
    await press();
    expect(screen.getByTestId('deck-toast')).toHaveTextContent('Clima trocado');
    expect(announce).toHaveBeenCalledWith('Clima trocado');

    await act(async () => {
      jest.advanceTimersByTime(1500);
    });
    await action('activate');
    await press();
    expect(screen.getAllByTestId('deck-toast')).toHaveLength(1);

    await act(async () => {
      jest.advanceTimersByTime(2100);
    });
    expect(screen.queryByTestId('deck-toast')).toBeNull();
    expect(screen.getByText('Toque para virar · ← próxima · anterior →')).toBeTruthy();
  });
});

describe('DeckScreen — category decks have no shuffle or mood button (011)', () => {
  beforeEach(() => {
    useProgressStore.setState({ decks: {} });
    jest.clearAllMocks();
  });

  it('shows only the favorite button, before and after flipping', async () => {
    await render(<DeckScreen deckId="dilemas" />, { wrapper });
    expect(screen.queryByTestId('change-mood-button')).toBeNull();
    expect(screen.queryByTestId('reshuffle-button')).toBeNull();
    await act(async () => {
      fireEvent(screen.getByTestId('swipe-card'), 'accessibilityAction', { nativeEvent: { actionName: 'activate' } });
    });
    expect(screen.getByTestId('favorite-button')).toBeEnabled();
    expect(screen.queryByTestId('change-mood-button')).toBeNull();
  });
});
