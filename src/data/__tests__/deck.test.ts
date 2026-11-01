import { advance, createDeck, currentQuestionId, isCompleted, shuffle } from '../deck';

/** Deterministic pseudo-random generator for reproducible shuffles. */
const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const IDS = Array.from({ length: 20 }, (_, i) => `casual-${String(i + 1).padStart(3, '0')}`);

describe('shuffle', () => {
  it('returns a permutation and does not mutate the input', () => {
    const input = [...IDS];
    const result = shuffle(input, seeded(42));
    expect(result).toHaveLength(input.length);
    expect([...result].sort()).toEqual([...IDS].sort());
    expect(input).toEqual(IDS);
  });

  it('is deterministic with an injected random source', () => {
    expect(shuffle(IDS, seeded(7))).toEqual(shuffle(IDS, seeded(7)));
  });
});

describe('deck lifecycle', () => {
  it('createDeck starts at cursor 0 with a permutation of the ids', () => {
    const deck = createDeck(IDS, seeded(1));
    expect(deck.cursor).toBe(0);
    expect([...deck.order].sort()).toEqual([...IDS].sort());
  });

  it('advance moves the cursor and never goes beyond order.length', () => {
    let deck = createDeck(['a', 'b'], seeded(3));
    deck = advance(deck);
    expect(deck.cursor).toBe(1);
    deck = advance(advance(advance(deck)));
    expect(deck.cursor).toBe(2);
  });

  it('currentQuestionId is undefined and isCompleted true at the end', () => {
    let deck = createDeck(['a'], seeded(5));
    expect(currentQuestionId(deck)).toBe('a');
    expect(isCompleted(deck)).toBe(false);
    deck = advance(deck);
    expect(currentQuestionId(deck)).toBeUndefined();
    expect(isCompleted(deck)).toBe(true);
  });

  it('não repete perguntas: walking a full deck yields every id exactly once', () => {
    let deck = createDeck(IDS, seeded(99));
    const seen: string[] = [];
    while (!isCompleted(deck)) {
      const id = currentQuestionId(deck);
      if (id) seen.push(id);
      deck = advance(deck);
    }
    expect(seen).toHaveLength(IDS.length);
    expect(new Set(seen).size).toBe(IDS.length);
  });
});
