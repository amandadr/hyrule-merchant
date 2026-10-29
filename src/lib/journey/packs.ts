import type { Outfit } from '@/lib/data/schemas';
import type { Product } from '@/lib/data/normalize';
import { titleCaseName } from '@/lib/data/normalize';

export interface ResolvedPackItem {
  sourceId: number;
  quantity: number;
  reason: string;
  product: Product;
  lineTotal: number;
}

export interface ResolvedJourneyPack {
  outfit: Outfit;
  items: ResolvedPackItem[];
  totalRupees: number;
  missingSourceIds: number[];
}

/** Resolve authored pack lines against the shop catalogue. */
export function resolveJourneyPack(
  outfit: Outfit,
  productsBySourceId: Map<number, Product>,
): ResolvedJourneyPack {
  const items: ResolvedPackItem[] = [];
  const missingSourceIds: number[] = [];

  for (const line of outfit.items) {
    const product = productsBySourceId.get(line.sourceId);
    if (!product) {
      missingSourceIds.push(line.sourceId);
      continue;
    }
    if (
      product.stockStatus === 'not_sold' ||
      product.stockStatus === 'guide_only'
    ) {
      missingSourceIds.push(line.sourceId);
      continue;
    }
    items.push({
      sourceId: line.sourceId,
      quantity: line.quantity,
      reason: line.reason,
      product,
      lineTotal: product.priceRupees * line.quantity,
    });
  }

  return {
    outfit,
    items,
    totalRupees: items.reduce((sum, item) => sum + item.lineTotal, 0),
    missingSourceIds,
  };
}

export function packItemLabel(product: Product): string {
  return titleCaseName(product.entry.name);
}

/** The kit's picture is the goods inside it, in pack order. */
export function kitFace(
  outfit: Outfit,
  productsBySourceId: Map<number, Product>,
): Array<{ image: string; name: string }> {
  return resolveJourneyPack(outfit, productsBySourceId).items.map((item) => ({
    image: item.product.entry.image,
    name: packItemLabel(item.product),
  }));
}

/** Slim payload for the client island (no full Product objects). */
export function toPackCardPayload(resolved: ResolvedJourneyPack) {
  return {
    slug: resolved.outfit.slug,
    name: resolved.outfit.name,
    objective: resolved.outfit.objective,
    merchantNote: resolved.outfit.merchantNote,
    regionSlug: resolved.outfit.regionSlug,
    totalRupees: resolved.totalRupees,
    items: resolved.items.map((item) => ({
      productSlug: item.product.slug,
      sourceId: item.sourceId,
      name: packItemLabel(item.product),
      image: item.product.entry.image,
      priceRupees: item.product.priceRupees,
      quantity: item.quantity,
      stockStatus: item.product.stockStatus,
      reason: item.reason,
      lineTotal: item.lineTotal,
      href: `/shop/${item.product.slug}`,
    })),
  };
}

export type JourneyPackCardPayload = ReturnType<typeof toPackCardPayload>;
