import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { getCategories } from '../../data/content';
import { useMixFilterStore } from '../../store/mixFilter';
import { ONBOARDING_STORAGE_KEY, useOnboardingStore } from '../../store/onboarding';
import { HomeScreen } from '../HomeScreen';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn(), canGoBack: jest.fn(() => true) },
}));

describe('HomeScreen — first-launch tutorial (005)', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
    useOnboardingStore.setState({ hasSeenTutorial: false, readFailed: false });
  });

  it('shows the tutorial over Home on a fresh install', async () => {
    await render(<HomeScreen />);
    expect(screen.getByTestId('tutorial-backdrop')).toBeTruthy();
  });

  it('"Pular" hides it, remembers it, and a deck is then one tap away', async () => {
    await render(<HomeScreen />);
    await act(async () => {
      fireEvent.press(screen.getByTestId('tutorial-skip'));
    });
    expect(screen.queryByTestId('tutorial-backdrop')).toBeNull();
    expect(useOnboardingStore.getState().hasSeenTutorial).toBe(true);
    expect(JSON.parse((await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY)) ?? 'null')).toMatchObject({
      state: { hasSeenTutorial: true },
    });

    await fireEvent.press(screen.getByTestId('mini-card-casual'));
    expect(router.push).toHaveBeenCalledWith({ pathname: '/deck/[deckId]', params: { deckId: 'casual' } });
  });

  it('is not shown once seen', async () => {
    useOnboardingStore.setState({ hasSeenTutorial: true });
    await render(<HomeScreen />);
    expect(screen.queryByTestId('tutorial-backdrop')).toBeNull();
  });
});

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useOnboardingStore.setState({ hasSeenTutorial: true, readFailed: false });
  });

  it('renders exactly the 8 categories as mini cards, in data.json order', async () => {
    await render(<HomeScreen />);
    const ids = getCategories().map((c) => c.id);
    expect(ids).toHaveLength(8);
    for (const category of getCategories()) {
      expect(screen.getByTestId(`mini-card-${category.id}`)).toBeTruthy();
      expect(screen.getByText(category.description)).toBeTruthy();
    }
    const rendered = screen.getAllByTestId(/^mini-card-/).map((el) => String(el.props.testID).replace('mini-card-', ''));
    expect(rendered).toEqual(ids);
  });

  it('opens the deck of the pressed category', async () => {
    await render(<HomeScreen />);
    await fireEvent.press(screen.getByTestId('mini-card-viagens'));
    expect(router.push).toHaveBeenCalledWith({ pathname: '/deck/[deckId]', params: { deckId: 'viagens' } });
  });

  it('shows the "Tudo Misturado" hero card before the grid and opens the mixed deck (004)', async () => {
    await render(<HomeScreen />);
    const hero = screen.getByTestId('mixed-hero-card');
    const all = screen.getAllByTestId(/^(mixed-hero-card|mini-card-)/).map((el) => el.props.testID);
    expect(all[0]).toBe('mixed-hero-card');
    await fireEvent.press(hero);
    expect(router.push).toHaveBeenCalledWith({ pathname: '/deck/[deckId]', params: { deckId: 'mixed' } });
  });

  it('has a Favoritos entry', async () => {
    await render(<HomeScreen />);
    await fireEvent.press(screen.getByLabelText('Favoritos'));
    expect(router.push).toHaveBeenCalledWith('/favorites');
  });
});

describe('HomeScreen — mix filter (006)', () => {
  const toggle = async (id: string) => {
    await act(async () => {
      fireEvent(screen.getByTestId(`mix-filter-switch-${id}`), 'valueChange');
    });
  };
  const open = async () => {
    await act(async () => {
      fireEvent.press(screen.getByTestId('mix-filter-button'));
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useOnboardingStore.setState({ hasSeenTutorial: true, readFailed: false });
    useMixFilterStore.setState({ excluded: [] });
  });

  it('switching off 2 categories and saving filters the mix and shows "6 de 8 categorias"', async () => {
    await render(<HomeScreen />);
    expect(screen.queryByTestId('mix-filter-summary')).toBeNull();
    await open();
    expect(router.push).not.toHaveBeenCalled();
    await toggle('happy-hour');
    await toggle('dilemas');
    await act(async () => {
      fireEvent.press(screen.getByTestId('mix-filter-save'));
    });
    expect(screen.queryByTestId('mix-filter-sheet')).toBeNull();
    expect(useMixFilterStore.getState().excluded).toEqual(['happy-hour', 'dilemas']);
    expect(screen.getByTestId('mix-filter-summary')).toHaveTextContent('6 de 8 categorias');

    await open();
    expect(screen.getByTestId('mix-filter-switch-dilemas').props.value).toBe(false);
    expect(screen.getByTestId('mix-filter-switch-casais').props.value).toBe(true);
  });

  it('closing without saving discards the changes', async () => {
    await render(<HomeScreen />);
    await open();
    await toggle('casais');
    await act(async () => {
      fireEvent.press(screen.getByTestId('mix-filter-backdrop', { includeHiddenElements: true }));
    });
    expect(useMixFilterStore.getState().excluded).toEqual([]);
    await open();
    expect(screen.getByTestId('mix-filter-switch-casais').props.value).toBe(true);
  });

  it('with only 1 category on, Salvar is disabled until another is turned back on (US2)', async () => {
    await render(<HomeScreen />);
    await open();
    for (const { id } of getCategories().slice(1)) await toggle(id);
    expect(screen.getByTestId('mix-filter-save')).toBeDisabled();
    expect(screen.getByTestId('mix-filter-minimum')).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByTestId('mix-filter-save'));
    });
    expect(useMixFilterStore.getState().excluded).toEqual([]);

    await toggle(getCategories()[1].id);
    expect(screen.getByTestId('mix-filter-save')).toBeEnabled();
    expect(screen.queryByTestId('mix-filter-minimum')).toBeNull();
  });
});
