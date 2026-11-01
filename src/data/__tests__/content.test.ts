import glyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';

import rawData from '../data.json';
import { CATEGORY_IDS } from '../types';

/**
 * Validates src/data/data.json against specs/001-icebreaker-cards-mvp/contracts/content-schema.md
 * (rules 1–10) plus the 002 palette rule. Works on the raw JSON on purpose (typed as unknown).
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

describe('data.json content', () => {
  it('1. has exactly the top-level keys categories and questions (arrays)', () => {
    expect(isObject(data)).toBe(true);
    expect(Object.keys(root).sort()).toEqual(['categories', 'questions']);
    expect(Array.isArray(root.categories)).toBe(true);
    expect(Array.isArray(root.questions)).toBe(true);
  });

  it('2. lists exactly the 8 category IDs, in order, without duplicates', () => {
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

  it('9. every category has at least 20 questions', () => {
    for (const id of CATEGORY_IDS) {
      const count = questions.filter((q) => q.categoryId === id).length;
      expect({ id, enough: count >= 20 }).toEqual({ id, enough: true });
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
});
