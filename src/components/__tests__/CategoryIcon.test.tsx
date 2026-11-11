import { render, screen } from '@testing-library/react-native';

import { CategoryIcon } from '../CategoryIcon';

type JsonNode = { type: string; props: Record<string, unknown>; children: (JsonNode | string)[] | null };

/** Host `Path` elements in the rendered tree (svg primitives are mocked as hosts). */
const findPaths = (node: unknown, found: JsonNode[] = []): JsonNode[] => {
  if (Array.isArray(node)) {
    for (const child of node) findPaths(child, found);
  } else if (node && typeof node === 'object' && 'type' in node) {
    const json = node as JsonNode;
    if (json.type === 'Path') found.push(json);
    for (const child of json.children ?? []) findPaths(child, found);
  }
  return found;
};

describe('CategoryIcon (014)', () => {
  it('draws the custom beer toast as a stroke-only SVG in the given size and color', async () => {
    await render(<CategoryIcon name="beer-toast" size={40} color="#1B1A22" />);
    const svg = screen.getByTestId('icon-beer-toast', { includeHiddenElements: true });
    expect(svg.props).toMatchObject({
      width: 40,
      height: 40,
      viewBox: '0 0 24 24',
      accessibilityElementsHidden: true,
      importantForAccessibility: 'no-hide-descendants',
    });

    const paths = findPaths(screen.toJSON());
    expect(paths).toHaveLength(3);
    for (const path of paths) {
      expect(path.props).toMatchObject({ fill: 'none', stroke: '#1B1A22', strokeWidth: 2, strokeLinecap: 'round' });
    }
  });

  it('falls back to the MaterialCommunityIcons glyph for any other name', async () => {
    await render(<CategoryIcon name="glass-flute" size={28} color="#D71100" />);
    expect(screen.getByTestId('icon-glass-flute').props).toMatchObject({ size: 28, color: '#D71100' });
    expect(findPaths(screen.toJSON())).toHaveLength(0);
  });
});
