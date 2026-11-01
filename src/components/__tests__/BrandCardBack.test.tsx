import { render, screen } from '@testing-library/react-native';
import { StyleSheet, Text } from 'react-native';

import { tokens } from '../../theme';
import { BrandCardBack } from '../BrandCardBack';

describe('BrandCardBack (004)', () => {
  it.each(['full', 'mini'] as const)('%s: dark face with the app symbol and no text at all', async (variant) => {
    await render(<BrandCardBack width={300} variant={variant} />);
    expect(screen.getByTestId('brand-symbol')).toBeTruthy();
    expect(StyleSheet.flatten(screen.getByTestId('brand-card-back').props.style).backgroundColor).toBe(
      tokens.colors.appBackground,
    );
    // No host Text node anywhere in the tree: nothing to read before the flip.
    expect(JSON.stringify(screen.toJSON())).not.toContain('"type":"Text"');
  });

  it('wide: renders the caller content instead of the centered symbol', async () => {
    await render(
      <BrandCardBack width={300} height={120} variant="wide">
        <Text>conteúdo</Text>
      </BrandCardBack>,
    );
    expect(screen.getByText('conteúdo')).toBeTruthy();
    expect(screen.queryByTestId('brand-symbol')).toBeNull();
  });
});
