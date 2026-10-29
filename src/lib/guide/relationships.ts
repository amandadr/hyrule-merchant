import { resolveRecipeSlots } from '@/lib/brew/resolve';
import { recipeOverlapScore } from '@/lib/brew/evaluate';
import { regionSlugForLocation } from '@/lib/brew/regions';
import {
  slugify,
  titleCaseName,
  type Product,
  type Region,
  type SourceEntry,
} from '@/lib/data/normalize';
import type { MerchantStaple, Outfit, Recipe } from '@/lib/data/schemas';

export interface GuideLink {
  href?: string;
  label: string;
  note?: string;
}

export interface GuideRelationships {
  product: GuideLink | null;
  locations: GuideLink[];
  drops: GuideLink[];
  droppedBy: GuideLink[];
  recipes: GuideLink[];
  packs: GuideLink[];
}

function dropsOf(entry: SourceEntry): string[] {
  if (entry.category === 'monsters' || entry.category === 'treasure') {
    return entry.drops;
  }
  if (entry.category === 'creatures' && entry.edible === false) {
    return entry.drops;
  }
  return [];
}

function findEntryByDropName(
  dropName: string,
  entries: SourceEntry[],
): SourceEntry | undefined {
  const needle = slugify(dropName);
  return entries.find((entry) => entry.slug === needle);
}

function isSellable(product: Product | undefined): product is Product {
  return Boolean(
    product &&
      product.stockStatus !== 'not_sold' &&
      product.stockStatus !== 'guide_only',
  );
}

/** Build shop / region / recipe / pack handoffs for a Field Manual entry. */
export function buildGuideRelationships(
  entry: SourceEntry,
  options: {
    products: Product[];
    entries: SourceEntry[];
    regions: Region[];
    recipes: Recipe[];
    outfits: Outfit[];
    staples: MerchantStaple[];
  },
): GuideRelationships {
  const { products, entries, regions, recipes, outfits, staples } = options;
  const productBySourceId = new Map(
    products.map((product) => [product.sourceId, product]),
  );
  const product = productBySourceId.get(entry.sourceId);

  const productLink: GuideLink | null = isSellable(product)
    ? {
        href: `/shop/${product.slug}`,
        label: `Buy ${titleCaseName(product.entry.name)} at the wagon`,
        note: `${product.priceRupees} rupees · ${product.stockStatus}`,
      }
    : null;

  const locations: GuideLink[] = [];
  const seenRegions = new Set<string>();
  for (const location of entry.commonLocations) {
    const regionSlug = regionSlugForLocation(location, regions);
    if (regionSlug && !seenRegions.has(regionSlug)) {
      seenRegions.add(regionSlug);
      const region = regions.find((item) => item.slug === regionSlug);
      locations.push({
        href: `/regions/${regionSlug}`,
        label: region ? titleCaseName(region.name) : titleCaseName(location),
        note: location,
      });
    }
  }

  const drops: GuideLink[] = [];
  for (const dropName of dropsOf(entry)) {
    const dropEntry = findEntryByDropName(dropName, entries);
    const dropProduct = dropEntry
      ? productBySourceId.get(dropEntry.sourceId)
      : undefined;
    if (isSellable(dropProduct)) {
      drops.push({
        href: `/shop/${dropProduct.slug}`,
        label: titleCaseName(dropName),
        note: 'Sold at the wagon',
      });
    } else if (dropEntry) {
      drops.push({
        href: `/guide/${dropEntry.category}/${dropEntry.slug}`,
        label: titleCaseName(dropName),
        note: 'Field Manual',
      });
    } else {
      drops.push({
        label: titleCaseName(dropName),
      });
    }
  }

  const droppedBy: GuideLink[] = [];
  const entryNameLower = entry.name.toLowerCase();
  for (const candidate of entries) {
    if (candidate.sourceId === entry.sourceId) continue;
    const candidateDrops = dropsOf(candidate);
    if (candidateDrops.some((drop) => drop.toLowerCase() === entryNameLower)) {
      droppedBy.push({
        href: `/guide/${candidate.category}/${candidate.slug}`,
        label: titleCaseName(candidate.name),
        note: candidate.category,
      });
    }
  }

  const recipeLinks: GuideLink[] = recipes
    .filter((recipe) => recipe.kind !== 'failure')
    .map((recipe) => ({
      recipe,
      overlap: recipeOverlapScore(recipe, new Set([entry.sourceId]), staples),
      resolved: resolveRecipeSlots(recipe, entries, staples),
    }))
    .filter(
      ({ overlap, resolved }) =>
        overlap.have > 0 || resolved.exampleSourceIds.includes(entry.sourceId),
    )
    .sort((a, b) => b.overlap.have - a.overlap.have)
    .slice(0, 4)
    .map(({ recipe }) => ({
      href: `/brew#${recipe.slug}`,
      label: recipe.name,
      note: recipe.kind,
    }));

  const packs: GuideLink[] = outfits
    .filter((outfit) => outfit.sourceIds.includes(entry.sourceId))
    .slice(0, 4)
    .map((outfit) => ({
      href: outfit.regionSlug
        ? `/regions/${outfit.regionSlug}`
        : `/shop?outfit=${outfit.slug}`,
      label: outfit.name,
      note: outfit.objective,
    }));

  return {
    product: productLink,
    locations: locations.slice(0, 6),
    drops: drops.slice(0, 8),
    droppedBy: droppedBy.slice(0, 6),
    recipes: recipeLinks,
    packs,
  };
}
