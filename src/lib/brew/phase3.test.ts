import { describe, expect, it } from 'vitest';
import { evaluateBrew, recipeMatchesIngredients } from './evaluate';
import { resolveRecipeSlots } from './resolve';
import { getDailyExperiment, dateKeyFromDate } from './daily';
import type { MerchantStaple, Recipe } from '@/lib/data/schemas';
import type { SourceEntry } from '@/lib/data/normalize';
import { canAddToSatchel } from '@/lib/shop/stock';

const staples: MerchantStaple[] = [
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

const hastyElixir: Recipe = {
  slug: 'hasty-elixir',
  name: 'Hasty Elixir',
  kind: 'elixir',
  effectFamily: 'speed up',
  ingredients: [
    { kind: 'item', sourceId: 79 },
    { kind: 'item', sourceId: 84 },
  ],
  merchantNote: 'Speed brew.',
};

const dubious: Recipe = {
  slug: 'dubious-food',
  name: 'Dubious Food',
  kind: 'failure',
  effectFamily: 'none',
  ingredients: [{ kind: 'special', note: 'bad mix' }],
  merchantNote: 'Failure.',
};

const frog: SourceEntry = {
  id: 79,
  sourceId: 79,
  slug: 'hot-footed-frog',
  name: 'hot-footed frog',
  category: 'creatures',
  description: 'frog',
  image: '/f.png',
  commonLocations: ['Hyrule Field'],
  dlc: false,
  game: 'botw',
  edible: true,
  cookingEffect: 'speed up',
  heartsRecovered: 0,
};

const chuchu: SourceEntry = {
  id: 84,
  sourceId: 84,
  slug: 'chuchu',
  name: 'chuchu',
  category: 'monsters',
  description: 'jelly',
  image: '/c.png',
  commonLocations: ['Hyrule Field'],
  dlc: false,
  game: 'botw',
  drops: ['chuchu jelly'],
};

describe('phase 3 brew', () => {
  it('matches named elixir ingredients', () => {
    expect(
      recipeMatchesIngredients(
        hastyElixir,
        [
          { sourceId: 79, name: 'hot-footed frog', cookingEffect: 'speed up', isCritter: true },
          { sourceId: 84, name: 'chuchu', isMonsterPart: true },
        ],
        staples,
      ),
    ).toBe(true);
  });

  it('free-brews elixir from critter + monster', () => {
    const result = evaluateBrew(
      [
        {
          sourceId: 79,
          name: 'hot-footed frog',
          cookingEffect: 'speed up',
          isCritter: true,
        },
        { sourceId: 84, name: 'chuchu', isMonsterPart: true },
      ],
      [curryRice, hastyElixir, dubious],
      staples,
    );
    expect(result.ok).toBe(true);
    expect(result.effectFamily).toBe('speed up');
  });

  it('rejects monster without critter', () => {
    const result = evaluateBrew(
      [{ sourceId: 84, name: 'chuchu', isMonsterPart: true }],
      [dubious],
      staples,
    );
    expect(result.ok).toBe(false);
    expect(result.failureReason).toBe('monster_without_critter');
  });

  it('resolves curry rice slots to staple examples', () => {
    const view = resolveRecipeSlots(curryRice, [], staples);
    expect(view.exampleSourceIds).toEqual([900005, 900006]);
    expect(view.slots).toHaveLength(2);
  });

  it('resolves elixir slots from entries', () => {
    const view = resolveRecipeSlots(hastyElixir, [frog, chuchu], staples);
    expect(view.exampleSourceIds).toEqual([79, 84]);
  });

  it('picks a deterministic daily experiment', () => {
    const date = new Date('2026-08-07T12:00:00Z');
    const a = getDailyExperiment([curryRice, hastyElixir], date);
    const b = getDailyExperiment([curryRice, hastyElixir], date);
    expect(a?.dateKey).toBe(dateKeyFromDate(date));
    expect(a?.recipe.slug).toBe(b?.recipe.slug);
  });
});

describe('stock caps', () => {
  it('caps scarce goods at 2', () => {
    expect(canAddToSatchel('scarce', 2, 1).ok).toBe(false);
    expect(canAddToSatchel('scarce', 1, 1).ok).toBe(true);
  });

  it('blocks guide_only', () => {
    expect(canAddToSatchel('guide_only', 0, 1).ok).toBe(false);
  });
});
