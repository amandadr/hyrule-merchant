import type { IngredientSlot, MerchantStaple, Recipe } from '@/lib/data/schemas';
import type { SourceEntry } from '@/lib/data/normalize';
import { stapleImagePath } from '@/lib/data/enrich';
import { entryMatchesTag, MEAT_STAPLE_IDS } from './tags';
import type { BrewIngredientRef } from './evaluate';

export interface ResolvedSlotExample {
  label: string;
  sourceId?: number;
  stapleId?: string;
  name: string;
  image?: string;
  commonLocations: string[];
  cookingEffect?: string;
  optional?: boolean;
  alternativesNote?: string;
}

export interface ResolvedRecipeView {
  recipe: Recipe;
  slots: ResolvedSlotExample[];
  exampleSourceIds: number[];
}

function titleCase(name: string): string {
  return name
    .split(' ')
    .map((part) => (part ? part[0]!.toUpperCase() + part.slice(1) : part))
    .join(' ');
}

function findEntry(
  sourceId: number,
  entries: SourceEntry[],
): SourceEntry | undefined {
  return entries.find((entry) => entry.sourceId === sourceId);
}

function findStaple(
  stapleId: string,
  staples: MerchantStaple[],
): MerchantStaple | undefined {
  return staples.find((staple) => staple.stapleId === stapleId);
}

function firstTagMatch(
  tag: string,
  entries: SourceEntry[],
  staples: MerchantStaple[],
  excludeNames?: string[],
): ResolvedSlotExample | null {
  if (tag === 'meat') {
    const staple = staples.find((s) =>
      (MEAT_STAPLE_IDS as readonly string[]).includes(s.stapleId),
    );
    if (!staple) return null;
    return {
      label: `Any meat (e.g. ${staple.name})`,
      sourceId: staple.sourceId,
      stapleId: staple.stapleId,
      name: staple.name,
      commonLocations: staple.commonLocations,
      cookingEffect: staple.cookingEffect || undefined,
    };
  }

  const hit = entries.find((entry) => {
    if (excludeNames?.some((ex) => entry.name.toLowerCase() === ex.toLowerCase())) {
      return false;
    }
    return entryMatchesTag(entry, tag as Parameters<typeof entryMatchesTag>[1]);
  });
  if (!hit) return null;

  const effect =
    hit.category === 'materials'
      ? hit.cookingEffect
      : hit.category === 'creatures' && hit.edible === true
        ? hit.cookingEffect
        : undefined;

  return {
    label: `Any ${tag.replace(/_/g, ' ')} (e.g. ${titleCase(hit.name)})`,
    sourceId: hit.sourceId,
    name: hit.name,
    image: hit.image,
    commonLocations: hit.commonLocations,
    cookingEffect: effect || undefined,
  };
}

function resolveSlot(
  slot: IngredientSlot,
  entries: SourceEntry[],
  staples: MerchantStaple[],
): ResolvedSlotExample {
  switch (slot.kind) {
    case 'item': {
      const entry = findEntry(slot.sourceId, entries);
      if (!entry) {
        return {
          label: `Item #${slot.sourceId}`,
          sourceId: slot.sourceId,
          name: `item-${slot.sourceId}`,
          commonLocations: [],
        };
      }
      const effect =
        entry.category === 'materials'
          ? entry.cookingEffect
          : entry.category === 'creatures' && entry.edible === true
            ? entry.cookingEffect
            : undefined;
      return {
        label: titleCase(entry.name),
        sourceId: entry.sourceId,
        name: entry.name,
        image: entry.image,
        commonLocations: entry.commonLocations,
        cookingEffect: effect || undefined,
      };
    }
    case 'staple': {
      const staple = findStaple(slot.stapleId, staples);
      if (!staple) {
        return {
          label: slot.stapleId,
          stapleId: slot.stapleId,
          name: slot.stapleId,
          commonLocations: [],
        };
      }
      return {
        label: staple.name,
        sourceId: staple.sourceId,
        stapleId: staple.stapleId,
        name: staple.name,
        image: stapleImagePath(staple),
        commonLocations: staple.commonLocations,
        cookingEffect: staple.cookingEffect || undefined,
      };
    }
    case 'tag': {
      const example = firstTagMatch(slot.tag, entries, staples, slot.excludeNames);
      if (example) {
        if ((slot.count ?? 1) > 1) {
          example.label = `${slot.count}× ${example.label}`;
        }
        return example;
      }
      return {
        label: `Any ${slot.tag.replace(/_/g, ' ')}`,
        name: slot.tag,
        commonLocations: [],
      };
    }
    case 'alternatives': {
      const options = slot.options.map((option) =>
        resolveSlot(option, entries, staples),
      );
      const first = options.find((option) => option.sourceId != null) ?? options[0]!;
      return {
        ...first,
        label: options.map((option) => option.label).join(' or '),
        alternativesNote: options.map((option) => option.label).join(' · '),
      };
    }
    case 'special':
      return {
        label: slot.note,
        name: 'special',
        commonLocations: [],
        optional: true,
      };
  }
}

