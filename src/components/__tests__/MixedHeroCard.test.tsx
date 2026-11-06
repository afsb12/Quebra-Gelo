import { fireEvent, render, screen } from '@testing-library/react-native';

import { MixedHeroCard } from '../MixedHeroCard';

describe('MixedHeroCard (004/006)', () => {
  it('shows the mode name, description and symbol, and reports presses', async () => {
    const onPress = jest.fn();
    await render(<MixedHeroCard width={340} onPress={onPress} onOpenFilter={jest.fn()} />);
    expect(screen.getByText('Tudo Misturado')).toBeTruthy();
    expect(screen.getByText('Todas as categorias num só baralho.')).toBeTruthy();
    expect(screen.getByTestId('brand-symbol')).toBeTruthy();
    expect(screen.queryByTestId('mix-filter-summary')).toBeNull();
    await fireEvent.press(screen.getByTestId('mixed-hero-card'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('the filter button opens the filter and never starts the game', async () => {
    const onPress = jest.fn();
    const onOpenFilter = jest.fn();
    await render(<MixedHeroCard width={340} onPress={onPress} onOpenFilter={onOpenFilter} />);
    const button = screen.getByTestId('mix-filter-button');
    expect(button.props.accessibilityLabel).toBe('Escolher categorias da mistura');
    expect(screen.getByTestId('icon-filter-variant')).toBeTruthy();
    await fireEvent.press(button);
    expect(onOpenFilter).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows the summary when the mix is filtered', async () => {
    await render(<MixedHeroCard width={340} onPress={jest.fn()} onOpenFilter={jest.fn()} summary="6 de 8 categorias" />);
    expect(screen.getByTestId('mix-filter-summary')).toHaveTextContent('6 de 8 categorias');
  });
});
