import { fireEvent, render, screen } from '@testing-library/react-native';

import { MixedHeroCard } from '../MixedHeroCard';

describe('MixedHeroCard (004/006/015)', () => {
  it('shows the mode name, description, symbol and the "Jogar" cue, and reports presses', async () => {
    const onPress = jest.fn();
    await render(<MixedHeroCard width={340} onPress={onPress} onOpenFilter={jest.fn()} filterLabel="10 categorias" />);
    expect(screen.getByText('Tudo Misturado')).toBeTruthy();
    expect(screen.getByText('Todas as categorias num só baralho.')).toBeTruthy();
    expect(screen.getByTestId('brand-symbol')).toBeTruthy();
    expect(screen.getByText('Jogar')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('mixed-hero-card'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('the filter chip shows the mix count, opens the filter and never starts the game', async () => {
    const onPress = jest.fn();
    const onOpenFilter = jest.fn();
    await render(<MixedHeroCard width={340} onPress={onPress} onOpenFilter={onOpenFilter} filterLabel="10 categorias" />);
    const chip = screen.getByTestId('mix-filter-button');
    expect(chip.props.accessibilityLabel).toBe('Escolher categorias da mistura: 10 categorias');
    expect(screen.getByTestId('mix-filter-summary')).toHaveTextContent('10 categorias');
    expect(screen.getByTestId('icon-filter-variant')).toBeTruthy();
    await fireEvent.press(chip);
    expect(onOpenFilter).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows the filtered count', async () => {
    await render(<MixedHeroCard width={340} onPress={jest.fn()} onOpenFilter={jest.fn()} filterLabel="8 de 10 categorias" />);
    expect(screen.getByTestId('mix-filter-summary')).toHaveTextContent('8 de 10 categorias');
  });
});
