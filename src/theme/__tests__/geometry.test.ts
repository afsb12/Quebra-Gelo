import { getCardGeometry, questionBaseSize } from '../geometry';
import { tokens } from '../tokens';

describe('getCardGeometry', () => {
  it('uses min(screenWidth − 48, 360) and the 5:7 ratio', () => {
    const small = getCardGeometry({ width: 320, height: 800 }, 0);
    expect(small.width).toBe(272);
    expect(small.height).toBeCloseTo((272 * 7) / 5, 5);
    const large = getCardGeometry({ width: 1024, height: 1400 }, 0);
    expect(large.width).toBe(tokens.card.maxWidth);
  });

  it('shrinks the card when the height does not fit the available space', () => {
    const g = getCardGeometry({ width: 400, height: 600 }, 200);
    expect(g.height).toBeLessThanOrEqual(400);
    expect(g.width / g.height).toBeCloseTo(tokens.card.ratio, 5);
  });

  it('radius is 6% of width and mini cards fit 2 columns at 320pt', () => {
    const g = getCardGeometry({ width: 320, height: 800 }, 0);
    expect(g.radius).toBeCloseTo(0.06 * g.width, 5);
    expect(g.miniWidth).toBe((320 - 48 - 16) / 2);
    expect(g.miniWidth * 2 + 16 + 48).toBeLessThanOrEqual(320);
  });
});

describe('questionBaseSize', () => {
  it('maps length to 26 / 23 / 21', () => {
    expect(questionBaseSize('a'.repeat(120))).toBe(26);
    expect(questionBaseSize('a'.repeat(121))).toBe(23);
    expect(questionBaseSize('a'.repeat(160))).toBe(23);
    expect(questionBaseSize('a'.repeat(161))).toBe(21);
    expect(questionBaseSize('a'.repeat(200))).toBe(21);
  });
});
