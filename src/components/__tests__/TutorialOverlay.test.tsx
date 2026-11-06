import { fireEvent, render, screen, within } from '@testing-library/react-native';

import { strings } from '../../i18n/strings';
import { TutorialOverlay } from '../TutorialOverlay';

const hints = [
  ['tutorial-hint-swipe', 'Deslize para os lados para a próxima carta'],
  ['tutorial-hint-flip', 'Toque na carta para revelar a pergunta'],
  ['tutorial-hint-deck', 'Toque em um baralho para começar'],
] as const;

describe('TutorialOverlay (005)', () => {
  it('renders nothing when not visible', async () => {
    await render(<TutorialOverlay visible={false} onClose={jest.fn()} />);
    expect(screen.queryByTestId('tutorial-backdrop')).toBeNull();
  });

  it('shows exactly the 3 short hints, their icons and the face-down brand card', async () => {
    await render(<TutorialOverlay visible onClose={jest.fn()} />);
    expect(screen.getAllByTestId(/^tutorial-hint-/)).toHaveLength(3);
    for (const [id, text] of hints) {
      expect(within(screen.getByTestId(id)).getByText(text)).toBeTruthy();
      expect(text.length).toBeLessThanOrEqual(50);
    }
    for (const icon of ['chevron-left', 'chevron-right', 'gesture-tap', 'chevron-double-down']) {
      expect(screen.getByTestId(`tutorial-icon-${icon}`)).toBeTruthy();
    }
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
