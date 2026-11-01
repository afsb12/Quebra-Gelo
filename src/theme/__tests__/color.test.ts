import { contrastRatio, inkOnCream, pickOnColor } from '../color';
import { tokens } from '../tokens';

describe('contrastRatio (WCAG 2.1)', () => {
  it('is 21 for white on black and 1 for identical colors', () => {
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 5);
    expect(contrastRatio('#3D3FA6', '#3D3FA6')).toBeCloseTo(1, 5);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#F5C230', '#1B1A22')).toBeCloseTo(contrastRatio('#1B1A22', '#F5C230'), 10);
  });
});

describe('pickOnColor', () => {
  it('picks the light or dark text color with the higher contrast, always ≥ 4.5:1', () => {
    expect(pickOnColor('#F5C230')).toBe(tokens.colors.onColorDark);
    expect(pickOnColor('#3D3FA6')).toBe(tokens.colors.onColorLight);
    for (const color of ['#F5C230', '#3D3FA6', '#C41E3A', '#F27A1F', '#7A3EB1', '#14A39E', '#F28CB4', '#167A4C']) {
      expect(contrastRatio(pickOnColor(color), color)).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('inkOnCream', () => {
  it('keeps colors that already reach 4.5:1 on cream', () => {
    expect(inkOnCream('#3D3FA6')).toBe('#3D3FA6');
  });

  it('darkens light colors until they reach 4.5:1 on cream', () => {
    for (const color of ['#F5C230', '#F27A1F', '#14A39E', '#F28CB4', '#FFFFFF']) {
      const ink = inkOnCream(color);
      expect(contrastRatio(ink, tokens.colors.cream)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
