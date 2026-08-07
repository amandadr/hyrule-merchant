import { describe, expect, it } from 'vitest';
import {
  filterGuideEntries,
  guideFiltersToSearchParams,
  parseGuideFilters,
  type GuideCardEntry,
} from './filter';

const sample: GuideCardEntry[] = [
  {
    sourceId: 165,
    slug: 'apple',
    name: 'apple',
    description: 'A common fruit found on trees.',
    image: 'https://example.com/apple.png',
    category: 'materials',
    commonLocations: ['Hyrule Field'],
    dlc: false,
    cookingEffect: undefined,
    heartsRecovered: 0.5,
  },
  {
    sourceId: 170,
    slug: 'spicy-pepper',
    name: 'spicy pepper',
    description: 'This pepper is exploding with spice.',
    image: 'https://example.com/pepper.png',
    category: 'materials',
    commonLocations: ['Gerudo Desert'],
    dlc: false,
    cookingEffect: 'cold resistance',
    heartsRecovered: 0.5,
  },
];

describe('guide filters', () => {
  it('filters by search and effect', () => {
    const result = filterGuideEntries(sample, {
      q: 'spice',
      location: '',
      effect: 'cold resistance',
      dlc: 'any',
      edible: 'any',
      hasDrops: 'any',
      sort: 'name',
    });
    expect(result.map((entry) => entry.slug)).toEqual(['spicy-pepper']);
  });

  it('round-trips query params', () => {
    const params = guideFiltersToSearchParams({
      q: 'apple',
      location: 'Hyrule Field',
      effect: '',
      dlc: 'base',
      edible: 'any',
      hasDrops: 'any',
      sort: 'hearts',
    });
    expect(parseGuideFilters(params)).toMatchObject({
      q: 'apple',
      location: 'Hyrule Field',
      dlc: 'base',
      sort: 'hearts',
    });
  });
});
