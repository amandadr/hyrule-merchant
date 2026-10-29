import { useEffect, useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { satchelItems } from '@/stores/satchel';
import {
  recommendFromSatchel,
  type RecommendationItem,
  type RecommendationResult,
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

const KIND_WEIGHT: Record<RecommendationItem['kind'], number> = {
  outfit: 4,
  recipe: 3,
  region: 2,
  product: 1,
};

const TAG_LABEL: Record<RecommendationItem['kind'], string> = {
  outfit: 'Pack',
  recipe: 'Recipe',
  region: 'Place',
  product: 'Supply',
};

const ACTION_LABEL: Record<RecommendationItem['kind'], string> = {
  outfit: 'Open the journey pack →',
  recipe: 'Head to the brew bench →',
  region: 'Read Sorrel’s route notes →',
  product: 'See it in the shop →',
};

function TypeGlyph({ kind }: { kind: RecommendationItem['kind'] }) {
  if (kind === 'outfit') {
    return (
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
        <path
          d="M4 6h8l1 7H3l1-7z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.3"
        />
        <path d="M6 6V4.5a2 2 0 0 1 4 0V6" fill="none" stroke="currentColor" stroke-width="1.3" />
      </svg>
    );
  }
  if (kind === 'recipe') {
    return (
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
        <path d="M3 7h10v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7z" fill="none" stroke="currentColor" stroke-width="1.3" />
        <path d="M13 8h1.5a1 1 0 0 1 0 3H13" fill="none" stroke="currentColor" stroke-width="1.3" />
        <path d="M6 4.5s.6-.8 0-1.5M9 4.5s.6-.8 0-1.5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
      </svg>
    );
  }
  if (kind === 'region') {
    return (
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
        <path
          d="M8 1.5c2.5 0 4 1.9 4 4.2C12 9 8 14.5 8 14.5S4 9 4 5.7C4 3.4 5.5 1.5 8 1.5z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.3"
        />
        <circle cx="8" cy="5.8" r="1.4" fill="currentColor" />
      </svg>
    );
  }
  // product / supply — leaf
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path
        d="M13 3C7 3 3 6 3 11c0 1 0 2 .5 2.5C7 10 9 8 12 6.5 9.5 8.8 6.8 11 5 13.5c4.5.5 8-2.5 8-7 0-1.5 0-3 0-3.5z"
        fill="none"
        stroke="currentColor"
        stroke-width="1.2"
      />
    </svg>
  );
}

function RecTypeTag({ kind }: { kind: RecommendationItem['kind'] }) {
  return (
    <span class={`rec-type-tag rec-type-${kind}`}>
      <TypeGlyph kind={kind} />
      <span>{TAG_LABEL[kind]}</span>
    </span>
  );
}

/** Reframe an engine recommendation into reason-first card copy. */
function cardCopy(item: RecommendationItem): { why: string; what: string | null } {
  const name = titleCase(item.title);
  switch (item.kind) {
    case 'outfit':
      return { why: `You’re nearly ready for ${name}`, what: item.reason };
    case 'region':
      return { why: `Your pack points toward ${name}`, what: null };
    case 'recipe':
      return { why: item.reason, what: name };
    case 'product':
    default:
      return { why: item.reason, what: name };
  }
}

function sorrelLine(res: RecommendationResult, empty: boolean): string {
  if (empty) {
    return 'Your satchel’s empty — here’s where most travellers start.';
  }
  const hasCookable = res.recipes.some((r) =>
    r.reason.toLowerCase().includes('everything'),
  );
  if (hasCookable) {
    return 'You’ve got a meal ready. I’d think about where you’re headed next.';
  }
  if (res.outfits.length > 0) {
    return 'You’re partway into a kit — worth finishing before you go.';
  }
  if (res.regions.length > 0) {
    return 'Your supplies point somewhere. Let’s talk about the road.';
  }
  if (res.recipes.length > 0) {
    return 'Good start on a dish. A couple more things and you’re cooking.';
  }
  return 'Here’s what stands out, looking at what you’re carrying.';
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
  const [showAll, setShowAll] = useState(false);

  // The satchel lives in localStorage, so the server renders an empty-satchel
  // fallback whose hrefs would otherwise be frozen into the hydrated markup
  // (Preact skips attribute patching on reused SSR DOM). Render only after
  // mount so the DOM — and every recipe link — is built client-side.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

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

  const merged: RecommendationItem[] = [
    ...recs.outfits,
    ...recs.recipes,
    ...recs.regions,
    ...recs.products,
  ].sort(
    (a, b) =>
      KIND_WEIGHT[b.kind] * 1000 + b.score -
      (KIND_WEIGHT[a.kind] * 1000 + a.score),
  );

  if (merged.length === 0) {
    return null;
  }

  const TOP = 3;
  const visible = showAll ? merged : merged.slice(0, TOP);
  const hasMore = merged.length > TOP;

  let pipUsed = false;

  return (
    <section class="stack before-you-go">
      <div class="before-you-go-head">
        <img
          class="sorrel-portrait"
          src="/images/Sorrel.png"
          alt="Sorrel, the merchant"
          width="64"
          height="64"
          loading="lazy"
        />
        <div>
          <h2 class="before-you-go-title">Before you go…</h2>
          <p class="sorrel-line">“{sorrelLine(recs, empty)}”</p>
        </div>
      </div>

      <ul class="rec-list">
        {visible.map((item) => {
          const { why, what } = cardCopy(item);
          const showPip = item.kind === 'region' && !pipUsed;
          if (showPip) pipUsed = true;
          return (
            <li class="rec-card" key={`${item.kind}-${item.slug}`}>
              <RecTypeTag kind={item.kind} />
              <p class="rec-why">{why}</p>
              {what ? <p class="rec-what">{what}</p> : null}
              {showPip ? (
                <p class="pip-note">
                  <img
                    class="pip-portrait"
                    src="/images/Pip.png"
                    alt="Pip, the Korok"
                    width="20"
                    height="20"
                    loading="lazy"
                  />
                  <span>
                    <strong>Pip says:</strong> {titleCase(item.title)} has a good
                    tree.
                  </span>
                </p>
              ) : null}
              <a class="rec-action" href={item.href}>
                {ACTION_LABEL[item.kind]}
              </a>
            </li>
          );
        })}
      </ul>

      {hasMore ? (
        <button
          type="button"
          class="link-button rec-more"
          aria-expanded={showAll ? 'true' : 'false'}
          onClick={() => setShowAll((open) => !open)}
        >
          {showAll ? 'Fewer suggestions' : 'More suggestions'}
        </button>
      ) : null}
    </section>
  );
}
