import { fireEvent, render, screen } from '@testing-library/react-native';

import { ReshuffleButton } from '../ReshuffleButton';

describe('ReshuffleButton (008)', () => {
  it('is labelled for screen readers and fires once when enabled', async () => {
    const onPress = jest.fn();
    await render(<ReshuffleButton disabled={false} onPress={onPress} />);
    expect(screen.getByLabelText('Embaralhar as próximas cartas')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('reshuffle-button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire while disabled', async () => {
    const onPress = jest.fn();
    await render(<ReshuffleButton disabled onPress={onPress} />);
    expect(screen.getByTestId('reshuffle-button')).toBeDisabled();
    await fireEvent.press(screen.getByTestId('reshuffle-button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
