import type { IngredientSlot, Recipe } from '@/lib/data/schemas';
import type { MerchantStaple } from '@/lib/data/schemas';
import type { SourceEntry } from '@/lib/data/normalize';
import { entryMatchesTag, MEAT_STAPLE_IDS } from './tags';

export interface BrewIngredientRef {
  /** Compendium or synthetic staple sourceId */
  sourceId: number;
  stapleId?: string;
  name: string;
  cookingEffect?: string;
  heartsRecovered?: number;
  isMonsterPart?: boolean;
  /** Elixir critter (butterfly, frog, lizard, etc.) */
  isCritter?: boolean;
}

export interface BrewResult {
  ok: boolean;
  matchedRecipe?: Recipe;
  effectFamily: string;
  strengthBand?: 'weak' | 'mid' | 'strong';
  durationBand?: 'short' | 'mid' | 'long';
  heartsEstimate: number;
  merchantNote: string;
  failureReason?: string;
}

function cookingEffectOf(ref: BrewIngredientRef): string {
  return (ref.cookingEffect ?? '').trim().toLowerCase();
}

function slotMatches(
  slot: IngredientSlot,
  available: BrewIngredientRef[],
  used: Set<number>,
  staplesById: Map<string, MerchantStaple>,
): number[] | null {
  const unused = available.filter((ref) => !used.has(ref.sourceId));

  switch (slot.kind) {
    case 'item': {
      const hit = unused.find((ref) => ref.sourceId === slot.sourceId);
      return hit ? [hit.sourceId] : null;
    }
    case 'staple': {
      const staple = staplesById.get(slot.stapleId);
      if (!staple) return null;
      const hit = unused.find(
        (ref) =>
          ref.stapleId === slot.stapleId || ref.sourceId === staple.sourceId,
      );
      return hit ? [hit.sourceId] : null;
    }
    case 'tag': {
      const count = slot.count ?? 1;
      const matches = unused.filter((ref) => {
        if (slot.tag === 'meat') {
          return (
            Boolean(ref.stapleId) &&
            (MEAT_STAPLE_IDS as readonly string[]).includes(ref.stapleId!)
          );
        }
        return tagMatchesRef(ref, slot.tag, slot.excludeNames);
      });
      if (slot.distinct) {
        const distinct = [...new Map(matches.map((m) => [m.name, m])).values()];
        if (distinct.length < count) return null;
        return distinct.slice(0, count).map((item) => item.sourceId);
      }
      if (matches.length < count) return null;
      return matches.slice(0, count).map((item) => item.sourceId);
    }
    case 'alternatives': {
      for (const option of slot.options) {
        const hit = slotMatches(option, available, used, staplesById);
        if (hit !== null) return hit;
      }
      return null;
    }
    case 'special':
      return null;
  }
}

function nameExcluded(name: string, excludeNames?: string[]): boolean {
  if (!excludeNames?.length) return false;
  const lower = name.toLowerCase();
  return excludeNames.some((ex) => {
    const needle = ex.toLowerCase().replace(/s$/, '');
    return (
      lower === ex.toLowerCase() ||
      lower === needle ||
      lower.includes(needle)
    );
  });
}

function tagMatchesRef(
  ref: BrewIngredientRef,
  tag: string,
  excludeNames?: string[],
): boolean {
  const name = ref.name.toLowerCase();
  if (nameExcluded(name, excludeNames)) return false;

  switch (tag) {
    case 'mushroom':
      return name.includes('shroom') || name.includes('truffle');
    case 'fruit':
      return [
        'apple',
        'palm fruit',
        'wildberry',
        'hearty durian',
        'hydromelon',
        'voltfruit',
        'fleet-lotus seeds',
        'mighty bananas',
      ].includes(name);
    case 'nut':
      return name === 'acorn' || name === 'chickaloo tree nut';
    case 'fish':
      return /bass|trout|salmon|carp|porgy/.test(name);
    case 'crab':
      return name.includes('crab');
    case 'porgy':
      return name.includes('porgy');
    case 'seafood':
      return /bass|trout|salmon|carp|porgy|crab|snail/.test(name);
    case 'snail_or_crab':
      return name.includes('snail') || name.includes('crab');
    case 'radish':
      return name.includes('radish');
    case 'carrot':
      return name.includes('carrot');
    case 'pumpkin':
      return name.includes('pumpkin');
    case 'carrot_or_pumpkin':
      return name.includes('carrot') || name.includes('pumpkin');
    case 'vegetable':
    case 'vegetable_herb_flower':
      return /carrot|pumpkin|radish|herb|safflina|thistle|armoranth|nightshade|violet|princess/.test(
        name,
      );
    case 'gem_animal_or_monster_part':
      return Boolean(ref.isMonsterPart);
    default:
      return false;
  }
}

