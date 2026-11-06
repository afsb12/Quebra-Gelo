import { fireEvent, render, screen, within } from '@testing-library/react-native';

import { strings } from '../../i18n/strings';
import { TutorialOverlay } from '../TutorialOverlay';

const hints = [
  ['tutorial-hint-next', 'Deslize para a esquerda para passar a carta'],
  ['tutorial-hint-back', 'Deslize para a direita para voltar à carta anterior'],
  ['tutorial-hint-flip', 'Toque na carta para revelar a pergunta'],
  ['tutorial-hint-deck', 'Toque em um baralho para começar'],
] as const;

describe('TutorialOverlay (005)', () => {
  it('renders nothing when not visible', async () => {
    await render(<TutorialOverlay visible={false} onClose={jest.fn()} />);
    expect(screen.queryByTestId('tutorial-backdrop')).toBeNull();
  });

  it('shows exactly the 4 short directional hints, in reading order, with their icons (009)', async () => {
    await render(<TutorialOverlay visible onClose={jest.fn()} />);
    expect(screen.getAllByTestId(/^tutorial-hint-/).map((h) => h.props.testID)).toEqual(hints.map(([id]) => id));
    for (const [id, text] of hints) {
      expect(within(screen.getByTestId(id)).getByText(text)).toBeTruthy();
      expect(text.length).toBeLessThanOrEqual(55);
    }
    for (const icon of ['chevron-left', 'chevron-right', 'gesture-tap', 'chevron-double-down']) {
      expect(screen.getByTestId(`tutorial-icon-${icon}`)).toBeTruthy();
    }
    expect(within(screen.getByTestId('tutorial-card')).getByTestId('tutorial-icon-gesture-tap')).toBeTruthy();
    expect(screen.getByTestId('brand-card-back')).toBeTruthy();
    expect(screen.getByTestId('tutorial-content').props.accessibilityViewIsModal).toBe(true);
    expect(screen.getByLabelText(strings.tutorial.skipLabel)).toBeTruthy();
  });

  it('pressing the example card does not close the tutorial', async () => {
    const onClose = jest.fn();
    await render(<TutorialOverlay visible onClose={onClose} />);
    await fireEvent.press(screen.getByTestId('tutorial-card'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it.each([
    ['"Pular"', 'tutorial-skip'],
    ['a tap outside the card', 'tutorial-backdrop'],
  ])('%s closes it', async (_, testID) => {
    const onClose = jest.fn();
    await render(<TutorialOverlay visible onClose={onClose} />);
    await fireEvent.press(screen.getByTestId(testID));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Android back (onRequestClose) closes it', async () => {
    const onClose = jest.fn();
    await render(<TutorialOverlay visible onClose={onClose} />);
    await fireEvent(screen.getByTestId('tutorial-modal'), 'requestClose');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
