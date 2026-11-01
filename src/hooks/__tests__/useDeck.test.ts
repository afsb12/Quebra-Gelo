import { act, renderHook } from '@testing-library/react-native';

import { getAllQuestions, getQuestionsByCategory } from '../../data/content';
import { useProgressStore } from '../../store/progress';
import { useDeck } from '../useDeck';

const total = getQuestionsByCategory('casual').length;

describe('useDeck', () => {
  beforeEach(() => {
    useProgressStore.setState({ decks: {} });
  });

  it('returns category, current question and position', async () => {
    const { result } = await renderHook(() => useDeck('casual'));
    expect(result.current.deckCategory?.id).toBe('casual');
    expect(result.current.current?.categoryId).toBe('casual');
    expect(result.current.position).toEqual({ index: 1, total });
  });

  it('discard advances to a different question', async () => {
    const { result } = await renderHook(() => useDeck('casual'));
    const first = result.current.current?.id;
    await act(async () => result.current.discard());
    expect(result.current.current?.id).not.toBe(first);
    expect(result.current.position.index).toBe(2);
  });

  it('current is undefined after the last card and reshuffle restarts', async () => {
    const { result } = await renderHook(() => useDeck('casual'));
    await act(async () => {
      for (let i = 0; i < total; i += 1) result.current.discard();
    });
    expect(result.current.current).toBeUndefined();
    await act(async () => result.current.reshuffle());
    expect(result.current.current).toBeDefined();
    expect(result.current.position.index).toBe(1);
  });

  it('keeps progress when returning to the same category (app still open)', async () => {
    const first = await renderHook(() => useDeck('casual'));
    await act(async () => first.result.current.discard());
    const seenId = first.result.current.current?.id;
    await first.unmount();

    const again = await renderHook(() => useDeck('casual'));
    expect(again.result.current.position.index).toBe(2);
    expect(again.result.current.current?.id).toBe(seenId);
  });

  it('mixed deck: title "Tudo Misturado", no deck category, current category follows the question (004)', async () => {
    const { result } = await renderHook(() => useDeck('mixed'));
    expect(result.current.title).toBe('Tudo Misturado');
    expect(result.current.deckCategory).toBeUndefined();
    expect(result.current.position.total).toBe(getAllQuestions().length);
    expect(result.current.currentCategory?.id).toBe(result.current.current?.categoryId);
  });
});
