import { fireEvent, render, screen } from '@testing-library/react-native';

import { MixedHeroCard } from '../MixedHeroCard';

describe('MixedHeroCard (004)', () => {
  it('shows the mode name, description and symbol, and reports presses', async () => {
    const onPress = jest.fn();
    await render(<MixedHeroCard width={340} onPress={onPress} />);
    expect(screen.getByText('Tudo Misturado')).toBeTruthy();
    expect(screen.getByText('Todas as categorias num só baralho.')).toBeTruthy();
    expect(screen.getByTestId('brand-symbol')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('mixed-hero-card'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
