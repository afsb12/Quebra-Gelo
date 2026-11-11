import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { getCategory, getQuestionsByCategory } from '../../data/content';
import { getCategoryVisual } from '../../theme';
import { DeckComplete } from '../DeckComplete';
import { FavoriteListItem } from '../FavoriteListItem';

const category = getCategory('nostalgia');
if (!category) throw new Error('nostalgia');
const visual = getCategoryVisual(category);
const [question] = getQuestionsByCategory('nostalgia');

describe('category identity is consistent across the app', () => {
  it('FavoriteListItem shows the category icon and name in the category colors', async () => {
    await render(<FavoriteListItem question={question} category={category} visual={visual} onRemove={jest.fn()} />);
    expect(screen.getByText(question.text)).toBeTruthy();
    expect(screen.getByTestId(`icon-${visual.icon}`)).toBeTruthy();
    expect(StyleSheet.flatten(screen.getByTestId('favorite-category').props.style).color).toBe(visual.ink);
    // 017: the side stripe is gone; the header carries the identity, like the card front.
    expect(screen.queryByTestId('favorite-accent')).toBeNull();
    expect(screen.getByLabelText(`Remover dos favoritos: ${question.text}`)).toBeTruthy();
  });

  it('DeckComplete uses the category color', async () => {
    await render(<DeckComplete deckTitle={category.title} visual={visual} onReshuffle={jest.fn()} onChooseAnother={jest.fn()} />);
    expect(StyleSheet.flatten(screen.getByTestId('deck-complete').props.style).backgroundColor).toBe(visual.color);
  });
});
