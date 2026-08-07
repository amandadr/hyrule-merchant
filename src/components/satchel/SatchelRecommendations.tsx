import { useStore } from '@nanostores/preact';
import { satchelItems } from '@/stores/satchel';
import {
  recommendFromSatchel,
  type RecommendationItem,
} from '@/lib/recommend/fromSatchel';
import type { Outfit, Recipe } from '@/lib/data/schemas';
import type { MerchantStaple } from '@/lib/data/schemas';
import type { Product, Region, SourceEntry } from '@/lib/data/normalize';

interface Props {
  products: Product[];
  recipes: Recipe[];
  regions: Region[];
  outfits: Outfit[];
  staples: MerchantStaple[];
  entries: SourceEntry[];
}

function titleCase(name: string): string {
  return name
    .split(' ')
    .map((part) => (part ? part[0]!.toUpperCase() + part.slice(1) : part))
    .join(' ');
}

function RecList({
  title,
  items,
}: {
  title: string;
  items: RecommendationItem[];
}) {
  if (items.length === 0) return null;
  return (
    <div class="stack">
      <h3 style={{ margin: 0 }}>{title}</h3>
      <ul class="rec-grid" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item) => (
          <li class="entry-card" key={`${item.kind}-${item.slug}`}>
            <a href={item.href}>
              <strong>{titleCase(item.title)}</strong>
              <div class="muted">{item.reason}</div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SatchelRecommendations({
  products,
  recipes,
  regions,
  outfits,
  staples,
  entries,
}: Props) {
  const items = useStore(satchelItems);
  const entriesBySourceId = new Map(
    entries.map((entry) => [entry.sourceId, entry]),
  );

  const recs = recommendFromSatchel({
    satchelSourceIds: items.map((item) => item.sourceId),
    products,
    recipes,
    regions,
    outfits,
    staples,
    entriesBySourceId,
  });

  const empty = items.length === 0;

  return (
    <div class="stack">
      <h2>{empty ? 'Suggested for the road' : 'Recommended for your road'}</h2>
      <p class="muted">
        {empty
          ? 'Your satchel is empty — here are curated starters.'
          : 'Based on what you are carrying right now (not purchase history).'}
      </p>
      <RecList title="Products" items={recs.products} />
      <RecList title="Recipes" items={recs.recipes} />
      <RecList title="Regions" items={recs.regions} />
      <RecList title="Outfit kits" items={recs.outfits} />
    </div>
  );
}
