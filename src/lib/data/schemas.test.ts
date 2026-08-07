import { describe, expect, it } from 'vitest';
import {
  CreatureFoodSchema,
  MaterialSchema,
  MonsterSchema,
} from './schemas';
import { normalizeEntry, slugify } from './normalize';

describe('slugify', () => {
  it('slugifies entry names', () => {
    expect(slugify('royal guard\'s claymore')).toBe('royal-guards-claymore');
    expect(slugify('Hyrule Bass')).toBe('hyrule-bass');
    expect(slugify('guardian sword++')).toBe('guardian-sword-plus-plus');
  });
});

describe('schemas', () => {
  it('accepts a valid material', () => {
    const raw = MaterialSchema.parse({
      category: 'materials',
      common_locations: ['Hyrule Field'],
      cooking_effect: '',
      description: 'A fruit.',
      dlc: false,
      hearts_recovered: 0.5,
      id: 165,
      image: 'https://api.hyrule-compendium.com/v3/compendium/entry/apple/image',
      name: 'apple',
    });

    const entry = normalizeEntry(raw);
    expect(entry.category).toBe('materials');
    expect(entry.slug).toBe('apple');
    if (entry.category === 'materials') {
      expect(entry.heartsRecovered).toBe(0.5);
    }
  });

  it('rejects a broken monster fixture', () => {
    expect(() =>
      MonsterSchema.parse({
        category: 'monsters',
        // missing required fields on purpose
        name: 'broken',
      }),
    ).toThrow();
  });

  it('coerces null common_locations via normalize', () => {
    const raw = CreatureFoodSchema.parse({
      category: 'creatures',
      common_locations: null,
      cooking_effect: 'stamina recovery',
      description: 'A fish.',
      dlc: false,
      edible: true,
      hearts_recovered: 1,
      id: 48,
      image: 'https://api.hyrule-compendium.com/v3/compendium/entry/hyrule_bass/image',
      name: 'hyrule bass',
    });

    const entry = normalizeEntry(raw);
    expect(entry.commonLocations).toEqual([]);
  });
});
