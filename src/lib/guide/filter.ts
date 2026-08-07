import type { SourceEntry } from '@/lib/data/normalize';

export type GuideSort = 'name' | 'id' | 'hearts';

export interface GuideFilterState {
  q: string;
  location: string;
  effect: string;
  dlc: 'any' | 'base' | 'dlc';
  edible: 'any' | 'yes' | 'no';
  hasDrops: 'any' | 'yes' | 'no';
  sort: GuideSort;
}

export interface GuideCardEntry {
  sourceId: number;
  slug: string;
  name: string;
  description: string;
  image: string;
  category: string;
  commonLocations: string[];
  dlc: boolean;
  cookingEffect?: string;
  heartsRecovered?: number;
  edible?: boolean;
  hasDrops?: boolean;
}

export const DEFAULT_GUIDE_FILTERS: GuideFilterState = {
  q: '',
  location: '',
  effect: '',
  dlc: 'any',
  edible: 'any',
  hasDrops: 'any',
  sort: 'name',
};

export function toGuideCardEntry(entry: SourceEntry): GuideCardEntry {
  const base: GuideCardEntry = {
    sourceId: entry.sourceId,
    slug: entry.slug,
    name: entry.name,
    description: entry.description,
    image: entry.image,
    category: entry.category,
    commonLocations: entry.commonLocations,
    dlc: entry.dlc,
  };

  if (entry.category === 'materials') {
    return {
      ...base,
      cookingEffect: entry.cookingEffect || undefined,
      heartsRecovered: entry.heartsRecovered,
    };
  }

  if (entry.category === 'creatures' && entry.edible === true) {
    return {
      ...base,
      edible: true,
      cookingEffect: entry.cookingEffect || undefined,
      heartsRecovered: entry.heartsRecovered,
    };
  }

  if (entry.category === 'creatures' && entry.edible === false) {
    return {
      ...base,
      edible: false,
      hasDrops: entry.drops.length > 0,
    };
  }

  if (entry.category === 'monsters' || entry.category === 'treasure') {
    return {
      ...base,
      hasDrops: entry.drops.length > 0,
    };
  }

  return base;
}

export function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export function collectLocations(entries: GuideCardEntry[]): string[] {
  return uniqueSorted(entries.flatMap((entry) => entry.commonLocations));
}

export function collectEffects(entries: GuideCardEntry[]): string[] {
  return uniqueSorted(
    entries
      .map((entry) => entry.cookingEffect)
      .filter((effect): effect is string => Boolean(effect)),
  );
}

export function parseGuideFilters(params: URLSearchParams): GuideFilterState {
  const sortRaw = params.get('sort') ?? 'name';
  const sort: GuideSort =
    sortRaw === 'id' || sortRaw === 'hearts' ? sortRaw : 'name';
  const dlcRaw = params.get('dlc') ?? 'any';
  const dlc =
    dlcRaw === 'base' || dlcRaw === 'dlc' || dlcRaw === 'any' ? dlcRaw : 'any';
  const edibleRaw = params.get('edible') ?? 'any';
  const edible =
    edibleRaw === 'yes' || edibleRaw === 'no' || edibleRaw === 'any'
      ? edibleRaw
      : 'any';
  const dropsRaw = params.get('drops') ?? 'any';
  const hasDrops =
    dropsRaw === 'yes' || dropsRaw === 'no' || dropsRaw === 'any'
      ? dropsRaw
      : 'any';

  return {
    q: params.get('q') ?? '',
    location: params.get('location') ?? '',
    effect: params.get('effect') ?? '',
    dlc,
    edible,
    hasDrops,
    sort,
  };
}

export function guideFiltersToSearchParams(state: GuideFilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (state.q.trim()) params.set('q', state.q.trim());
  if (state.location) params.set('location', state.location);
  if (state.effect) params.set('effect', state.effect);
  if (state.dlc !== 'any') params.set('dlc', state.dlc);
  if (state.edible !== 'any') params.set('edible', state.edible);
  if (state.hasDrops !== 'any') params.set('drops', state.hasDrops);
  if (state.sort !== 'name') params.set('sort', state.sort);
  return params;
}

export function filterGuideEntries(
  entries: GuideCardEntry[],
  state: GuideFilterState,
): GuideCardEntry[] {
  const q = state.q.trim().toLowerCase();

  const filtered = entries.filter((entry) => {
    if (q) {
      const haystack = `${entry.name} ${entry.description}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (state.location && !entry.commonLocations.includes(state.location)) {
      return false;
    }
    if (state.effect && entry.cookingEffect !== state.effect) {
      return false;
    }
    if (state.dlc === 'base' && entry.dlc) return false;
    if (state.dlc === 'dlc' && !entry.dlc) return false;
    if (state.edible === 'yes' && entry.edible !== true) return false;
    if (state.edible === 'no' && entry.edible !== false) return false;
    if (state.hasDrops === 'yes' && entry.hasDrops !== true) return false;
    if (state.hasDrops === 'no' && entry.hasDrops !== false) return false;
    return true;
  });

  return [...filtered].sort((a, b) => {
    if (state.sort === 'id') return a.sourceId - b.sourceId;
    if (state.sort === 'hearts') {
      const ah = a.heartsRecovered ?? -1;
      const bh = b.heartsRecovered ?? -1;
      if (bh !== ah) return bh - ah;
    }
    return a.name.localeCompare(b.name);
  });
}
