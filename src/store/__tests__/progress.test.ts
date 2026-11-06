import { getQuestionsByCategory } from '../../data/content';
import { useProgressStore } from '../progress';

jest.mock('../../data/content', () => {
  const ids = (cat: string, n: number) =>
    Array.from({ length: n }, (_, i) => ({ id: `${cat}-${String(i + 1).padStart(3, '0')}`, categoryId: cat, text: `Pergunta ${i + 1}` }));
  const questions = [...ids('casual', 3), ...ids('profundo', 5), ...ids('casais', 4), ...ids('futuro', 6)];
  return {
    getQuestionsByCategory: (cat: string) => questions.filter((q) => q.categoryId === cat),
    getDeckQuestionIds: (deck: string, mix?: readonly string[]) =>
      (deck === 'mixed'
        ? questions.filter((q) => !mix || mix.includes(q.categoryId))
        : questions.filter((q) => q.categoryId === deck)
      ).map((q) => q.id),
    getQuestion: (id: string) => questions.find((q) => q.id === id),
  };
});

const total = getQuestionsByCategory('profundo').length;

describe('useProgressStore (in memory)', () => {
  beforeEach(() => {
    useProgressStore.setState({ decks: {} });
  });

  it('ensureDeck creates a shuffled deck only when missing (resume)', () => {
    useProgressStore.getState().ensureDeck('profundo');
    const deck = useProgressStore.getState().decks.profundo;
    expect(deck?.cursor).toBe(0);
    expect(deck?.order).toHaveLength(total);

    useProgressStore.getState().discard('profundo');
    useProgressStore.getState().ensureDeck('profundo');
    const resumed = useProgressStore.getState().decks.profundo;
    expect(resumed?.cursor).toBe(1);
    expect(resumed?.order).toEqual(deck?.order);
  });

  it('discard advances the cursor', () => {
    useProgressStore.getState().ensureDeck('casais');
    useProgressStore.getState().discard('casais');
    useProgressStore.getState().discard('casais');
    expect(useProgressStore.getState().decks.casais?.cursor).toBe(2);
  });

  it('reshuffle creates a new deck with cursor 0', () => {
    useProgressStore.getState().ensureDeck('futuro');
    useProgressStore.getState().discard('futuro');
    useProgressStore.getState().reshuffle('futuro');
    const deck = useProgressStore.getState().decks.futuro;
    expect(deck?.cursor).toBe(0);
    expect(deck?.order).toHaveLength(getQuestionsByCategory('futuro').length);
  });

  it('reshuffleRemaining keeps the cursor, the shown cards and the set of ids (008)', () => {
    const store = useProgressStore.getState();
    store.ensureDeck('futuro');
    store.discard('futuro');
    store.discard('futuro');
    const before = useProgressStore.getState().decks.futuro;
    useProgressStore.getState().reshuffleRemaining('futuro');
    const after = useProgressStore.getState().decks.futuro;
    expect(after?.cursor).toBe(2);
    expect(after?.order.slice(0, 3)).toEqual(before?.order.slice(0, 3));
    expect([...(after?.order ?? [])].sort()).toEqual([...(before?.order ?? [])].sort());
    expect(after?.order.slice(3)).not.toEqual(before?.order.slice(3));
  });

  it('reshuffleRemaining on a missing deck is a no-op (008)', () => {
    useProgressStore.getState().reshuffleRemaining('casual');
    expect(useProgressStore.getState().decks.casual).toBeUndefined();
  });

  it('reshuffleRemaining keeps the mixed deck within its filter (008)', () => {
    useProgressStore.getState().ensureDeck('mixed', ['futuro', 'profundo']);
    const before = useProgressStore.getState().decks.mixed?.order ?? [];
    useProgressStore.getState().reshuffleRemaining('mixed');
    const after = useProgressStore.getState().decks.mixed?.order ?? [];
    expect(after).toHaveLength(11);
    expect([...after].sort()).toEqual([...before].sort());
    expect(after.every((id) => id.startsWith('futuro-') || id.startsWith('profundo-'))).toBe(true);
  });

  it('reshuffleRemaining does nothing with fewer than 2 cards left (008)', () => {
    useProgressStore.getState().ensureDeck('casual');
    useProgressStore.getState().discard('casual');
    const decks = useProgressStore.getState().decks;
    useProgressStore.getState().reshuffleRemaining('casual');
    expect(useProgressStore.getState().decks).toBe(decks);
  });

  it('is not persisted (no persist API)', () => {
    expect('persist' in useProgressStore).toBe(false);
  });

  it('the mixed deck holds every question, each once (004)', () => {
    useProgressStore.getState().ensureDeck('mixed');
    const order = useProgressStore.getState().decks.mixed?.order ?? [];
    expect(order).toHaveLength(18);
    expect(new Set(order).size).toBe(18);
  });

  it('mixed and category progress are independent (004 FR-004)', () => {
    useProgressStore.getState().ensureDeck('mixed');
    useProgressStore.getState().ensureDeck('casais');
    useProgressStore.getState().discard('mixed');
    useProgressStore.getState().discard('mixed');
    expect(useProgressStore.getState().decks.casais?.cursor).toBe(0);
    useProgressStore.getState().discard('casais');
    expect(useProgressStore.getState().decks.mixed?.cursor).toBe(2);
  });

  it('a filtered mixed deck only has the chosen categories; resetDeck drops it (006)', () => {
    useProgressStore.getState().ensureDeck('mixed', ['casual', 'casais']);
    expect(useProgressStore.getState().decks.mixed?.order).toHaveLength(7);
    useProgressStore.getState().resetDeck('mixed');
    expect(useProgressStore.getState().decks.mixed).toBeUndefined();
    useProgressStore.getState().ensureDeck('mixed', ['futuro', 'profundo']);
    expect(useProgressStore.getState().decks.mixed?.order).toHaveLength(11);
    useProgressStore.getState().reshuffle('mixed', ['casual', 'futuro']);
    expect(useProgressStore.getState().decks.mixed?.order).toHaveLength(9);
  });
});
