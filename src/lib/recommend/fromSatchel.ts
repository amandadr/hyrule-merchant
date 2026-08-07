import type { Outfit, Recipe } from '@/lib/data/schemas';
import type { MerchantStaple } from '@/lib/data/schemas';
import type { Product, Region, SourceEntry } from '@/lib/data/normalize';
import { recipeOverlapScore } from '@/lib/brew/evaluate';

export interface RecommendationItem {
  kind: 'product' | 'recipe' | 'region' | 'outfit';
  slug: string;
  title: string;
  href: string;
  reason: string;
  score: number;
}

export interface RecommendationResult {
  products: RecommendationItem[];
  recipes: RecommendationItem[];
  regions: RecommendationItem[];
  outfits: RecommendationItem[];
}

function cookingEffect(entry: SourceEntry): string {
  if (entry.category === 'materials') return entry.cookingEffect || '';
  if (entry.category === 'creatures' && entry.edible === true) {
    return entry.cookingEffect || '';
  }
  return '';
}

export function recommendFromSatchel(input: {
  satchelSourceIds: number[];
  products: Product[];
  recipes: Recipe[];
  regions: Region[];
  outfits: Outfit[];
  staples: MerchantStaple[];
  entriesBySourceId: Map<number, SourceEntry>;
}): RecommendationResult {
  const owned = new Set(input.satchelSourceIds);
  const ownedEntries = input.satchelSourceIds
    .map((id) => input.entriesBySourceId.get(id))
    .filter((entry): entry is SourceEntry => Boolean(entry));

  if (owned.size === 0) {
    const featured = input.products
      .filter((product) => product.stockStatus === 'available')
      .slice(0, 3)
      .map((product, index) => ({
        kind: 'product' as const,
        slug: product.slug,
        title: product.entry.name,
        href: `/shop/${product.slug}`,
        reason: 'Featured for empty satchels',
        score: 10 - index,
      }));

    return {
      products: featured,
      recipes: input.recipes
        .filter((recipe) => recipe.kind !== 'failure')
        .slice(0, 2)
        .map((recipe, index) => ({
          kind: 'recipe' as const,
          slug: recipe.slug,
          title: recipe.name,
          href: `/brew#${recipe.slug}`,
          reason: 'A simple recipe to start the pot',
          score: 5 - index,
        })),
      regions: input.regions.slice(0, 1).map((region) => ({
        kind: 'region' as const,
        slug: region.slug,
        title: region.name,
        href: `/regions/${region.slug}`,
        reason: 'A road worth studying',
        score: 3,
      })),
      outfits: input.outfits.slice(0, 1).map((outfit) => ({
        kind: 'outfit' as const,
        slug: outfit.slug,
        title: outfit.name,
        href: `/shop?outfit=${outfit.slug}`,
        reason: outfit.merchantNote,
        score: 3,
      })),
    };
  }

  const ownedLocations = new Set(
    ownedEntries.flatMap((entry) => entry.commonLocations),
  );
  const ownedEffects = new Set(
    ownedEntries.map(cookingEffect).filter(Boolean),
  );

  const productRecs: RecommendationItem[] = [];
  for (const product of input.products) {
    if (owned.has(product.sourceId)) continue;
    let score = 0;
    const reasons: string[] = [];
    const sharedLoc = product.entry.commonLocations.filter((loc) =>
      ownedLocations.has(loc),
    );
    if (sharedLoc.length > 0) {
      score += sharedLoc.length * 2;
      reasons.push(`Shares roads near ${sharedLoc[0]}`);
    }
    const effect = cookingEffect(product.entry);
    if (effect && ownedEffects.has(effect)) {
      score += 3;
      reasons.push(`Pairs with your ${effect} goods`);
    }
    if (score > 0) {
      productRecs.push({
        kind: 'product',
        slug: product.slug,
        title: product.entry.name,
        href: `/shop/${product.slug}`,
        reason: reasons[0] ?? 'Related to your satchel',
        score,
      });
    }
  }

  const recipeRecs: RecommendationItem[] = [];
  for (const recipe of input.recipes) {
    if (recipe.kind === 'failure') continue;
    const { have, need } = recipeOverlapScore(recipe, owned, input.staples);
    if (have === 0 || need === 0) continue;
    const score = have * 4 + (have === need ? 5 : 0);
    recipeRecs.push({
      kind: 'recipe',
      slug: recipe.slug,
      title: recipe.name,
      href: `/brew#${recipe.slug}`,
      reason:
        have === need
          ? 'You already have everything for this dish'
          : `You have ${have} of ${need} ingredients`,
      score,
    });
  }

  const regionRecs: RecommendationItem[] = [];
  for (const region of input.regions) {
    let score = 0;
    for (const loc of ownedLocations) {
      if (loc.toLowerCase().includes(region.name.toLowerCase().split(' ')[0]!)) {
        score += 3;
      }
      if (region.name.toLowerCase().includes(loc.toLowerCase().split(' ')[0]!)) {
        score += 2;
      }
    }
    // Also match common location tokens against region slug keywords
    for (const loc of ownedLocations) {
      const token = loc.toLowerCase();
      if (
        token.includes(region.slug.replace(/-/g, ' ')) ||
        region.slug.split('-').some((part) => token.includes(part))
      ) {
        score += 2;
      }
    }
    if (score > 0) {
      regionRecs.push({
        kind: 'region',
        slug: region.slug,
        title: region.name,
        href: `/regions/${region.slug}`,
        reason: 'Locations in your goods point this way',
        score,
      });
    }
  }

  const outfitRecs: RecommendationItem[] = [];
  for (const outfit of input.outfits) {
    const have = outfit.sourceIds.filter((id) => owned.has(id)).length;
    if (have === 0) continue;
    outfitRecs.push({
      kind: 'outfit',
      slug: outfit.slug,
      title: outfit.name,
      href: `/shop?outfit=${outfit.slug}`,
      reason: `You own ${have} of ${outfit.sourceIds.length} pieces`,
      score: have * 5,
    });
  }

  const sortCap = <T extends RecommendationItem>(items: T[], cap: number) =>
    [...items].sort((a, b) => b.score - a.score).slice(0, cap);

  return {
    products: sortCap(productRecs, 3),
    recipes: sortCap(recipeRecs, 2),
    regions: sortCap(regionRecs, 2),
    outfits: sortCap(outfitRecs, 1),
  };
}
