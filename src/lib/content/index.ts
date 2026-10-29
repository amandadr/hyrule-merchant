import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ApiEnvelopeSchema,
  CreatureFoodSchema,
  CreatureNonFoodSchema,
  EquipmentSchema,
  MaterialSchema,
  MerchantStaplesFileSchema,
  MonsterSchema,
  OutfitsFileSchema,
  ProductOverridesFileSchema,
  RawRegionSchema,
  RecipesFileSchema,
  RegionOverridesFileSchema,
  TreasureSchema,
  type EntryCategory,
  type IngredientTag,
  type MerchantStaple,
  type Outfit,
  type RawEntry,
  type Recipe,
} from '../data/schemas';
import {
  normalizeEntry,
  normalizeRegion,
  type Product,
  type Region,
  type SourceEntry,
} from '../data/normalize';
import { enrichProducts, stapleToMaterialEntry } from '../data/enrich';
import { getEntriesByIngredientTag as filterByTag } from '../brew/tags';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const RAW_DIR = path.join(ROOT, 'src', 'data', 'raw');
const OVERRIDES_DIR = path.join(ROOT, 'src', 'data', 'overrides');

const CATEGORIES: EntryCategory[] = [
  'creatures',
  'equipment',
  'materials',
  'monsters',
  'treasure',
];

function readJson(filePath: string): unknown {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(
      `Failed to read ${filePath}. Run \`npm run ingest\` if snapshots are missing. (${String(error)})`,
    );
  }
}

function parseRawEntry(value: unknown): RawEntry {
  if (!value || typeof value !== 'object' || !('category' in value)) {
    throw new Error(`Entry missing category: ${JSON.stringify(value)}`);
  }

  const category = (value as { category: string }).category;

  switch (category) {
    case 'creatures': {
      const edible = (value as { edible?: boolean }).edible;
      if (edible === true) {
        return CreatureFoodSchema.parse(value);
      }
      if (edible === false) {
        return CreatureNonFoodSchema.parse(value);
      }
      throw new Error(`Creature missing edible flag: ${JSON.stringify(value)}`);
    }
    case 'equipment':
      return EquipmentSchema.parse(value);
    case 'materials':
      return MaterialSchema.parse(value);
    case 'monsters':
      return MonsterSchema.parse(value);
    case 'treasure':
      return TreasureSchema.parse(value);
    default:
      throw new Error(`Unknown category: ${category}`);
  }
}

let entriesCache: SourceEntry[] | null = null;
let productsCache: Product[] | null = null;
let staplesCache: MerchantStaple[] | null = null;
let recipesCache: Recipe[] | null = null;
let outfitsCache: Outfit[] | null = null;
let regionsCache: Region[] | null = null;