export function recipeMatchesIngredients(
  recipe: Recipe,
  ingredients: BrewIngredientRef[],
  staples: MerchantStaple[],
): boolean {
  if (recipe.kind === 'failure') return false;
  if (ingredients.length === 0) return false;

  const staplesById = new Map(staples.map((s) => [s.stapleId, s]));
  const used = new Set<number>();

  for (const slot of recipe.ingredients) {
    if (slot.kind === 'special') return false;
    const hits = slotMatches(slot, ingredients, used, staplesById);
    if (hits === null) return false;
    for (const id of hits) used.add(id);
  }

  // Named recipes: all provided ingredients should be consumed (exact fill)
  return used.size === ingredients.length;
}

export function findMatchingRecipes(
  recipes: Recipe[],
  ingredients: BrewIngredientRef[],
  staples: MerchantStaple[],
): Recipe[] {
  return recipes.filter((recipe) =>
    recipeMatchesIngredients(recipe, ingredients, staples),
  );
}

function bandFromCount(count: number): 'weak' | 'mid' | 'strong' {
  if (count >= 4) return 'strong';
  if (count >= 3) return 'mid';
  return 'weak';
}

function durationFromCount(count: number): 'short' | 'mid' | 'long' {
  if (count >= 4) return 'long';
  if (count >= 3) return 'mid';
  return 'short';
}

