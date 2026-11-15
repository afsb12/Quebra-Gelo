import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { HERO_LAYOUT, HERO_RATIO, MixedHeroCard, heroHeight } from '../MixedHeroCard';

const style = (testID: string) => StyleSheet.flatten(screen.getByTestId(testID).props.style);

describe('MixedHeroCard (004/006/015/019)', () => {
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

  it('the corner filter button opens the filter and never starts the game', async () => {
    const onPress = jest.fn();
    const onOpenFilter = jest.fn();
    await render(<MixedHeroCard width={340} onPress={onPress} onOpenFilter={onOpenFilter} filterLabel="10 categorias" />);
    const button = screen.getByTestId('mix-filter-button');
    expect(button.props.accessibilityLabel).toBe('Escolher categorias da mistura: 10 categorias');
    expect(screen.getByTestId('icon-cog-outline')).toBeTruthy();
    await fireEvent.press(button);
    expect(onOpenFilter).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('places the filter button alone in the top-right corner with a 10 pt hit slop (019 FR-005)', async () => {
    await render(<MixedHeroCard width={340} onPress={jest.fn()} onOpenFilter={jest.fn()} filterLabel="10 categorias" />);
    expect(style('mix-filter-button')).toMatchObject({ position: 'absolute', top: 14, right: 14, width: 36, height: 36 });
    expect(screen.getByTestId('mix-filter-button').props.hitSlop).toEqual({ top: 10, bottom: 10, left: 10, right: 10 });
  });

  it('pads the content by 20, spaces it by 8 and keeps the title 36 pt off the button (019 FR-003/004/006)', async () => {
    await render(<MixedHeroCard width={272} onPress={jest.fn()} onOpenFilter={jest.fn()} filterLabel="10 categorias" />);
    expect(style('mixed-hero-content')).toMatchObject({ padding: 20, gap: 8 });
    expect(style('mixed-hero-title')).toMatchObject({ paddingRight: 36 });
    // Title column ends before the button: 20 pt padding + 36 pt reserve ≥ 14 pt inset + 36 pt button.
    expect(HERO_LAYOUT.padding + HERO_LAYOUT.titleReserve).toBeGreaterThanOrEqual(HERO_LAYOUT.filterInset + HERO_LAYOUT.filterSize);
  });

  it('keeps the mix summary visible next to "Jogar" (015/019 FR-008)', async () => {
    const view = await render(<MixedHeroCard width={340} onPress={jest.fn()} onOpenFilter={jest.fn()} filterLabel="10 categorias" />);
    expect(screen.getByTestId('mix-filter-summary')).toHaveTextContent('10 categorias');
    await view.rerender(<MixedHeroCard width={340} onPress={jest.fn()} onOpenFilter={jest.fn()} filterLabel="8 de 10 categorias" />);
    expect(screen.getByTestId('mix-filter-summary')).toHaveTextContent('8 de 10 categorias');
  });
});

describe('heroHeight (019 R2)', () => {
  it('never goes below the padded content on narrow screens', () => {
    expect(heroHeight(272)).toBe(176);
  });

  it('follows the ratio on wide cards', () => {
    expect(heroHeight(500)).toBe(Math.round(500 * HERO_RATIO));
  });

  it('grows with the font scale, up to 1.3×', () => {
    expect(heroHeight(272, 1.2)).toBe(Math.round(176 * 1.2));
    expect(heroHeight(272, 2)).toBe(Math.round(176 * 1.3));
    expect(heroHeight(272, 0.8)).toBe(176);
  });
});
