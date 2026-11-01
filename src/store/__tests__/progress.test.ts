import { getQuestionsByCategory } from '../../data/content';
import { useProgressStore } from '../progress';

jest.mock('../../data/content', () => {
  const ids = (cat: string, n: number) =>
    Array.from({ length: n }, (_, i) => ({ id: `${cat}-${String(i + 1).padStart(3, '0')}`, categoryId: cat, text: `Pergunta ${i + 1}` }));
  const questions = [...ids('casual', 3), ...ids('profundo', 5), ...ids('casais', 4), ...ids('futuro', 6)];
  return {
    getQuestionsByCategory: (cat: string) => questions.filter((q) => q.categoryId === cat),
    getDeckQuestionIds: (deck: string) =>
      (deck === 'mixed' ? questions : questions.filter((q) => q.categoryId === deck)).map((q) => q.id),
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
});
