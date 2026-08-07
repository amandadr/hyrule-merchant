import { describe, expect, it } from 'vitest';
import { evaluateBrew, recipeMatchesIngredients } from './evaluate';
import type { Recipe } from '@/lib/data/schemas';
import type { MerchantStaple } from '@/lib/data/schemas';

const staples: MerchantStaple[] = [
  {
    stapleId: 'raw-meat',
    sourceId: 900011,
    name: 'Raw Meat',
    description: 'Meat',
    commonLocations: [],
    cookingEffect: '',
    heartsRecovered: 1,
    priceRupees: 18,
    stockStatus: 'available',
    merchantNote: 'n',
  },
  {
    stapleId: 'hylian-rice',
    sourceId: 900006,
    name: 'Hylian Rice',
    description: 'Rice',
    commonLocations: [],
    cookingEffect: '',
    heartsRecovered: 1,
    priceRupees: 12,
    stockStatus: 'available',
    merchantNote: 'n',
  },
  {
    stapleId: 'goron-spice',
    sourceId: 900005,
    name: 'Goron Spice',
    description: 'Spice',
    commonLocations: [],
    cookingEffect: '',
    heartsRecovered: 0,
    priceRupees: 18,
    stockStatus: 'available',
    merchantNote: 'n',
  },
];

const curryRice: Recipe = {
  slug: 'curry-rice',
  name: 'Curry Rice',
  kind: 'meal',
  effectFamily: 'hearts',
  ingredients: [
    { kind: 'staple', stapleId: 'goron-spice' },
    { kind: 'staple', stapleId: 'hylian-rice' },
  ],
  merchantNote: 'Mountain fragrance.',
};

const dubious: Recipe = {
  slug: 'dubious-food',
  name: 'Dubious Food',
  kind: 'failure',
  effectFamily: 'none',
  ingredients: [{ kind: 'special', note: 'bad mix' }],
  merchantNote: 'Failure.',
};

describe('brew evaluate', () => {
  it('matches curry rice from staples', () => {
    expect(
      recipeMatchesIngredients(
        curryRice,
        [
          { sourceId: 900005, stapleId: 'goron-spice', name: 'Goron Spice' },
          { sourceId: 900006, stapleId: 'hylian-rice', name: 'Hylian Rice' },
        ],
        staples,
      ),
    ).toBe(true);
  });

  it('marks conflicting effects as dubious', () => {
    const result = evaluateBrew(
      [
        {
          sourceId: 170,
          name: 'spicy pepper',
          cookingEffect: 'cold resistance',
          heartsRecovered: 0.5,
        },
        {
          sourceId: 169,
          name: 'hydromelon',
          cookingEffect: 'heat resistance',
          heartsRecovered: 0.5,
        },
      ],
      [curryRice, dubious],
      staples,
    );
    expect(result.ok).toBe(false);
    expect(result.failureReason).toBe('conflicting_effects');
    expect(result.matchedRecipe?.slug).toBe('dubious-food');
  });

  it('matches multi-count distinct tag recipes', () => {
    const copious: Recipe = {
      slug: 'copious-mushroom-skewers',
      name: 'Copious Mushroom Skewers',
      kind: 'meal',
      effectFamily: 'variable',
      ingredients: [
        { kind: 'tag', tag: 'mushroom', count: 4, distinct: true },
      ],
      merchantNote: 'Four fungi.',
    };

    expect(
      recipeMatchesIngredients(
        copious,
        [
          { sourceId: 1, name: 'hylian shroom' },
          { sourceId: 2, name: 'stamella shroom' },
          { sourceId: 3, name: 'rushroom' },
          { sourceId: 4, name: 'ironshroom' },
        ],
        staples,
      ),
    ).toBe(true);

    expect(
      recipeMatchesIngredients(
        copious,
        [
          { sourceId: 1, name: 'hylian shroom' },
          { sourceId: 2, name: 'hylian shroom' },
          { sourceId: 3, name: 'rushroom' },
          { sourceId: 4, name: 'ironshroom' },
        ],
        staples,
      ),
    ).toBe(false);
  });
});
