import { advance, canGoBack, createDeck, currentQuestionId, goBack, isCompleted, shuffle } from '../deck';

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

describe('navigation (009)', () => {
  const walk = (deck: ReturnType<typeof createDeck>, steps: number) => {
    let d = deck;
    for (let i = 0; i < steps; i += 1) d = advance(d);
    return d;
  };

  it('canGoBack is false on the first card and once completed', () => {
    const deck = createDeck(IDS, seeded(1));
    expect(canGoBack(deck)).toBe(false);
    expect(canGoBack(advance(deck))).toBe(true);
    expect(canGoBack(walk(deck, IDS.length))).toBe(false);
  });

  it('goBack on the first card returns the same object', () => {
    const deck = createDeck(IDS, seeded(1));
    expect(goBack(deck)).toBe(deck);
  });

  it('goBack moves the cursor and keeps furthest; advancing replays the history in order', () => {
    const deck = walk(createDeck(IDS, seeded(2)), 3);
    expect(deck).toMatchObject({ cursor: 3, furthest: 3 });
    const back = goBack(goBack(deck));
    expect(back).toMatchObject({ cursor: 1, furthest: 3 });
    const replay1 = advance(back);
    const replay2 = advance(replay1);
    expect(currentQuestionId(replay1)).toBe(deck.order[2]);
    expect(currentQuestionId(replay2)).toBe(deck.order[3]);
    expect(replay2.furthest).toBe(3);
    expect(advance(replay2).furthest).toBe(4);
  });

  it('any mix of next/back deals every never-shown card once, in deck order', () => {
    const random = seeded(77);
    let deck = createDeck(IDS, seeded(5));
    const firstSeen: string[] = [];
    let guard = 0;
    while (!isCompleted(deck) && guard < 1000) {
      const id = currentQuestionId(deck);
      if (id && !firstSeen.includes(id)) firstSeen.push(id);
      deck = random() < 0.35 ? goBack(deck) : advance(deck);
      guard += 1;
    }
    expect(isCompleted(deck)).toBe(true);
    expect(firstSeen).toEqual(deck.order);
  });

});
