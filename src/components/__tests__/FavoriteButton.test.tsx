import { fireEvent, render, screen } from '@testing-library/react-native';

import { EmptyState } from '../EmptyState';
import { FavoriteButton } from '../FavoriteButton';

describe('FavoriteButton', () => {
  it('labels itself "Favoritar" or "Remover dos favoritos" by state', async () => {
    const { rerender } = await render(<FavoriteButton active={false} disabled={false} onPress={jest.fn()} />);
    expect(screen.getByLabelText('Favoritar')).toBeTruthy();
    await rerender(<FavoriteButton active disabled={false} onPress={jest.fn()} />);
    expect(screen.getByLabelText('Remover dos favoritos')).toBeTruthy();
  });

  it('does not fire when disabled (card face down)', async () => {
    const onPress = jest.fn();
    await render(<FavoriteButton active={false} disabled onPress={onPress} />);
    await fireEvent.press(screen.getByTestId('favorite-button'));
    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByTestId('favorite-button')).toBeDisabled();
  });

  it('fires when enabled', async () => {
    const onPress = jest.fn();
    await render(<FavoriteButton active={false} disabled={false} onPress={onPress} />);
    await fireEvent.press(screen.getByTestId('favorite-button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('EmptyState', () => {
  it('renders title and message', async () => {
    await render(<EmptyState title="Nada aqui" message="Favorite uma pergunta" />);
    expect(screen.getByText('Nada aqui')).toBeTruthy();
    expect(screen.getByText('Favorite uma pergunta')).toBeTruthy();
  });
});
