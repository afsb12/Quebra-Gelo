import glyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';

import rawData from '../data.json';
import { CATEGORY_IDS } from '../types';

/**
 * Validates src/data/data.json against specs/001-icebreaker-cards-mvp/contracts/content-schema.md
 * (rules 1–10) plus the 002 palette rule, the 007 date-safe rule (11) and the 010 rules: exactly 30
 * questions per category (9), every text a question (12), no yes/no openers (13) and a
 * workplace-safe Happy Hour (14). Works on the raw JSON on purpose (typed as unknown).
 */

type Json = Record<string, unknown>;

const data: unknown = rawData;
const isObject = (v: unknown): v is Json => typeof v === 'object' && v !== null && !Array.isArray(v);

const root = isObject(data) ? data : {};
const categories: Json[] = Array.isArray(root.categories) ? root.categories.filter(isObject) : [];
const questions: Json[] = Array.isArray(root.questions) ? root.questions.filter(isObject) : [];

// 002 research R1 — category back colors.
const PALETTE: Record<string, string> = {
  casual: '#F5C230',
  'primeiros-encontros': '#FF8A80',
  profundo: '#3D3FA6',
  casais: '#C41E3A',
  'happy-hour': '#F27A1F',
  dilemas: '#7A3EB1',
  viagens: '#14A39E',
  nostalgia: '#F28CB4',
  futuro: '#167A4C',
};

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

// Matched against ` ${normalize(text)} ` (lowercase, no accents, punctuation → spaces). `nos` is
// left out on purpose: without accents it is also the common "em + os".
const DATE_UNSAFE: RegExp[] = [
  / (em mim|comigo|a gente|nosso|nossa|nossos|nossas) /,
  / ex /,
  / (namor|casad|casament|salari|dinheiro|religi|igreja|deus|partido|politic|filho|sexo|sexual|corpo|peso|doenca|aparencia|bonit|solteir)/,
  / (defeito|onde voce se ve|daqui a \d+ anos)/,
];

// 010 research R2: openers of yes/no questions, matched on the normalized start of the text (and
// on the main clause after "Se …,"). Allowed only when the question offers alternatives (" ou ").
const CLOSED_OPENERS = [
  'voce ja',
  'voce toparia',
  'voce aceitaria',
  'voce mudaria',
  'voce abriria',
  'voce contaria',
  'voce gosta',
  'voce acha que',
  'voce costuma',
  'voce consegue',
  'voce faria',
  'voce teria',
  'voce seria',
  'voce sente',
  'voce tem',
  'tem algo',
  'tem alguma',
  'existe',
  'ha algo',
  'e verdade',
];

const closedOpener = (text: string): string | undefined => {
  const whole = normalize(text);
  if (whole.includes(' ou ')) return undefined;
  const starts = [whole];
  const comma = text.indexOf(',');
  if (whole.startsWith('se ') && comma >= 0) starts.push(normalize(text.slice(comma + 1)));
  return CLOSED_OPENERS.find((opener) => starts.some((start) => `${start} `.startsWith(`${opener} `)));
};

// 010 research R4: Happy Hour must work among colleagues (no drinking, money, hierarchy, private life).
const WORKPLACE_UNSAFE: RegExp[] = [
  / (alcool|bebida|bebad|ressaca|drink|cerveja|salari|dinheiro|chefe|demiss|promoc|desempenho|namor|sexo|sexual|religi|igreja|politic|partido)/,
  / ex /,
];

const deckIds = (categoryId: string) =>
  Array.from({ length: 30 }, (_, i) => `${categoryId}-${String(i + 1).padStart(3, '0')}`);

