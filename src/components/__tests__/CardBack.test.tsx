import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { getCategory, getQuestionsByCategory } from '../../data/content';
import type { CategoryId } from '../../data/types';
import { CATEGORY_PATTERNS, getCategoryVisual, type PatternKind } from '../../theme';
import { CardBack, titleLines } from '../CardBack';
import { CategoryPattern } from '../CategoryPattern';

const load = (id: CategoryId) => {
  const category = getCategory(id);
  if (!category) throw new Error(id);
  return { category, visual: getCategoryVisual(category) };
};

describe('CardBack', () => {
  it('renders the uppercase title in onColor and the icon', async () => {
    const { category, visual } = load('casual');
    await render(<CardBack category={category} visual={visual} width={272} variant="full" />);
    const title = screen.getByTestId('card-back-title');
    expect(title).toHaveTextContent('DESCONTRAÍDO');
    expect(StyleSheet.flatten(title.props.style).color).toBe(visual.onColor);
  });

  it('verso não mostra a pergunta', async () => {
    const { category, visual } = load('profundo');
    await render(<CardBack category={category} visual={visual} width={272} variant="full" />);
    for (const question of getQuestionsByCategory('profundo')) {
      expect(screen.queryByText(question.text)).toBeNull();
    }
  });

  it('keeps short connectors with the next word', () => {
    expect(titleLines('Nostalgia e Infância')).toEqual(['NOSTALGIA', 'E INFÂNCIA']);
    expect(titleLines('Happy Hour')).toEqual(['HAPPY', 'HOUR']);
  });
});

describe('CategoryPattern', () => {
  it.each(Object.values(CATEGORY_PATTERNS) as PatternKind[])('renders the %s pattern', async (kind) => {
    await expect(
      render(<CategoryPattern kind={kind} color="#3D3FA6" onColor="#FFFFFF" width={200} height={280} />),
    ).resolves.toBeDefined();
  });
});
