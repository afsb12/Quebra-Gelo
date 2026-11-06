import { render, screen } from '@testing-library/react-native';

import { HintLine } from '../HintLine';

describe('HintLine (008)', () => {
  it('shows the hint when there is no toast', async () => {
    await render(<HintLine hint="Toque para virar" />);
    expect(screen.getByText('Toque para virar')).toBeTruthy();
    expect(screen.queryByTestId('deck-toast')).toBeNull();
  });

  it('replaces the hint with the toast pill', async () => {
    await render(<HintLine hint="Toque para virar" toast="Cartas embaralhadas" />);
    expect(screen.getByTestId('deck-toast')).toHaveTextContent('Cartas embaralhadas');
    expect(screen.queryByText('Toque para virar')).toBeNull();
  });
});
