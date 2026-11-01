import { SYMBOL } from '../../../scripts/icon/symbol';
import { BRAND_SYMBOL } from '../brand';

describe('BRAND_SYMBOL', () => {
  it('matches the app icon parameters, so the card back and the icon never drift apart', () => {
    expect(BRAND_SYMBOL).toEqual(SYMBOL);
  });
});
