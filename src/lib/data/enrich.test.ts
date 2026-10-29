import { describe, expect, it } from 'vitest';
import {
  defaultProductCommerce,
  enrichProducts,
  stapleToMaterialEntry,
} from './enrich';
import type { MerchantStaple } from './schemas';
import { normalizeEntry } from './normalize';
import { MaterialSchema, MonsterSchema } from './schemas';

const sampleStaple: MerchantStaple = {
  stapleId: 'fresh-milk',
  sourceId: 900003,
  name: 'Fresh Milk',
  description: 'Creamy milk.',
  commonLocations: ['Hyrule Field'],
  cookingEffect: '',
  heartsRecovered: 0.5,
  priceRupees: 14,
  stockStatus: 'available',
  merchantNote: 'Sold cool.',
};

const apple = normalizeEntry(
  MaterialSchema.parse({
    category: 'materials',
    common_locations: ['Hyrule Field'],
    cooking_effect: '',
    description: 'A fruit.',
    dlc: false,
    hearts_recovered: 0.5,
    id: 165,
    image: 'https://api.hyrule-compendium.com/v3/compendium/entry/apple/image',
    name: 'apple',
  }),
);

const chuchu = normalizeEntry(
  MonsterSchema.parse({
    category: 'monsters',
    common_locations: ['Hyrule Field'],
    description: 'A blob.',
    dlc: false,
    drops: ['chuchu jelly'],
    id: 84,
    image: 'https://api.hyrule-compendium.com/v3/compendium/entry/chuchu/image',
    name: 'chuchu',
  }),
);

describe('merchant staples enrich', () => {
  it('maps a staple to a materials entry with synthetic sourceId', () => {
    const entry = stapleToMaterialEntry(sampleStaple);
    expect(entry.category).toBe('materials');
    expect(entry.sourceId).toBe(900003);
    expect(entry.slug).toBe('fresh-milk');
    expect(entry.image).toBe('/images/staples/Fresh_Milk.png');
    expect(entry.heartsRecovered).toBe(0.5);
  });

  it('includes every compendium entry plus staples', () => {
    const products = enrichProducts(
      [apple, chuchu],
      [
        {
          sourceId: 165,
          priceRupees: 12,
          stockStatus: 'available',
          merchantNote: 'Snack.',
        },
      ],
      [sampleStaple],
    );

    expect(products).toHaveLength(3);
    expect(products.map((p) => p.slug).sort()).toEqual([
      'apple',
      'chuchu',
      'fresh-milk',
    ]);
    expect(products.find((p) => p.slug === 'apple')?.priceRupees).toBe(12);
    expect(products.find((p) => p.slug === 'chuchu')?.origin).toBe('compendium');
    expect(products.find((p) => p.slug === 'fresh-milk')?.origin).toBe(
      'merchant_staple',
    );
  });

  it('assigns fictional defaults when no override exists', () => {
    const commerce = defaultProductCommerce(chuchu);
    expect(commerce.priceRupees).toBeGreaterThan(0);
    expect(commerce.merchantNote.toLowerCase()).toContain('brewing bench');
  });

  it('rejects staple ids that collide with compendium entries', () => {
    const colliding = normalizeEntry(
      MaterialSchema.parse({
        category: 'materials',
        common_locations: [],
        cooking_effect: '',
        description: 'A fruit.',
        dlc: false,
        hearts_recovered: 0.5,
        id: 900003,
        image: 'https://api.hyrule-compendium.com/v3/compendium/entry/apple/image',
        name: 'apple',
      }),
    );

    expect(() => enrichProducts([colliding], [], [sampleStaple])).toThrow(
      /collides/,
    );
  });
});
