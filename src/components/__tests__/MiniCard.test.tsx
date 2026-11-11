import { fireEvent, render, screen } from '@testing-library/react-native';

import { getCategory } from '../../data/content';
import { getCategoryVisual } from '../../theme';
import { MiniCard } from '../MiniCard';

const category = getCategory('happy-hour');
if (!category) throw new Error('happy-hour');
const visual = getCategoryVisual(category);

describe('MiniCard', () => {
  it('renders only the mini card back, whose face prints the name (015)', async () => {
    await render(<MiniCard category={category} visual={visual} width={106} onPress={jest.fn()} />);
    expect(screen.getByTestId('card-back-title', { includeHiddenElements: true })).toHaveTextContent('HAPPY\nHOUR');
    expect(screen.queryByText('Happy Hour')).toBeNull();
    expect(screen.queryByText(category.description)).toBeNull();
  });

  it('is one pressable labelled "<title>. <description>" that reports the category id', async () => {
    const onPress = jest.fn();
    await render(<MiniCard category={category} visual={visual} width={128} onPress={onPress} />);
    const button = screen.getByRole('button');
    expect(button.props.accessibilityLabel).toBe(`Happy Hour. ${category.description}`);
    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledWith('happy-hour');
  });
});
