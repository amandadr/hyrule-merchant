import type { IngredientTag } from '@/lib/data/schemas';
import type { SourceEntry } from '@/lib/data/normalize';

const FRUIT_NAMES = new Set([
  'apple',
  'palm fruit',
  'wildberry',
  'hearty durian',
  'hydromelon',
  'voltfruit',
  'fleet-lotus seeds',
  'mighty bananas',
]);

const NUT_NAMES = new Set(['acorn', 'chickaloo tree nut']);

function nameIncludes(entry: SourceEntry, needles: string[]): boolean {
  const name = entry.name.toLowerCase();
  return needles.some((needle) => name.includes(needle));
}

export function entryMatchesTag(entry: SourceEntry, tag: IngredientTag): boolean {
  const name = entry.name.toLowerCase();

  switch (tag) {
    case 'mushroom':
      return (
        entry.category === 'materials' &&
        (nameIncludes(entry, ['shroom', 'truffle']))
      );
    case 'fruit':
      return entry.category === 'materials' && FRUIT_NAMES.has(name);
    case 'nut':
      return NUT_NAMES.has(name);
    case 'radish':
      return entry.category === 'materials' && name.includes('radish');
    case 'carrot':
      return entry.category === 'materials' && name.includes('carrot');
    case 'pumpkin':
      return entry.category === 'materials' && name.includes('pumpkin');
    case 'carrot_or_pumpkin':
      return entryMatchesTag(entry, 'carrot') || entryMatchesTag(entry, 'pumpkin');
    case 'vegetable':
      return (
        entry.category === 'materials' &&
        (nameIncludes(entry, [
          'carrot',
          'pumpkin',
          'radish',
          'herb',
          'safflina',
          'thistle',
          'armoranth',
          'nightshade',
          'violet',
          'silent princess',
        ]) ||
          name === 'hyrule herb')
      );
    case 'vegetable_herb_flower':
      return (
        entryMatchesTag(entry, 'vegetable') ||
        (entry.category === 'materials' &&
          nameIncludes(entry, ['safflina', 'violet', 'nightshade', 'princess', 'herb']))
      );
    case 'meat':
      // Merchant staples only in practice; Compendium has no raw meats.
      return false;
    case 'fish':
      return (
        entry.category === 'creatures' &&
        'edible' in entry &&
        entry.edible === true &&
        nameIncludes(entry, ['bass', 'trout', 'salmon', 'carp', 'porgy'])
      );
    case 'crab':
      return (
        entry.category === 'creatures' &&
        'edible' in entry &&
        entry.edible === true &&
        name.includes('crab')
      );
    case 'porgy':
      return (
        entry.category === 'creatures' &&
        'edible' in entry &&
        entry.edible === true &&
        name.includes('porgy')
      );
    case 'snail_or_crab':
      return (
        entry.category === 'creatures' &&
        'edible' in entry &&
        entry.edible === true &&
        (name.includes('snail') || name.includes('crab'))
      );
    case 'seafood':
      return (
        entryMatchesTag(entry, 'fish') ||
        entryMatchesTag(entry, 'crab') ||
        entryMatchesTag(entry, 'snail_or_crab') ||
        (entry.category === 'creatures' &&
          'edible' in entry &&
          entry.edible === true &&
          nameIncludes(entry, ['snail']))
      );
    case 'gem_animal_or_monster_part':
      return entry.category === 'monsters' || entry.category === 'treasure';
    default:
      return false;
  }
}

export function getEntriesByIngredientTag(
  entries: SourceEntry[],
  tag: IngredientTag,
): SourceEntry[] {
  return entries.filter((entry) => entryMatchesTag(entry, tag));
}

/** Staple ids that satisfy a meat tag slot. */
export const MEAT_STAPLE_IDS = [
  'raw-meat',
  'raw-prime-meat',
  'raw-gourmet-meat',
  'raw-bird-drumstick',
  'raw-bird-thigh',
  'raw-whole-bird',
] as const;
