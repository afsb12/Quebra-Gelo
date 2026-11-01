import { getQuestionsByCategory } from '../../data/content';
import { CATEGORY_IDS } from '../../data/types';
import { DECK_RESERVED_HEIGHT, estimateTextHeight, getCardGeometry, questionFit } from '../geometry';
import { tokens } from '../tokens';

/** SC-003 (002): every question fits the card at ≥ 20pt on a 320×568 phone at font scale 1.0. */
describe('question text fit on a 320×568 viewport', () => {
  const geometry = getCardGeometry({ width: 320, height: 568 }, DECK_RESERVED_HEIGHT);

  it.each(CATEGORY_IDS)('longest %s question fits without going below 20pt', (id) => {
    const longest = [...getQuestionsByCategory(id)].sort((a, b) => b.text.length - a.text.length)[0];
    const fit = questionFit(longest.text, geometry.textBox.width, geometry.textBox.height, 1);
    expect(fit.renderedSize).toBeGreaterThanOrEqual(tokens.type.minQuestionSize);
    expect(fit.fits).toBe(true);
    expect(estimateTextHeight(longest.text, geometry.textBox.width, fit.renderedSize)).toBeLessThanOrEqual(
      geometry.textBox.height,
    );
  });

  it('a 200-character question still fits at ≥ 20pt', () => {
    const text =
      'Se você pudesse passar um dia inteiro com qualquer pessoa, de qualquer época, para conversar sobre a vida, os sonhos e os medos, quem escolheria e qual seria a primeira pergunta que faria a ela?';
    expect(text.length).toBeLessThanOrEqual(200);
    const fit = questionFit(text, geometry.textBox.width, geometry.textBox.height, 1);
    expect(fit.renderedSize).toBeGreaterThanOrEqual(20);
    expect(fit.fits).toBe(true);
  });
});
