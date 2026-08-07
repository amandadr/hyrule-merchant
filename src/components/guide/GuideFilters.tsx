import { useEffect, useMemo, useState } from 'preact/hooks';
import {
  DEFAULT_GUIDE_FILTERS,
  filterGuideEntries,
  guideFiltersToSearchParams,
  parseGuideFilters,
  type GuideCardEntry,
  type GuideFilterState,
  type GuideSort,
} from '@/lib/guide/filter';

function titleCase(name: string): string {
  return name
    .split(' ')
    .map((part) => (part ? part[0]!.toUpperCase() + part.slice(1) : part))
    .join(' ');
}

interface Props {
  category: string;
  entries: GuideCardEntry[];
  locations: string[];
  effects: string[];
  showEdible: boolean;
  showDrops: boolean;
  showHeartsSort: boolean;
}

export default function GuideFilters({
  category,
  entries,
  locations,
  effects,
  showEdible,
  showDrops,
  showHeartsSort,
}: Props) {
  const [filters, setFilters] = useState<GuideFilterState>(DEFAULT_GUIDE_FILTERS);

  useEffect(() => {
    setFilters(parseGuideFilters(new URLSearchParams(window.location.search)));
  }, []);

  useEffect(() => {
    const params = guideFiltersToSearchParams(filters);
    const next = params.toString();
    const url = next
      ? `${window.location.pathname}?${next}`
      : window.location.pathname;
    window.history.replaceState({}, '', url);
  }, [filters]);

  const visible = useMemo(
    () => filterGuideEntries(entries, filters),
    [entries, filters],
  );

  function update<K extends keyof GuideFilterState>(
    key: K,
    value: GuideFilterState[K],
  ): void {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function reset(): void {
    setFilters(DEFAULT_GUIDE_FILTERS);
  }

  const hasActive =
    filters.q.trim() !== '' ||
    filters.location !== '' ||
    filters.effect !== '' ||
    filters.dlc !== 'any' ||
    filters.edible !== 'any' ||
    filters.hasDrops !== 'any' ||
    filters.sort !== 'name';

  return (
    <div class="stack">
      <form
        class="filter-panel"
        onSubmit={(event) => event.preventDefault()}
        aria-label={`Filter ${category}`}
      >
        <label>
          <span class="muted">Search</span>
          <input
            type="search"
            value={filters.q}
            placeholder="Name or description"
            onInput={(event) =>
              update('q', (event.target as HTMLInputElement).value)
            }
          />
        </label>

        <label>
          <span class="muted">Location</span>
          <select
            value={filters.location}
            onChange={(event) =>
              update('location', (event.target as HTMLSelectElement).value)
            }
          >
            <option value="">Any location</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </label>

        {effects.length > 0 ? (
          <label>
            <span class="muted">Cooking effect</span>
            <select
              value={filters.effect}
              onChange={(event) =>
                update('effect', (event.target as HTMLSelectElement).value)
              }
            >
              <option value="">Any effect</option>
              {effects.map((effect) => (
                <option key={effect} value={effect}>
                  {effect}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label>
          <span class="muted">DLC</span>
          <select
            value={filters.dlc}
            onChange={(event) =>
              update(
                'dlc',
                (event.target as HTMLSelectElement).value as GuideFilterState['dlc'],
              )
            }
          >
            <option value="any">Any</option>
            <option value="base">Base game</option>
            <option value="dlc">DLC only</option>
          </select>
        </label>

        {showEdible ? (
          <label>
            <span class="muted">Edible</span>
            <select
              value={filters.edible}
              onChange={(event) =>
                update(
                  'edible',
                  (event.target as HTMLSelectElement)
                    .value as GuideFilterState['edible'],
                )
              }
            >
              <option value="any">Any</option>
              <option value="yes">Edible</option>
              <option value="no">Non-food</option>
            </select>
          </label>
        ) : null}

        {showDrops ? (
          <label>
            <span class="muted">Drops</span>
            <select
              value={filters.hasDrops}
              onChange={(event) =>
                update(
                  'hasDrops',
                  (event.target as HTMLSelectElement)
                    .value as GuideFilterState['hasDrops'],
                )
              }
            >
              <option value="any">Any</option>
              <option value="yes">Has drops</option>
              <option value="no">No drops listed</option>
            </select>
          </label>
        ) : null}

        <label>
          <span class="muted">Sort</span>
          <select
            value={filters.sort}
            onChange={(event) =>
              update('sort', (event.target as HTMLSelectElement).value as GuideSort)
            }
          >
            <option value="name">Name A–Z</option>
            <option value="id">Id</option>
            {showHeartsSort ? (
              <option value="hearts">Hearts high → low</option>
            ) : null}
          </select>
        </label>

        <div class="filter-actions">
          <button type="button" onClick={reset} disabled={!hasActive}>
            Reset filters
          </button>
          <p class="muted" style={{ margin: 0 }}>
            Showing {visible.length} of {entries.length}
          </p>
        </div>
      </form>

      {visible.length === 0 ? (
        <p class="notice">
          No entries match these filters.{' '}
          <button type="button" onClick={reset}>
            Clear filters
          </button>
        </p>
      ) : (
        <ul class="grid-list">
          {visible.map((entry) => (
            <li class="entry-card" key={entry.sourceId}>
              <a href={`/guide/${category}/${entry.slug}`}>
                <img
                  src={entry.image}
                  alt=""
                  width="80"
                  height="80"
                  loading="lazy"
                />
                <strong>{titleCase(entry.name)}</strong>
                <div class="muted">
                  <span class="badge">{entry.category}</span>
                  {entry.cookingEffect ? (
                    <span class="badge">{entry.cookingEffect}</span>
                  ) : null}
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
