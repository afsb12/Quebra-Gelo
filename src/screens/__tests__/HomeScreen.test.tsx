import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import { getCategories } from '../../data/content';
import { HomeScreen } from '../HomeScreen';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn(), canGoBack: jest.fn(() => true) },
}));

describe('HomeScreen', () => {
  beforeEach(() => jest.clearAllMocks());

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
    expect(router.push).toHaveBeenCalledWith({ pathname: '/deck/[categoryId]', params: { categoryId: 'viagens' } });
  });

  it('has a Favoritos entry', async () => {
    await render(<HomeScreen />);
    await fireEvent.press(screen.getByLabelText('Favoritos'));
    expect(router.push).toHaveBeenCalledWith('/favorites');
  });
});