function collectTagExamples(
  tag: string,
  count: number,
  distinct: boolean,
  entries: SourceEntry[],
  staples: MerchantStaple[],
  excludeNames?: string[],
): number[] {
  if (tag === 'meat') {
    const meats = staples.filter((s) =>
      (MEAT_STAPLE_IDS as readonly string[]).includes(s.stapleId),
    );
    const pool = distinct
      ? [...new Map(meats.map((m) => [m.name, m])).values()]
      : meats;
    return pool.slice(0, count).map((m) => m.sourceId);
  }

  const matches = entries.filter((entry) => {
    if (
      excludeNames?.some((ex) => {
        const lower = entry.name.toLowerCase();
        const needle = ex.toLowerCase().replace(/s$/, '');
        return (
          lower === ex.toLowerCase() ||
          lower === needle ||
          lower.includes(needle)
        );
      })
    ) {
      return false;
    }
    return entryMatchesTag(entry, tag as Parameters<typeof entryMatchesTag>[1]);
  });
  const pool = distinct
    ? [...new Map(matches.map((m) => [m.name, m])).values()]
    : matches;
  return pool.slice(0, count).map((entry) => entry.sourceId);
}

/** Resolve each recipe slot to a concrete example for UI + fill-pot. */
export function resolveRecipeSlots(
  recipe: Recipe,
  entries: SourceEntry[],
  staples: MerchantStaple[],
): ResolvedRecipeView {
  const slots = recipe.ingredients.map((slot) =>
    resolveSlot(slot, entries, staples),
  );
  const exampleSourceIds: number[] = [];

  for (const slot of recipe.ingredients) {
    if (slot.kind === 'tag') {
      const count = slot.count ?? 1;
      const ids = collectTagExamples(
        slot.tag,
        count,
        Boolean(slot.distinct),
        entries,
        staples,
        slot.excludeNames,
      );
      exampleSourceIds.push(...ids);
      continue;
    }

    const resolved = resolveSlot(slot, entries, staples);
    if (resolved.sourceId != null) {
      exampleSourceIds.push(resolved.sourceId);
    }
  }

  return {
    recipe,
    slots,
    exampleSourceIds: [...new Set(exampleSourceIds)].slice(0, 5),
  };
}

export function isElixirCritter(entry: SourceEntry): boolean {
  if (entry.category !== 'creatures') return false;
  return /(butterfly|darner|cricket|frog|lizard|firefly|beetle|fairy)/i.test(
    entry.name,
  );
}

export function toBrewRefWithFlags(entry: SourceEntry): BrewIngredientRef {
  const ref: BrewIngredientRef = {
    sourceId: entry.sourceId,
    name: entry.name,
  };

  if (entry.category === 'materials') {
    ref.cookingEffect = entry.cookingEffect;
    ref.heartsRecovered = entry.heartsRecovered;
  } else if (entry.category === 'creatures' && entry.edible === true) {
    ref.cookingEffect = entry.cookingEffect;
    ref.heartsRecovered = entry.heartsRecovered;
    if (isElixirCritter(entry)) {
      ref.isCritter = true;
    }
  } else if (entry.category === 'monsters') {
    ref.isMonsterPart = true;
  }

  return ref;
}
