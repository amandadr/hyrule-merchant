import { describe, expect, it } from 'vitest';
import { getAllEntries, getCategories, getRegions } from '@/lib/content';
import { categoryCover, pictureOf, regionCover } from './covers';

describe('pictureOf', () => {
  const entries = [{ name: 'apple', image: '/apple.png' }];

  it('titles a known entry', () => {
    expect(pictureOf('apple', entries)).toEqual({
      image: '/apple.png',
      name: 'apple',
      label: 'Apple',
    });
  });

  it('returns nothing when the name is missing', () => {
    expect(pictureOf('silent princess', entries)).toBeUndefined();
    expect(pictureOf(undefined, entries)).toBeUndefined();
  });
});

describe('cover catalogue', () => {
  const entries = getAllEntries();

  it('pictures every region with an entry that exists in the snapshot', () => {
    for (const region of getRegions()) {
      const cover = regionCover(region.slug, entries);
      expect(cover, region.slug).toBeDefined();
      expect(cover?.image).toMatch(/^https?:\/\//);
    }
  });

  it('pictures every field-manual category', () => {
    for (const category of getCategories()) {
      const cover = categoryCover(category, entries);
      expect(cover, category).toBeDefined();
      expect(cover?.label.length).toBeGreaterThan(0);
    }
  });
});
