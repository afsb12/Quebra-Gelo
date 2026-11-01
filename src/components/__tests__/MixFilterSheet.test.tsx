import { fireEvent, render, screen } from '@testing-library/react-native';

import { getCategories } from '../../data/content';
import { getCategoryVisual } from '../../theme';
import { MixFilterSheet, type MixFilterSheetProps } from '../MixFilterSheet';

const options = getCategories().map((category) => ({ category, visual: getCategoryVisual(category) }));
const ids = options.map((o) => o.category.id);

const setup = async (props: Partial<MixFilterSheetProps> = {}) => {
  const handlers = { onToggle: jest.fn(), onSave: jest.fn(), onClose: jest.fn() };
  await render(<MixFilterSheet visible options={options} selected={ids} canSave {...handlers} {...props} />);
  return handlers;
};

describe('MixFilterSheet (006)', () => {
  it('renders nothing when closed', async () => {
    await setup({ visible: false });
    expect(screen.queryByTestId('mix-filter-sheet')).toBeNull();
  });

  it('lists the 8 categories with labeled switches reflecting the selection', async () => {
    await setup({ selected: ids.filter((id) => id !== 'casais') });
    expect(screen.getByText('Categorias da mistura')).toBeTruthy();
    for (const { category } of options) {
      const sw = screen.getByTestId(`mix-filter-switch-${category.id}`);
      expect(sw.props.value).toBe(category.id !== 'casais');
      expect(sw.props.accessibilityLabel).toBe(category.title);
    }
  });

  it('toggling a switch reports the category; Salvar calls onSave', async () => {
    const { onToggle, onSave } = await setup();
    await fireEvent(screen.getByTestId('mix-filter-switch-dilemas'), 'valueChange', false);
    expect(onToggle).toHaveBeenCalledWith('dilemas');
    await fireEvent.press(screen.getByTestId('mix-filter-save'));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('mix-filter-minimum')).toBeNull();
  });

  it('below the minimum: message shown, Salvar disabled and inert (US2)', async () => {
    const { onSave } = await setup({ selected: ['casais'], canSave: false });
    expect(screen.getByTestId('mix-filter-minimum')).toHaveTextContent('Escolha pelo menos 2 categorias');
    expect(screen.getByTestId('mix-filter-save')).toBeDisabled();
    await fireEvent.press(screen.getByTestId('mix-filter-save'));
    expect(onSave).not.toHaveBeenCalled();
  });

  it('tap outside and Android back discard (onClose)', async () => {
    const { onClose } = await setup();
    await fireEvent.press(screen.getByTestId('mix-filter-backdrop', { includeHiddenElements: true }));
    await fireEvent(screen.getByTestId('mix-filter-sheet'), 'requestClose');
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
