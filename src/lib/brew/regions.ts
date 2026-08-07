import type { Region } from '@/lib/data/normalize';

/** Map a free-text commonLocations string to a region slug when tokens overlap. */
export function regionSlugForLocation(
  location: string,
  regions: Region[],
): string | undefined {
  const loc = location.toLowerCase();
  let best: { slug: string; score: number } | undefined;

  for (const region of regions) {
    let score = 0;
    const name = region.name.toLowerCase();
    if (loc.includes(name) || name.includes(loc.split(' ')[0]!)) score += 3;
    for (const part of region.slug.split('-')) {
      if (part.length > 2 && loc.includes(part)) score += 2;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { slug: region.slug, score };
    }
  }

  return best?.slug;
}
