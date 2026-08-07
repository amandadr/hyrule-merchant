import { describe, expect, it } from 'vitest';
import { entryMatchesTag } from './tags';
import type { SourceEntry } from '@/lib/data/normalize';

const shroom: SourceEntry = {
  id: 174,
  sourceId: 174,
  slug: 'hylian-shroom',
  name: 'hylian shroom',
  category: 'materials',
  description: 'm',
  image: '/m.png',
  commonLocations: [],
  dlc: false,
  game: 'botw',
  cookingEffect: '',
  heartsRecovered: 0.5,
};

describe('ingredient tags', () => {
  it('matches mushrooms', () => {
    expect(entryMatchesTag(shroom, 'mushroom')).toBe(true);
    expect(entryMatchesTag(shroom, 'fruit')).toBe(false);
  });
});
