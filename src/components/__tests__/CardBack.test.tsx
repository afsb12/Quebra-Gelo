import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { getCategory, getQuestionsByCategory } from '../../data/content';
import { CATEGORY_IDS, type CategoryId } from '../../data/types';
import { getCategoryVisual } from '../../theme';
import { CardBack, titleLines } from '../CardBack';

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

type JsonNode = { type: string; children: (JsonNode | string)[] | null };

/** Counts host elements by type in the rendered tree (svg primitives are mocked as hosts). */
const countByType = (node: unknown, counts: Record<string, number> = {}): Record<string, number> => {
  if (Array.isArray(node)) {
    for (const child of node) countByType(child, counts);
  } else if (node && typeof node === 'object' && 'type' in node) {
    const { type, children } = node as JsonNode;
    counts[type] = (counts[type] ?? 0) + 1;
    for (const child of children ?? []) countByType(child, counts);
  }
  return counts;
};

describe('CardBack without pattern (003)', () => {
  const cases = CATEGORY_IDS.flatMap((id) => (['full', 'mini'] as const).map((variant) => [id, variant] as const));

  it.each(cases)('%s (%s): flat color + vignette only, no pattern shapes', async (id, variant) => {
    const { category, visual } = load(id);
    await render(<CardBack category={category} visual={visual} width={272} variant={variant} />);
    const counts = countByType(screen.toJSON());
    expect(counts.Circle ?? 0).toBe(0);
    expect(counts.Path ?? 0).toBe(0);
    expect(counts.Rect ?? 0).toBe(1);
    expect(counts.RadialGradient ?? 0).toBe(1);
    expect(StyleSheet.flatten(screen.getByTestId('card-back-face').props.style).backgroundColor).toBe(visual.color);
  });
});
