import { advance, canGoBack, canReshuffleRemaining, createDeck, currentQuestionId, goBack, isCompleted, remainingCount, reshuffleRemaining, shuffle } from '../deck';

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

describe('reshuffleRemaining (008)', () => {
  const at = (cursor: number, order: readonly string[] = IDS) => ({
    order: [...order],
    cursor,
    furthest: Math.max(0, Math.min(cursor, order.length - 1)),
  });

  it('keeps the shown prefix and cursor, and reorders only the tail', () => {
    const deck = at(3);
    const next = reshuffleRemaining(deck, seeded(11));
    expect(next.cursor).toBe(3);
    expect(next.order).toHaveLength(20);
    expect(next.order.slice(0, 4)).toEqual(deck.order.slice(0, 4));
    expect([...next.order.slice(4)].sort()).toEqual([...deck.order.slice(4)].sort());
    expect(next.order.slice(4)).not.toEqual(deck.order.slice(4));
  });

  it('does not mutate the input', () => {
    const deck = at(3);
    const snapshot = [...deck.order];
    reshuffleRemaining(deck, seeded(2));
    expect(deck.order).toEqual(snapshot);
    expect(deck.cursor).toBe(3);
  });

  it('swaps the last two cards when exactly 2 remain', () => {
    const next = reshuffleRemaining(at(0, ['a', 'b', 'c']), seeded(4));
    expect(next.order).toEqual(['a', 'c', 'b']);
  });

  it.each([() => 0, () => 0.999999])('still changes the order with a constant random source', (random) => {
    const deck = at(0, ['a', 'b', 'c', 'd']);
    const next = reshuffleRemaining(deck, random);
    expect(next.order[0]).toBe('a');
    expect([...next.order].sort()).toEqual(['a', 'b', 'c', 'd']);
    expect(next.order.slice(1)).not.toEqual(['b', 'c', 'd']);
  });

  it.each([18, 19, 20])('returns the same object when fewer than 2 cards remain (cursor %i of 20)', (cursor) => {
    const deck = at(cursor);
    expect(reshuffleRemaining(deck, seeded(1))).toBe(deck);
  });

  it('remainingCount and canReshuffleRemaining', () => {
    expect(remainingCount(at(2))).toBe(17);
    expect(canReshuffleRemaining(at(2))).toBe(true);
    expect(remainingCount(at(18))).toBe(1);
    expect(canReshuffleRemaining(at(18))).toBe(false);
    expect(remainingCount(at(19))).toBe(0);
    expect(canReshuffleRemaining(at(19))).toBe(false);
    expect(remainingCount(at(20))).toBe(0);
    expect(canReshuffleRemaining(at(20))).toBe(false);
  });

  it('always produces a different tail (200 seeded runs)', () => {
    const deck = at(0, ['a', 'b', 'c', 'd', 'e']);
    for (let seed = 1; seed <= 200; seed += 1) {
      expect(reshuffleRemaining(deck, seeded(seed)).order.slice(1)).not.toEqual(['b', 'c', 'd', 'e']);
    }
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

  it('remainingCount and reshuffleRemaining only consider never-shown cards', () => {
    const deck = goBack(goBack(goBack(walk(createDeck(IDS, seeded(3)), 5))));
    expect(deck).toMatchObject({ cursor: 2, furthest: 5 });
    expect(remainingCount(deck)).toBe(14);
    const next = reshuffleRemaining(deck, seeded(9));
    expect(next).toMatchObject({ cursor: 2, furthest: 5 });
    expect(next.order.slice(0, 6)).toEqual(deck.order.slice(0, 6));
    expect([...next.order.slice(6)].sort()).toEqual([...deck.order.slice(6)].sort());
    expect(next.order.slice(6)).not.toEqual(deck.order.slice(6));
  });
});
