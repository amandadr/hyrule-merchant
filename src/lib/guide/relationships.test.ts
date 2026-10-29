import { describe, expect, it } from 'vitest';
import { buildGuideRelationships } from './relationships';
import type { Product, Region, SourceEntry } from '@/lib/data/normalize';
import type { Outfit, Recipe } from '@/lib/data/schemas';

const apple: SourceEntry = {
  id: 165,
  sourceId: 165,
  slug: 'apple',
  name: 'apple',
  category: 'materials',
  description: 'A common fruit.',
  image: '/apple.png',
  commonLocations: ['Hyrule Field'],
  dlc: false,
  game: 'botw',
  cookingEffect: '',
  heartsRecovered: 0.5,
};

const bokoblin: SourceEntry = {
  id: 84,
  sourceId: 84,
  slug: 'bokoblin',
  name: 'bokoblin',
  category: 'monsters',
  description: 'A common monster.',
  image: '/boko.png',
  commonLocations: ['Hyrule Field'],
  dlc: false,
  game: 'botw',
  drops: ['bokoblin horn', 'apple'],
};

const appleProduct: Product = {
  sourceId: 165,
  slug: 'apple',
  entry: apple,
  priceRupees: 5,
  stockStatus: 'available',
  origin: 'compendium',
  merchantNote: 'Good for the road.',
};

const region: Region = {
  slug: 'central',
  name: 'Central Hyrule',
  settlements: [],
  shrines: [],
  dlcShrines: [],
  overview: '',
  conditions: '',
  hazards: '',
  usefulFinds: '',
  routeNotes: '',
  merchantStory: '',
};

const recipe: Recipe = {
  slug: 'simmered-fruit',
  name: 'Simmered Fruit',
  kind: 'meal',
  effectFamily: 'hearts',
  strengthBand: 'weak',
  durationBand: 'short',
  merchantNote: 'Simple supper.',
  ingredients: [{ kind: 'item', sourceId: 165 }],
};

const outfit: Outfit = {
  slug: 'trail-skewer-kit',
  name: 'Trail Skewer',
  objective: 'Supper for any road.',
  merchantNote: 'Eat.',
  sourceIds: [165, 170],
  items: [
    { sourceId: 165, quantity: 1, reason: 'Fruit.' },
    { sourceId: 170, quantity: 1, reason: 'Heat.' },
  ],
};

describe('buildGuideRelationships', () => {
  it('links sellable materials to the shop and regions', () => {
    const result = buildGuideRelationships(apple, {
      products: [appleProduct],
      entries: [apple, bokoblin],
      regions: [region],
      recipes: [recipe],
      outfits: [outfit],
      staples: [],
    });

    expect(result.product?.href).toBe('/shop/apple');
    expect(result.locations[0]?.href).toBe('/regions/central');
    expect(result.droppedBy.some((link) => link.href?.includes('bokoblin'))).toBe(
      true,
    );
    expect(result.recipes[0]?.href).toBe('/brew#simmered-fruit');
    expect(result.packs[0]?.href).toBe('/shop?outfit=trail-skewer-kit');
  });

  it('links monster drops to shop or guide entries', () => {
    const result = buildGuideRelationships(bokoblin, {
      products: [appleProduct],
      entries: [apple, bokoblin],
      regions: [region],
      recipes: [],
      outfits: [],
      staples: [],
    });

    expect(result.drops.some((link) => link.href === '/shop/apple')).toBe(true);
  });
});
