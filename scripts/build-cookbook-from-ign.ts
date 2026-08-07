/**
 * Build src/data/overrides/recipes.json from the IGN reference corpus + existing elixirs.
 *
 * Usage: npx tsx scripts/build-cookbook-from-ign.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RecipesFileSchema, type Recipe } from '../src/lib/data/schemas';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ignPath = path.join(root, 'src/data/reference/ign-botw-cookbook.json');
const outPath = path.join(root, 'src/data/overrides/recipes.json');

type IgnIngredient = {
  kind: string;
  raw?: string;
  note?: string;
  name?: string;
  sourceId?: number | null;
  stapleId?: string;
  tag?: string;
  count?: number;
  distinct?: boolean;
  exclude?: string[];
  options?: IgnIngredient[];
};

type IgnRecipe = {
  slug: string;
  name: string;
  kind: string;
  recipeTypeId?: string;
  isFailureExample?: boolean;
  ingredients: IgnIngredient[];
  made?: string;
};

type IgnFile = {
  recipes: IgnRecipe[];
};

const EFFECT_NAME_PREFIXES: Array<[RegExp, string]> = [
  [/^spicy\b/i, 'cold resistance'],
  [/^pepper\b/i, 'cold resistance'],
  [/^sauteed peppers$/i, 'cold resistance'],
  [/^chilly\b/i, 'heat resistance'],
  [/^electro\b/i, 'shock resistance'],
  [/^hasty\b/i, 'speed up'],
  [/^sneaky\b/i, 'stealth up'],
  [/^mighty\b/i, 'attack up'],
  [/^tough\b/i, 'defense up'],
  [/^energizing\b/i, 'stamina recovery'],
  [/^enduring\b/i, 'extra stamina'],
  [/^hearty\b/i, 'hearts'],
  [/^fireproof\b/i, 'flame guard'],
];

const VARIABLE_TAGS = new Set([
  'mushroom',
  'fruit',
  'fish',
  'seafood',
  'crab',
  'porgy',
  'snail_or_crab',
  'vegetable',
  'vegetable_herb_flower',
  'carrot',
  'radish',
  'pumpkin',
  'carrot_or_pumpkin',
  'meat',
  'nut',
]);

function convertAtomic(ing: IgnIngredient): Record<string, unknown> {
  if (ing.kind === 'special') {
    return { kind: 'special', note: ing.raw ?? ing.note ?? 'Special requirement' };
  }
  if (ing.kind === 'tag') {
    const slot: Record<string, unknown> = {
      kind: 'tag',
      tag: ing.tag,
    };
    if (ing.count && ing.count !== 1) slot.count = ing.count;
    if (ing.distinct) slot.distinct = true;
    if (ing.exclude?.length) {
      slot.excludeNames = ing.exclude.map((name) =>
        name.toLowerCase().replace(/s$/, ''),
      );
    }
    return slot;
  }
  if (ing.kind === 'item') {
    if (ing.stapleId) {
      return { kind: 'staple', stapleId: ing.stapleId };
    }
    if (ing.sourceId == null) {
      throw new Error(`Item without sourceId/stapleId: ${ing.raw}`);
    }
    return { kind: 'item', sourceId: ing.sourceId };
  }
  throw new Error(`Unsupported atomic kind: ${ing.kind} (${ing.raw})`);
}

function convertSlot(ing: IgnIngredient): Record<string, unknown> {
  if (ing.kind === 'alternatives') {
    return {
      kind: 'alternatives',
      options: (ing.options ?? []).map(convertAtomic),
    };
  }
  return convertAtomic(ing);
}

function slotIsVariable(slot: Record<string, unknown>): boolean {
  if (slot.kind === 'tag') {
    return VARIABLE_TAGS.has(String(slot.tag));
  }
  if (slot.kind === 'alternatives') {
    return (slot.options as Record<string, unknown>[]).some(slotIsVariable);
  }
  return false;
}

function inferEffectFamily(
  recipe: IgnRecipe,
  slots: Record<string, unknown>[],
): string {
  if (recipe.isFailureExample) return 'none';
  for (const [pattern, effect] of EFFECT_NAME_PREFIXES) {
    if (pattern.test(recipe.name)) return effect;
  }
  if (recipe.recipeTypeId === 'monster_food') return 'variable';
  if (slots.some(slotIsVariable)) return 'variable';
  return 'hearts';
}

function bandFromSlots(
  slots: Record<string, unknown>[],
): { strengthBand: 'weak' | 'mid' | 'strong'; durationBand: 'short' | 'mid' | 'long' } {
  const count = slots.reduce((sum, slot) => {
    if (slot.kind === 'tag') return sum + (Number(slot.count) || 1);
    return sum + 1;
  }, 0);
  if (count >= 4) return { strengthBand: 'strong', durationBand: 'long' };
  if (count >= 3) return { strengthBand: 'mid', durationBand: 'mid' };
  return { strengthBand: 'weak', durationBand: 'short' };
}

function merchantNoteFor(recipe: IgnRecipe, previous?: Recipe): string {
  if (previous?.merchantNote) return previous.merchantNote;
  if (recipe.isFailureExample) {
    return 'Authored failure example from the cookbook reference.';
  }
  if (recipe.made) {
    return `Cookbook dish: ${recipe.made}. Merchant bands only — not a game-perfect formula.`;
  }
  return 'From the merchant cookbook. Effect and duration bands are simplified.';
}

function loadPreviousNotes(): Map<string, Recipe> {
  if (!fs.existsSync(outPath)) return new Map();
  const raw = JSON.parse(fs.readFileSync(outPath, 'utf8')) as { recipes: Recipe[] };
  return new Map(raw.recipes.map((recipe) => [recipe.slug, recipe]));
}

function main(): void {
  const ign = JSON.parse(fs.readFileSync(ignPath, 'utf8')) as IgnFile;
  const previous = loadPreviousNotes();
  const elixirs = [...previous.values()].filter((recipe) => recipe.kind === 'elixir');

  const meals: Recipe[] = ign.recipes.map((recipe) => {
    const prev = previous.get(recipe.slug);
    const ingredients = recipe.ingredients.map(convertSlot);
    const effectFamily =
      prev && !recipe.isFailureExample && prev.kind !== 'failure'
        ? prev.effectFamily
        : inferEffectFamily(recipe, ingredients);
    const bands = bandFromSlots(ingredients);
    const kind = recipe.isFailureExample ? 'failure' : 'meal';

    const built: Recipe = {
      slug: recipe.slug,
      name: recipe.name,
      kind,
      recipeTypeId: recipe.recipeTypeId as Recipe['recipeTypeId'],
      effectFamily,
      ingredients: ingredients as Recipe['ingredients'],
      merchantNote: merchantNoteFor(recipe, prev),
      image: `/images/recipes/${recipe.slug}.jpg`,
      sourceRefs: { ignSlug: recipe.slug },
    };

    if (kind !== 'failure') {
      built.strengthBand = prev?.strengthBand ?? bands.strengthBand;
      if (effectFamily === 'hearts') {
        if (prev?.durationBand) built.durationBand = prev.durationBand;
      } else {
        built.durationBand = prev?.durationBand ?? bands.durationBand;
      }
    }

    return built;
  });

  // Failures first among sides is fine; keep IGN order, append elixirs
  const recipes = [...meals, ...elixirs];
  const parsed = RecipesFileSchema.parse({ recipes });

  fs.writeFileSync(outPath, `${JSON.stringify(parsed, null, 2)}\n`);
  console.log(
    `Wrote ${parsed.recipes.length} recipes (${meals.length} meals/failures + ${elixirs.length} elixirs) → ${path.relative(root, outPath)}`,
  );
}

main();
