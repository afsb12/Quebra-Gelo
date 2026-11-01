import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { getCategory, getQuestionsByCategory } from '../../data/content';
import { getCategoryVisual, questionBaseSize } from '../../theme';
import { CardFront } from '../CardFront';

const category = getCategory('viagens');
if (!category) throw new Error('viagens');
const visual = getCategoryVisual(category);
const [question] = getQuestionsByCategory('viagens');

describe('CardFront', () => {
  it('renders the question, footer and icon in the category ink', async () => {
    await render(<CardFront category={category} visual={visual} question={question} isFavorite={false} width={300} />);
    expect(screen.getByTestId('card-front-question')).toHaveTextContent(question.text);
    const footer = screen.getByTestId('card-front-footer');
    expect(footer).toHaveTextContent('VIAGENS E AVENTURAS');
    expect(StyleSheet.flatten(footer.props.style).color).toBe(visual.ink);
  });

  it('shows the star indicator only when favorited, and it is not pressable', async () => {
    const { rerender } = await render(
      <CardFront category={category} visual={visual} question={question} isFavorite={false} width={300} />,
    );
    expect(screen.queryByTestId('favorite-indicator')).toBeNull();
    await rerender(<CardFront category={category} visual={visual} question={question} isFavorite width={300} />);
    const indicator = screen.getByTestId('favorite-indicator');
    expect(indicator.props.pointerEvents).toBe('none');
    expect(indicator.props.onPress).toBeUndefined();
  });

  it('uses questionBaseSize when the text fits', async () => {
    await render(<CardFront category={category} visual={visual} question={question} isFavorite={false} width={300} />);
    const style = StyleSheet.flatten(screen.getByTestId('card-front-question').props.style);
    expect(style.fontSize).toBe(questionBaseSize(question.text));
  });
});
