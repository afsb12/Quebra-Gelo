import { act, renderHook } from '@testing-library/react-native';

import { getAllQuestions, getQuestionsByCategory } from '../../data/content';
import { useMixFilterStore } from '../../store/mixFilter';
import { useProgressStore } from '../../store/progress';
import { useDeck } from '../useDeck';

const total = getQuestionsByCategory('casual').length;

describe('useDeck', () => {
  beforeEach(() => {
    useProgressStore.setState({ decks: {} });
    useMixFilterStore.setState({ excluded: [] });
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

  it('reshuffleRemaining keeps the current card and position (008)', async () => {
    const { result } = await renderHook(() => useDeck('casual'));
    await act(async () => result.current.discard());
    const id = result.current.current?.id;
    const position = result.current.position;
    await act(async () => result.current.reshuffleRemaining());
    expect(result.current.current?.id).toBe(id);
    expect(result.current.position).toEqual(position);
  });

  it('canReshuffleRemaining is false on the last two cards (008)', async () => {
    const { result } = await renderHook(() => useDeck('casual'));
    expect(result.current.canReshuffleRemaining).toBe(true);
    await act(async () => {
      for (let i = 0; i < total - 2; i += 1) result.current.discard();
    });
    expect(result.current.canReshuffleRemaining).toBe(false);
    await act(async () => result.current.discard());
    expect(result.current.canReshuffleRemaining).toBe(false);
    await act(async () => result.current.discard());
    expect(result.current.current).toBeUndefined();
    expect(result.current.canReshuffleRemaining).toBe(false);
  });

  it('after a reshuffle every unseen card shows once and no seen card returns (008)', async () => {
    const { result } = await renderHook(() => useDeck('casual'));
    const seen: string[] = [];
    await act(async () => {
      for (let i = 0; i < 3; i += 1) {
        seen.push(result.current.current?.id ?? '');
        result.current.discard();
      }
    });
    await act(async () => result.current.reshuffleRemaining());
    const rest: string[] = [];
    while (result.current.current) {
      rest.push(result.current.current.id);
      await act(async () => result.current.discard());
    }
    expect(rest).toHaveLength(total - 3);
    expect(new Set(rest).size).toBe(total - 3);
    expect(rest.some((id) => seen.includes(id))).toBe(false);
  });

  it('the reshuffled order survives leaving and returning to the deck (008)', async () => {
    const first = await renderHook(() => useDeck('casual'));
    await act(async () => first.result.current.discard());
    await act(async () => first.result.current.reshuffleRemaining());
    const id = first.result.current.current?.id;
    const order = useProgressStore.getState().decks.casual?.order;
    await first.unmount();

    const again = await renderHook(() => useDeck('casual'));
    expect(again.result.current.current?.id).toBe(id);
    expect(again.result.current.position.index).toBe(2);
    expect(useProgressStore.getState().decks.casual?.order).toEqual(order);
  });

  it('goBack returns to the previous card (009)', async () => {
    const { result } = await renderHook(() => useDeck('casual'));
    expect(result.current.canGoBack).toBe(false);
    const first = result.current.current?.id;
    await act(async () => result.current.discard());
    expect(result.current.canGoBack).toBe(true);
    await act(async () => result.current.goBack());
    expect(result.current.current?.id).toBe(first);
    expect(result.current.position.index).toBe(1);
    expect(result.current.canGoBack).toBe(false);
  });

  it('canReshuffleRemaining counts only never-shown cards (009)', async () => {
    const { result } = await renderHook(() => useDeck('casual'));
    await act(async () => {
      for (let i = 0; i < total - 2; i += 1) result.current.discard();
    });
    expect(result.current.canReshuffleRemaining).toBe(false);
    await act(async () => {
      for (let i = 0; i < 5; i += 1) result.current.goBack();
    });
    expect(result.current.position.index).toBe(total - 6);
    expect(result.current.canReshuffleRemaining).toBe(false);
  });

  it('mixed deck: title "Tudo Misturado", no deck category, current category follows the question (004)', async () => {
    const { result } = await renderHook(() => useDeck('mixed'));
    expect(result.current.title).toBe('Tudo Misturado');
    expect(result.current.deckCategory).toBeUndefined();
    expect(result.current.position.total).toBe(getAllQuestions().length);
    expect(result.current.currentCategory?.id).toBe(result.current.current?.categoryId);
  });

  it('mixed deck follows the saved filter (006)', async () => {
    useMixFilterStore.getState().save(['casais', 'futuro']);
    const { result } = await renderHook(() => useDeck('mixed'));
    const expected = getQuestionsByCategory('casais').length + getQuestionsByCategory('futuro').length;
    expect(result.current.position.total).toBe(expected);
    expect(['casais', 'futuro']).toContain(result.current.current?.categoryId);

    await act(async () => {
      useMixFilterStore.getState().save(['dilemas', 'viagens', 'casual']);
    });
    const next = getQuestionsByCategory('dilemas').length + getQuestionsByCategory('viagens').length + getQuestionsByCategory('casual').length;
    expect(result.current.position).toEqual({ index: 1, total: next });
  });
});