export function evaluateBrew(
  ingredients: BrewIngredientRef[],
  recipes: Recipe[],
  staples: MerchantStaple[],
): BrewResult {
  if (ingredients.length < 1 || ingredients.length > 5) {
    return {
      ok: false,
      effectFamily: 'none',
      heartsEstimate: 0,
      merchantNote: 'Choose 1–5 ingredients for the pot.',
      failureReason: 'invalid_count',
    };
  }

  const matched = findMatchingRecipes(recipes, ingredients, staples)[0];
  if (matched) {
    return {
      ok: true,
      matchedRecipe: matched,
      effectFamily: matched.effectFamily,
      strengthBand: matched.strengthBand,
      durationBand: matched.durationBand,
      heartsEstimate: ingredients.reduce(
        (sum, item) => sum + (item.heartsRecovered ?? 0),
        0,
      ),
      merchantNote: matched.merchantNote,
    };
  }

  const effects = [
    ...new Set(
      ingredients.map(cookingEffectOf).filter((effect) => effect.length > 0),
    ),
  ];
  const hasMonsterPart = ingredients.some((item) => item.isMonsterPart);
  const hasCritter = ingredients.some((item) => item.isCritter);
  const hasMealish = ingredients.some(
    (item) => !item.isMonsterPart && !item.isCritter,
  );
  const conflicting = effects.length > 1;

  // Elixir free-brew: critter + monster part, no meal staples/materials mixed in
  if (hasMonsterPart && hasCritter && !hasMealish && !conflicting) {
    const effectFamily = effects[0] || 'variable';
    const count = ingredients.length;
    return {
      ok: true,
      effectFamily,
      strengthBand: bandFromCount(count),
      durationBand: durationFromCount(count),
      heartsEstimate: 0,
      merchantNote: `An improvised ${effectFamily} elixir. The critter sets the effect, and the monster part stretches it.`,
    };
  }

  if (hasMonsterPart && hasCritter && hasMealish) {
    const failure = recipes.find((recipe) => recipe.slug === 'dubious-food');
    return {
      ok: false,
      matchedRecipe: failure,
      effectFamily: 'none',
      heartsEstimate: 1,
      merchantNote:
        'Meals and elixirs do not share a pot. Separate the critters from the stew.',
      failureReason: 'meal_elixir_mix',
    };
  }

  if (hasMonsterPart && !hasCritter) {
    return {
      ok: false,
      effectFamily: 'none',
      heartsEstimate: 0,
      merchantNote:
        'Monster parts alone do not brew. Add an effect critter for an elixir, or leave them out of meals.',
      failureReason: 'monster_without_critter',
    };
  }

  if (hasCritter && !hasMonsterPart && ingredients.every((i) => i.isCritter)) {
    return {
      ok: false,
      effectFamily: 'none',
      heartsEstimate: 0,
      merchantNote:
        'A critter needs a monster part before it will make an elixir.',
      failureReason: 'critter_without_monster',
    };
  }

  const dubious = conflicting || (hasMonsterPart && hasMealish);

  if (dubious) {
    const failure = recipes.find((recipe) => recipe.slug === 'dubious-food');
    return {
      ok: false,
      matchedRecipe: failure,
      effectFamily: 'none',
      heartsEstimate: Math.max(
        1,
        Math.floor(
          ingredients.reduce((sum, item) => sum + (item.heartsRecovered ?? 0), 0) /
            2,
        ),
      ),
      merchantNote:
        failure?.merchantNote ??
        'That combination turns into dubious food. Try one effect at a time, or follow a named recipe.',
      failureReason: conflicting ? 'conflicting_effects' : 'monster_in_meal',
    };
  }

  const effectFamily = effects[0] || 'hearts';
  const count = ingredients.length;

  return {
    ok: true,
    effectFamily,
    strengthBand: bandFromCount(count),
    durationBand:
      effectFamily === 'hearts' ? undefined : durationFromCount(count),
    heartsEstimate: ingredients.reduce(
      (sum, item) => sum + (item.heartsRecovered ?? 0),
      0,
    ),
    merchantNote:
      effectFamily === 'hearts'
        ? 'A simple restorative dish. No named recipe matched, but the pot is honest.'
        : `An improvised ${effectFamily} dish. The strength and duration shown are Sorrel’s estimate.`,
  };
}

export function recipeOverlapScore(
  recipe: Recipe,
  ownedSourceIds: Set<number>,
  staples: MerchantStaple[],
): { have: number; need: number } {
  const staplesById = new Map(staples.map((s) => [s.stapleId, s]));
  let have = 0;
  let need = 0;

  for (const slot of recipe.ingredients) {
    if (slot.kind === 'special') continue;
    need += 1;

    const fakeAvailable: BrewIngredientRef[] = [...ownedSourceIds].map((sourceId) => {
      const staple = staples.find((s) => s.sourceId === sourceId);
      return {
        sourceId,
        stapleId: staple?.stapleId,
        name: staple?.name ?? String(sourceId),
      };
    });

    const hit = slotMatches(slot, fakeAvailable, new Set(), staplesById);
    if (hit !== null) have += 1;
  }

  return { have, need };
}

export function toBrewRefFromEntry(entry: SourceEntry): BrewIngredientRef {
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
    if (/(butterfly|darner|cricket|frog|lizard|firefly|beetle|fairy)/i.test(entry.name)) {
      ref.isCritter = true;
    }
  } else if (entry.category === 'monsters') {
    ref.isMonsterPart = true;
  }

  return ref;
}

export function toBrewRefFromStaple(staple: MerchantStaple): BrewIngredientRef {
  return {
    sourceId: staple.sourceId,
    stapleId: staple.stapleId,
    name: staple.name,
    cookingEffect: staple.cookingEffect,
    heartsRecovered: staple.heartsRecovered,
  };
}
