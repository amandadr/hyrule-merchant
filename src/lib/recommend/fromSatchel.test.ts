import { describe, expect, it } from 'vitest';
import { recommendFromSatchel } from './fromSatchel';
import type { Product, Region, SourceEntry } from '@/lib/data/normalize';
import type { Outfit, Recipe } from '@/lib/data/schemas';

const appleEntry: SourceEntry = {
  id: 165,
  sourceId: 165,
  slug: 'apple',
  name: 'apple',
  category: 'materials',
  description: 'fruit',
  image: '/a.png',
  commonLocations: ['Hyrule Field'],
  dlc: false,
  game: 'botw',
  cookingEffect: '',
  heartsRecovered: 0.5,
};

const pepperEntry: SourceEntry = {
  id: 170,
  sourceId: 170,
  slug: 'spicy-pepper',
  name: 'spicy pepper',
  category: 'materials',
  description: 'hot',
  image: '/p.png',
  commonLocations: ['Gerudo Desert'],
  dlc: false,
  game: 'botw',
  cookingEffect: 'cold resistance',
  heartsRecovered: 0.5,
};

const products: Product[] = [
  {
    slug: 'apple',
    sourceId: 165,
    origin: 'compendium',
    entry: appleEntry,
    priceRupees: 12,
    stockStatus: 'available',
    merchantNote: 'n',
  },
  {
    slug: 'spicy-pepper',
    sourceId: 170,
    origin: 'compendium',
    entry: pepperEntry,
    priceRupees: 14,
    stockStatus: 'available',
    merchantNote: 'n',
  },
];

const recipes: Recipe[] = [
  {
    slug: 'sauteed-peppers',
    name: 'Sauteed Peppers',
    kind: 'meal',
    effectFamily: 'cold resistance',
    ingredients: [{ kind: 'item', sourceId: 170 }],
    merchantNote: 'n',
  },
];

const regions: Region[] = [
  {
    slug: 'central',
    name: 'Central',
    settlements: [],
    shrines: [],
    dlcShrines: [],
    overview: '',
    conditions: '',
    hazards: '',
    usefulFinds: '',
    routeNotes: '',
    merchantStory: '',
  },
];

const outfits: Outfit[] = [
  {
    slug: 'hebra-cold-kit',
    name: 'Hebra Cold Kit',
    items: [
      { sourceId: 170, reason: 'Warm food', quantity: 1 },
      { sourceId: 180, reason: 'Cold ridge', quantity: 1 },
    ],
    sourceIds: [170, 180],
    objective: 'Enter the mountains prepared.',
    merchantNote: 'Cold kit',
    regionSlug: 'hebra',
  },
];

describe('recommendFromSatchel', () => {
  it('suggests recipes and outfits from satchel contents', () => {
    const result = recommendFromSatchel({
      satchelSourceIds: [170],
      products,
      recipes,
      regions,
      outfits,
      staples: [],
      entriesBySourceId: new Map([
        [165, appleEntry],
        [170, pepperEntry],
      ]),
    });

    expect(result.recipes[0]?.slug).toBe('sauteed-peppers');
    expect(result.outfits[0]?.slug).toBe('hebra-cold-kit');
    expect(result.products.every((item) => item.slug !== 'spicy-pepper')).toBe(
      true,
    );
  });

  it('returns curated fallbacks when empty', () => {
    const result = recommendFromSatchel({
      satchelSourceIds: [],
      products,
      recipes,
      regions,
      outfits,
      staples: [],
      entriesBySourceId: new Map(),
    });
    expect(result.products.length).toBeGreaterThan(0);
  });
});