describe('data.json content', () => {
  it('1. has exactly the top-level keys categories and questions (arrays)', () => {
    expect(isObject(data)).toBe(true);
    expect(Object.keys(root).sort()).toEqual(['categories', 'questions']);
    expect(Array.isArray(root.categories)).toBe(true);
    expect(Array.isArray(root.questions)).toBe(true);
  });

  it('2. lists exactly the category IDs, in order, without duplicates', () => {
    expect(categories.map((c) => c.id)).toEqual([...CATEGORY_IDS]);
  });

  it('3. every category has valid title, icon, description and a distinct hex color', () => {
    for (const c of categories) {
      expect(typeof c.title).toBe('string');
      expect((c.title as string).trim().length).toBeGreaterThan(0);
      expect((c.title as string).length).toBeLessThanOrEqual(30);
      expect(typeof c.icon).toBe('string');
      expect((c.icon as string).length).toBeGreaterThan(0);
      expect(typeof c.description).toBe('string');
      expect((c.description as string).trim().length).toBeGreaterThan(0);
      expect((c.description as string).length).toBeLessThanOrEqual(80);
      expect(c.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
    const colors = categories.map((c) => String(c.color).toUpperCase());
    expect(new Set(colors).size).toBe(colors.length);
  });

  it('3b. category colors match the 002 palette', () => {
    for (const c of categories) {
      expect({ id: c.id, color: String(c.color).toUpperCase() }).toEqual({
        id: c.id,
        color: PALETTE[String(c.id)],
      });
    }
  });

  it('4. every icon exists in the MaterialCommunityIcons glyph map', () => {
    const glyphs: Record<string, number> = glyphMap;
    for (const c of categories) {
      expect({ id: c.id, icon: c.icon, exists: String(c.icon) in glyphs }).toEqual({
        id: c.id,
        icon: c.icon,
        exists: true,
      });
    }
  });

  it('5. every question has exactly id, categoryId and text as strings', () => {
    for (const q of questions) {
      expect(Object.keys(q).sort()).toEqual(['categoryId', 'id', 'text']);
      expect(typeof q.id).toBe('string');
      expect(typeof q.categoryId).toBe('string');
      expect(typeof q.text).toBe('string');
    }
  });

  it('6. question IDs are unique and match <categoryId>-NNN', () => {
    const ids = questions.map((q) => String(q.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of questions) {
      expect(String(q.id)).toMatch(new RegExp(`^${String(q.categoryId)}-\\d{3}$`));
    }
  });

  it('7. every categoryId references an existing category', () => {
    const known = new Set(categories.map((c) => c.id));
    for (const q of questions) {
      expect({ id: q.id, known: known.has(q.categoryId) }).toEqual({ id: q.id, known: true });
    }
  });

  it('8. every text is trimmed, non-empty and ≤ 200 characters', () => {
    for (const q of questions) {
      const text = String(q.text);
      expect({ id: q.id, trimmed: text === text.trim() }).toEqual({ id: q.id, trimmed: true });
      expect(text.length).toBeGreaterThan(0);
      expect({ id: q.id, length: text.length <= 200 }).toEqual({ id: q.id, length: true });
    }
  });

  it('9. every category has exactly 30 questions, IDs <cat>-001…030 (010)', () => {
    for (const id of CATEGORY_IDS) {
      const ids = questions.filter((q) => q.categoryId === id).map((q) => String(q.id));
      expect({ id, ids }).toEqual({ id, ids: deckIds(id) });
    }
  });

  it('10. no two questions have the same normalized text', () => {
    const seen = new Map<string, string>();
    for (const q of questions) {
      const key = normalize(String(q.text));
      expect({ id: q.id, duplicateOf: seen.get(key) }).toEqual({ id: q.id, duplicateOf: undefined });
      seen.set(key, String(q.id));
    }
  });

  // 007 research R4: a minimum guard for the date-safe tone; the manual review is the real check.
  it('11. primeiros-encontros questions are date-safe', () => {
    const deck = questions.filter((q) => q.categoryId === 'primeiros-encontros');
    expect(deck.map((q) => q.id)).toEqual(deckIds('primeiros-encontros'));
    for (const q of deck) {
      const text = String(q.text).trim();
      const words = ` ${normalize(text)} `;
      const term = DATE_UNSAFE.find((pattern) => pattern.test(words));
      expect({ id: q.id, question: text.endsWith('?'), term: term?.source }).toEqual({
        id: q.id,
        question: true,
        term: undefined,
      });
    }
  });

  it('12. every text is a question (ends with ?) (010)', () => {
    for (const q of questions) {
      expect({ id: q.id, question: String(q.text).endsWith('?') }).toEqual({ id: q.id, question: true });
    }
  });

  it('13. no question opens as a yes/no question (010)', () => {
    for (const q of questions) {
      expect({ id: q.id, opener: closedOpener(String(q.text)) }).toEqual({ id: q.id, opener: undefined });
    }
  });

  it('14. happy-hour questions are workplace-safe (010)', () => {
    const deck = questions.filter((q) => q.categoryId === 'happy-hour');
    expect(deck).toHaveLength(30);
    for (const q of deck) {
      const words = ` ${normalize(String(q.text))} `;
      const term = WORKPLACE_UNSAFE.find((pattern) => pattern.test(words));
      expect({ id: q.id, term: term?.source }).toEqual({ id: q.id, term: undefined });
    }
  });
});