export function getAllEntries(): SourceEntry[] {
  if (entriesCache) {
    return entriesCache;
  }

  const snapshotPath = path.join(RAW_DIR, 'compendium-botw-latest.json');
  const envelope = ApiEnvelopeSchema.parse(readJson(snapshotPath));

  const entries: SourceEntry[] = [];
  const errors: string[] = [];

  envelope.data.forEach((item, index) => {
    try {
      entries.push(normalizeEntry(parseRawEntry(item)));
    } catch (error) {
      errors.push(`index ${index}: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  if (errors.length > 0) {
    const preview = errors.slice(0, 5).join('\n');
    throw new Error(
      `Failed to validate ${errors.length} compendium entries from ${snapshotPath}.\n${preview}`,
    );
  }

  entriesCache = entries;
  return entries;
}

export function getEntriesByCategory(category: EntryCategory): SourceEntry[] {
  return getAllEntries().filter((entry) => entry.category === category);
}

export function getEntryBySlug(
  category: EntryCategory,
  slug: string,
): SourceEntry | undefined {
  return getEntriesByCategory(category).find((entry) => entry.slug === slug);
}

export function getEntryBySourceId(sourceId: number): SourceEntry | undefined {
  const fromCompendium = getAllEntries().find((entry) => entry.sourceId === sourceId);
  if (fromCompendium) {
    return fromCompendium;
  }
  return getMerchantStapleEntries().find((entry) => entry.sourceId === sourceId);
}

export function getCategoryCounts(): Record<EntryCategory, number> {
  const counts = Object.fromEntries(
    CATEGORIES.map((category) => [category, 0]),
  ) as Record<EntryCategory, number>;

  for (const entry of getAllEntries()) {
    counts[entry.category] += 1;
  }

  return counts;
}

export function getCategories(): EntryCategory[] {
  return [...CATEGORIES];
}

export function isEntryCategory(value: string): value is EntryCategory {
  return (CATEGORIES as string[]).includes(value);
}

export function getMerchantStaples(): MerchantStaple[] {
  if (staplesCache) {
    return staplesCache;
  }

  const staplesPath = path.join(OVERRIDES_DIR, 'merchant-staples.json');
  const file = MerchantStaplesFileSchema.parse(readJson(staplesPath));
  staplesCache = file.staples;
  return staplesCache;
}

export function getMerchantStapleEntries(): SourceEntry[] {
  return getMerchantStaples().map(stapleToMaterialEntry);
}

export function getProducts(): Product[] {
  if (productsCache) {
    return productsCache;
  }

  const overridesPath = path.join(OVERRIDES_DIR, 'products.json');
  const overrides = ProductOverridesFileSchema.parse(readJson(overridesPath));
  productsCache = enrichProducts(
    getAllEntries(),
    overrides.products,
    getMerchantStaples(),
  );
  return productsCache;
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((product) => product.slug === slug);
}

export function getRecipes(): Recipe[] {
  if (recipesCache) {
    return recipesCache;
  }
  const recipesPath = path.join(OVERRIDES_DIR, 'recipes.json');
  recipesCache = RecipesFileSchema.parse(readJson(recipesPath)).recipes;
  return recipesCache;
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return getRecipes().find((recipe) => recipe.slug === slug);
}

export function getOutfits(): Outfit[] {
  if (outfitsCache) {
    return outfitsCache;
  }
  const outfitsPath = path.join(OVERRIDES_DIR, 'outfits.json');
  outfitsCache = OutfitsFileSchema.parse(readJson(outfitsPath)).outfits;
  return outfitsCache;
}

export function getOutfitBySlug(slug: string): Outfit | undefined {
  return getOutfits().find((outfit) => outfit.slug === slug);
}

export function getOutfitsForRegion(regionSlug: string): Outfit[] {
  return getOutfits().filter((outfit) => outfit.regionSlug === regionSlug);
}

export function getProductBySourceId(sourceId: number): Product | undefined {
  return getProducts().find((product) => product.sourceId === sourceId);
}

export function getProductsBySourceId(): Map<number, Product> {
  return new Map(getProducts().map((product) => [product.sourceId, product]));
}

export function getCookables(): SourceEntry[] {
  return getAllEntries().filter((entry) => {
    if (entry.category === 'materials') return true;
    if (entry.category === 'creatures' && entry.edible === true) return true;
    return false;
  });
}

export function getEntriesByLocation(location: string): SourceEntry[] {
  return getAllEntries().filter((entry) =>
    entry.commonLocations.includes(location),
  );
}

export function getEntriesByIngredientTag(tag: IngredientTag): SourceEntry[] {
  return filterByTag(getAllEntries(), tag);
}

export function getRegions(): Region[] {
  if (regionsCache) {
    return regionsCache;
  }

  const snapshotPath = path.join(RAW_DIR, 'regions-botw-latest.json');
  const envelope = ApiEnvelopeSchema.parse(readJson(snapshotPath));
  const regions: Region[] = [];
  const errors: string[] = [];

  envelope.data.forEach((item, index) => {
    try {
      regions.push(normalizeRegion(RawRegionSchema.parse(item)));
    } catch (error) {
      errors.push(`index ${index}: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  if (errors.length > 0) {
    throw new Error(
      `Failed to validate ${errors.length} regions from ${snapshotPath}.\n${errors.slice(0, 5).join('\n')}`,
    );
  }

  const overridesPath = path.join(OVERRIDES_DIR, 'regions.json');
  const overrides = RegionOverridesFileSchema.parse(readJson(overridesPath));
  const overrideBySlug = new Map(
    overrides.regions.map((override) => [override.slug, override]),
  );

  regionsCache = regions.map((region) => {
    const override = overrideBySlug.get(region.slug);
    if (!override) {
      return region;
    }
    return {
      ...region,
      overview: override.overview ?? region.overview,
      conditions: override.conditions ?? region.conditions,
      hazards: override.hazards ?? region.hazards,
      usefulFinds: override.usefulFinds ?? region.usefulFinds,
      routeNotes: override.routeNotes ?? region.routeNotes,
      merchantStory: override.merchantStory ?? region.merchantStory,
    };
  });
  return regionsCache;
}

export function getRegionBySlug(slug: string): Region | undefined {
  return getRegions().find((region) => region.slug === slug);
}

export { getDailyExperiment } from '../brew/daily';

export function getSourceMeta(): {
  game: string;
  retrievedAt: string;
  counts: { entries: number; regions: number };
} {
  const meta = readJson(path.join(RAW_DIR, 'source-meta.json')) as {
    game: string;
    retrievedAt: string;
    counts: { entries: number; regions: number };
  };
  return meta;
}
