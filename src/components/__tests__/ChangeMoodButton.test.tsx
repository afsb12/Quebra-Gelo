import { fireEvent, render, screen } from '@testing-library/react-native';

import { ChangeMoodButton } from '../ChangeMoodButton';

describe('ChangeMoodButton (011)', () => {
  it('is an accessible button that calls onPress once', async () => {
    const onPress = jest.fn();
    await render(<ChangeMoodButton disabled={false} onPress={onPress} />);
    const button = screen.getByTestId('change-mood-button');
    expect(button.props.accessibilityRole).toBe('button');
    expect(button.props.accessibilityLabel).toBe('Mudar o clima: próxima carta de outra categoria');
    fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('never calls onPress while disabled', async () => {
    const onPress = jest.fn();
    await render(<ChangeMoodButton disabled onPress={onPress} />);
    const button = screen.getByTestId('change-mood-button');
    expect(button).toBeDisabled();
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});
