import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { getCategories, getQuestionsByCategory } from '../../data/content';
import { getCategoryVisual } from '../../theme';
import { CardFront } from '../CardFront';
import { CategoryBadge } from '../CategoryBadge';

describe('CategoryBadge (004)', () => {
  it.each(getCategories().map((c) => [c.id, c] as const))('%s: content icon, title and color', async (_, category) => {
    const visual = getCategoryVisual(category);
    await render(<CategoryBadge category={category} visual={visual} />);
    expect(StyleSheet.flatten(screen.getByTestId('category-badge').props.style).backgroundColor).toBe(
      category.color.toUpperCase(),
    );
    expect(screen.getByTestId(`icon-${category.icon}`)).toBeTruthy();
    const title = screen.getByTestId('category-badge-title');
    expect(title).toHaveTextContent(category.title);
    expect(StyleSheet.flatten(title.props.style).color).toBe(visual.onColor);
    expect(title.props.numberOfLines).toBe(1);
    expect(title.props.maxFontSizeMultiplier).toBe(1.3);
  });
});

describe('CardFront showOriginBadge (004)', () => {
  const category = getCategories()[2];
  const visual = getCategoryVisual(category);
  const [question] = getQuestionsByCategory(category.id);

  it('adds the badge while keeping the corner icon, footer, star and question', async () => {
    await render(<CardFront category={category} visual={visual} question={question} isFavorite width={300} showOriginBadge />);
    expect(screen.getByTestId('category-badge')).toBeTruthy();
    expect(screen.getAllByTestId(`icon-${category.icon}`)).toHaveLength(2);
    expect(screen.getByTestId('card-front-footer')).toHaveTextContent(category.title.toUpperCase());
    expect(screen.getByTestId('card-front-question')).toHaveTextContent(question.text);
    expect(screen.getByTestId('favorite-indicator')).toBeTruthy();
  });

  it('has no badge by default (category decks unchanged)', async () => {
    await render(<CardFront category={category} visual={visual} question={question} isFavorite={false} width={300} />);
    expect(screen.queryByTestId('category-badge')).toBeNull();
  });
});
