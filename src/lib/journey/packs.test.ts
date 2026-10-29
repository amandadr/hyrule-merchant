import { describe, expect, it } from 'vitest';
import { kitFace, resolveJourneyPack, toPackCardPayload } from './packs';
import type { Outfit } from '@/lib/data/schemas';
import type { Product, SourceEntry } from '@/lib/data/normalize';

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

const shieldEntry: SourceEntry = {
  id: 360,
  sourceId: 360,
  slug: 'travelers-shield',
  name: "traveler's shield",
  category: 'equipment',
  description: 'shield',
  image: '/s.png',
  commonLocations: ['Hyrule Field'],
  dlc: false,
  game: 'botw',
  properties: { attack: 0, defense: 4 },
};

const products: Product[] = [
  {
    slug: 'spicy-pepper',
    sourceId: 170,
    origin: 'compendium',
    entry: pepperEntry,
    priceRupees: 14,
    stockStatus: 'available',
    merchantNote: 'n',
  },
  {
    slug: 'travelers-shield',
    sourceId: 360,
    origin: 'compendium',
    entry: shieldEntry,
    priceRupees: 40,
    stockStatus: 'available',
    merchantNote: 'n',
  },
];

const outfit: Outfit = {
  slug: 'test-pack',
  name: 'Test Pack',
  objective: 'Get somewhere safely.',
  merchantNote: 'A small kit.',
  regionSlug: 'dueling-peaks',
  items: [
    { sourceId: 170, reason: 'Warmth', quantity: 3 },
    { sourceId: 360, reason: 'Cover', quantity: 1 },
    { sourceId: 999999, reason: 'Missing', quantity: 1 },
  ],
  sourceIds: [170, 360, 999999],
};

describe('resolveJourneyPack', () => {
  it('resolves priced lines and reports missing source ids', () => {
    const byId = new Map(products.map((product) => [product.sourceId, product]));
    const resolved = resolveJourneyPack(outfit, byId);

    expect(resolved.items).toHaveLength(2);
    expect(resolved.missingSourceIds).toEqual([999999]);
    expect(resolved.totalRupees).toBe(14 * 3 + 40);
    expect(resolved.items[0]?.reason).toBe('Warmth');
  });

  it('builds a slim client payload', () => {
    const byId = new Map(products.map((product) => [product.sourceId, product]));
    const payload = toPackCardPayload(resolveJourneyPack(outfit, byId));

    expect(payload.slug).toBe('test-pack');
    expect(payload.items[0]?.name).toBe('Spicy Pepper');
    expect(payload.items[0]?.href).toBe('/shop/spicy-pepper');
    expect(payload.totalRupees).toBe(82);
  });

  it('pictures a kit as the goods that resolved', () => {
    const byId = new Map(products.map((product) => [product.sourceId, product]));
    expect(kitFace(outfit, byId)).toEqual([
      { image: '/p.png', name: 'Spicy Pepper' },
      { image: '/s.png', name: "Traveler's Shield" },
    ]);
  });
});
