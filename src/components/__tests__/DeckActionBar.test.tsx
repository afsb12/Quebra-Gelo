import { fireEvent, render, screen } from '@testing-library/react-native';

import { DeckActionBar, type DeckActionBarProps } from '../DeckActionBar';
import { DeckProgress } from '../DeckProgress';

const setup = async (overrides: Partial<DeckActionBarProps> = {}) => {
  const props: DeckActionBarProps = {
    canGoBack: true,
    favoriteActive: false,
    favoriteDisabled: false,
    onPrevious: jest.fn(),
    onToggleFavorite: jest.fn(),
    onNext: jest.fn(),
    ...overrides,
  };
  await render(<DeckActionBar {...props} />);
  return props;
};

describe('DeckActionBar (016)', () => {
  it('shows Anterior / Favoritar / Próxima and reports each press', async () => {
    const props = await setup();
    expect(screen.getByText('Anterior')).toBeTruthy();
    expect(screen.getByText('Favoritar')).toBeTruthy();
    expect(screen.getByText('Próxima')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('deck-next-button'));
    await fireEvent.press(screen.getByTestId('deck-previous-button'));
    await fireEvent.press(screen.getByTestId('favorite-button'));
    expect(props.onNext).toHaveBeenCalledTimes(1);
    expect(props.onPrevious).toHaveBeenCalledTimes(1);
    expect(props.onToggleFavorite).toHaveBeenCalledTimes(1);
  });

  it('disables Anterior on the first card and Favoritar while face down', async () => {
    const props = await setup({ canGoBack: false, favoriteDisabled: true });
    expect(screen.getByTestId('deck-previous-button')).toBeDisabled();
    expect(screen.getByTestId('favorite-button')).toBeDisabled();
    expect(screen.getByTestId('deck-next-button')).toBeEnabled();
    await fireEvent.press(screen.getByTestId('deck-previous-button'));
    expect(props.onPrevious).not.toHaveBeenCalled();
  });

  it('labels the side buttons for screen readers', async () => {
    await setup();
    expect(screen.getByLabelText('Carta anterior')).toBeTruthy();
    expect(screen.getByLabelText('Próxima carta')).toBeTruthy();
  });
});

describe('DeckProgress (016)', () => {
  it('fills index/total in the given color and exposes the value', async () => {
    await render(<DeckProgress index={3} total={30} color="#8F91F0" />);
    const bar = screen.getByTestId('deck-progress');
    expect(bar.props.accessibilityValue).toEqual({ min: 0, max: 30, now: 3 });
    expect(screen.getByTestId('deck-progress-fill')).toHaveStyle({ width: '10%', backgroundColor: '#8F91F0' });
  });
});
