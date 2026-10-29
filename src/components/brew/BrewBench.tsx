import type { ComponentChildren } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { addToSatchel, satchelItems } from '@/stores/satchel';
import {
  evaluateBrew,
  type BrewIngredientRef,
} from '@/lib/brew/evaluate';
import {
  resolveRecipeSlots,
  type ResolvedSlotExample,
} from '@/lib/brew/resolve';
import { regionSlugForLocation } from '@/lib/brew/regions';
import type { Recipe } from '@/lib/data/schemas';
import type { MerchantStaple } from '@/lib/data/schemas';
import type { Region, SourceEntry, StockStatus } from '@/lib/data/normalize';
import {
  BrewEffectSummary,
  EffectFamilyChip,
  HeartsDisplay,
} from '@/components/brew/EffectBadges';

export type BrewGroup = 'material' | 'creature' | 'staple' | 'monster';

export interface BrewPickerItem {
  sourceId: number;
  stapleId?: string;
  name: string;
  cookingEffect?: string;
  heartsRecovered?: number;
  isMonsterPart?: boolean;
  isCritter?: boolean;
  image: string;
  group: BrewGroup;
  commonLocations: string[];
}

export interface BrewShopProduct {
  slug: string;
  sourceId: number;
  name: string;
  priceRupees: number;
  stockStatus: StockStatus;
}

interface Props {
  pickerItems: BrewPickerItem[];
  recipes: Recipe[];
  staples: MerchantStaple[];
  entries: SourceEntry[];
  regions: Region[];
  products: BrewShopProduct[];
}

const GROUPS: { id: BrewGroup; label: string }[] = [
  { id: 'material', label: 'Materials' },
  { id: 'creature', label: 'Creatures' },
  { id: 'staple', label: 'Pantry staples' },
  { id: 'monster', label: 'Monster parts' },
];

function titleCase(name: string): string {
  return name
    .split(' ')
    .map((part) => (part ? part[0]!.toUpperCase() + part.slice(1) : part))
    .join(' ');
}

function LocationLinks({
  locations,
  regions,
  linkRegions = true,
}: {
  locations: string[];
  regions: Region[];
  linkRegions?: boolean;
}) {
  const shown = locations.slice(0, 3);
  if (shown.length === 0) {
    return <p class="brew-meta muted">Locations unknown</p>;
  }

  return (
    <p class="brew-meta muted">
      {shown.map((location, index) => {
        const slug = regionSlugForLocation(location, regions);
        return (
          <span key={`${location}-${index}`}>
            {index > 0 ? ', ' : ''}
            {slug && linkRegions ? (
              <a href={`/regions/${slug}`}>{location}</a>
            ) : (
              location
            )}
          </span>
        );
      })}
    </p>
  );
}

function IngredientRow({
  image,
  title,
  meta,
  locations,
  regions,
  actionLabel,
  onClick,
  disabled,
  asButton = true,
}: {
  image?: string;
  title: string;
  meta?: ComponentChildren;
  locations: string[];
  regions: Region[];
  actionLabel?: string;
  onClick?: () => void;
  disabled?: boolean;
  asButton?: boolean;
}) {
  const linkRegions = !asButton;

  const body = (
    <>
      {image ? (
        <img
          class="brew-thumb"
          src={image}
          alt={title}
          width="72"
          height="72"
          loading="lazy"
        />
      ) : (
        <span class="brew-thumb brew-thumb-placeholder badge">?</span>
      )}
      <div class="brew-row-body">
        <strong>{title}</strong>
        {meta ? <div class="brew-meta">{meta}</div> : null}
        <LocationLinks
          locations={locations}
          regions={regions}
          linkRegions={linkRegions}
        />
      </div>
      {actionLabel ? <span class="brew-row-action muted">{actionLabel}</span> : null}
    </>
  );

  if (!asButton) {
    return <div class="brew-row">{body}</div>;
  }

  return (
    <button
      type="button"
      class="brew-row"
      onClick={onClick}
      disabled={disabled}
    >
      {body}
    </button>
  );
}

export default function BrewBench({
  pickerItems,
  recipes,
  staples,
  entries,
  regions,
  products,
}: Props) {
  const satchel = useStore(satchelItems);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<BrewGroup>('material');
  const [location, setLocation] = useState('');
  const [satchelOnly, setSatchelOnly] = useState(false);
  const [activeRecipeSlug, setActiveRecipeSlug] = useState<string | null>(null);
  const [buyMessage, setBuyMessage] = useState<string | null>(null);

  const productsBySourceId = useMemo(() => {
    const map = new Map<number, BrewShopProduct>();
    for (const product of products) {
      map.set(product.sourceId, product);
    }
    return map;
  }, [products]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const g = params.get('group') as BrewGroup | null;
    if (g && GROUPS.some((item) => item.id === g)) setGroup(g);
    if (params.get('satchel') === '1') setSatchelOnly(true);

    function syncHash(): void {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash && recipes.some((recipe) => recipe.slug === hash)) {
        setActiveRecipeSlug(hash);
      }
    }

    // Open the recipe guide when arriving via a recipe deep link (e.g. a
    // "Head to the brew bench →" suggestion or the daily-challenge link), and
    // whenever the hash changes afterwards.
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, [recipes]);

  // Skip the very first run so we don't rewrite (and strip the hash from) an
  // incoming deep link before the effect above has read it.
  const didSyncUrl = useRef(false);
  useEffect(() => {
    if (!didSyncUrl.current) {
      didSyncUrl.current = true;
      return;
    }
    const params = new URLSearchParams(window.location.search);
    params.set('group', group);
    if (satchelOnly) params.set('satchel', '1');
    else params.delete('satchel');
    const qs = params.toString();
    const hash = activeRecipeSlug ? `#${activeRecipeSlug}` : '';
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${qs}${hash}`,
    );
  }, [group, satchelOnly, activeRecipeSlug]);

  const satchelIds = useMemo(
    () => new Set(satchel.map((item) => item.sourceId)),
    [satchel],
  );

  const locations = useMemo(() => {
    const set = new Set<string>();
    for (const item of pickerItems) {
      item.commonLocations.forEach((loc) => set.add(loc));
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [pickerItems]);

  const selected = useMemo(() => {
    return selectedIds
      .map((id) => pickerItems.find((item) => item.sourceId === id))
      .filter((item): item is BrewPickerItem => Boolean(item));
  }, [selectedIds, pickerItems]);

  const activeRecipe = useMemo(
    () => recipes.find((recipe) => recipe.slug === activeRecipeSlug) ?? null,
    [recipes, activeRecipeSlug],
  );

  const resolved = useMemo(() => {
    if (!activeRecipe) return null;
    return resolveRecipeSlots(activeRecipe, entries, staples);
  }, [activeRecipe, entries, staples]);

  const result = useMemo(() => {
    if (selected.length === 0) return null;
    const ingredients: BrewIngredientRef[] = selected.map((item) => ({
      sourceId: item.sourceId,
      stapleId: item.stapleId,
      name: item.name,
      cookingEffect: item.cookingEffect,
      heartsRecovered: item.heartsRecovered,
      isMonsterPart: item.isMonsterPart,
      isCritter: item.isCritter,
    }));
    return evaluateBrew(ingredients, recipes, staples);
  }, [selected, recipes, staples]);

  const missingFromSatchel = useMemo(() => {
    if (satchel.length === 0) return selected;
    return selected.filter((item) => !satchelIds.has(item.sourceId));
  }, [selected, satchelIds, satchel.length]);

  const buyableMissing = useMemo(() => {
    return missingFromSatchel
      .map((item) => {
        const product = productsBySourceId.get(item.sourceId);
        if (!product) return null;
        if (
          product.stockStatus === 'not_sold' ||
          product.stockStatus === 'guide_only'
        ) {
          return null;
        }
        return { item, product };
      })
      .filter(
        (
          entry,
        ): entry is { item: BrewPickerItem; product: BrewShopProduct } =>
          entry != null,
      );
  }, [missingFromSatchel, productsBySourceId]);

  const buyPotCost = useMemo(
    () => buyableMissing.reduce((sum, row) => sum + row.product.priceRupees, 0),
    [buyableMissing],
  );

  const unsellableMissing = useMemo(() => {
    return missingFromSatchel.filter((item) => {
      const product = productsBySourceId.get(item.sourceId);
      return (
        !product ||
        product.stockStatus === 'not_sold' ||
        product.stockStatus === 'guide_only'
      );
    });
  }, [missingFromSatchel, productsBySourceId]);

  const visiblePicker = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pickerItems
      .filter((item) => item.group === group)
      .filter((item) => !selectedIds.includes(item.sourceId))
      .filter((item) => (satchelOnly ? satchelIds.has(item.sourceId) : true))
      .filter((item) =>
        location ? item.commonLocations.includes(location) : true,
      )
      .filter((item) =>
        q
          ? `${item.name} ${item.cookingEffect ?? ''}`.toLowerCase().includes(q)
          : true,
      );
  }, [
    pickerItems,
    group,
    selectedIds,
    satchelOnly,
    satchelIds,
    location,
    query,
  ]);

  function toggle(sourceId: number): void {
    setBuyMessage(null);
    setSelectedIds((current) => {
      if (current.includes(sourceId)) {
        return current.filter((id) => id !== sourceId);
      }
      if (current.length >= 5) return current;
      return [...current, sourceId];
    });
  }

  function selectRecipe(recipe: Recipe): void {
    setActiveRecipeSlug(recipe.slug);
  }

  function fillPotFromRecipe(): void {
    if (!resolved) return;
    setSelectedIds(resolved.exampleSourceIds.slice(0, 5));
  }

  function clearPot(): void {
    setSelectedIds([]);
    setBuyMessage(null);
  }

  function clearRecipe(): void {
    setActiveRecipeSlug(null);
  }

  function buyPot(): void {
    if (buyableMissing.length === 0) return;
    let added = 0;
    let spent = 0;
    const failed: string[] = [];

    for (const { item, product } of buyableMissing) {
      const result = addToSatchel({
        productSlug: product.slug,
        sourceId: product.sourceId,
        name: product.name,
        priceRupees: product.priceRupees,
        stockStatus: product.stockStatus,
      });
      if (result.ok) {
        added += 1;
        spent += product.priceRupees;
      } else {
        failed.push(
          `${titleCase(item.name)}${result.reason ? ` (${result.reason})` : ''}`,
        );
      }
    }

    const parts: string[] = [];
    if (added > 0) {
      parts.push(
        `Added ${added} to your satchel for ${spent} rupees (simulated).`,
      );
    }
    if (failed.length > 0) {
      parts.push(`Could not buy: ${failed.join('; ')}.`);
    }
    if (unsellableMissing.length > 0) {
      parts.push(
        `Not sold here: ${unsellableMissing
          .map((item) => titleCase(item.name))
          .join(', ')}.`,
      );
    }
    setBuyMessage(parts.join(' ') || null);
  }

  return (
    <div class="stack">
      <div class="brew-layout">
        <div class="stack">
          <div class="brew-tray">
            <div class="brew-tray-header">
              <h2 class="margin-0">Pot · {selected.length} of 5</h2>
              <button
                type="button"
                onClick={clearPot}
                disabled={selected.length === 0}
              >
                Clear pot
              </button>
            </div>
            {selected.length === 0 ? (
              <p class="muted margin-0">
                Add ingredients below, or pick a named recipe and fill the pot.
              </p>
            ) : (
              <ul class="brew-row-list">
                {selected.map((item) => (
                  <li key={item.sourceId}>
                    <IngredientRow
                      image={item.image}
                      title={titleCase(item.name)}
                      meta={
                        <>
                          <span class="badge">{item.group}</span>
                          {item.cookingEffect ? (
                            <EffectFamilyChip family={item.cookingEffect} />
                          ) : null}
                          {item.heartsRecovered ? (
                            <HeartsDisplay
                              value={item.heartsRecovered}
                              label=""
                            />
                          ) : null}
                        </>
                      }
                      locations={item.commonLocations}
                      regions={regions}
                      actionLabel="remove"
                      onClick={() => toggle(item.sourceId)}
                    />
                  </li>
                ))}
              </ul>
            )}
            {missingFromSatchel.length > 0 && selected.length > 0 ? (
              <div class="brew-buy-pot stack">
                <p class="muted margin-0">
                  Not in your satchel:{' '}
                  {missingFromSatchel
                    .map((item) => titleCase(item.name))
                    .join(', ')}
                  .
                </p>
                {buyableMissing.length > 0 ? (
                  <button type="button" onClick={buyPot}>
                    Buy pot · {buyPotCost} rupees
                  </button>
                ) : (
                  <p class="muted margin-0">
                    These aren’t sold from the cart — gather them in the field
                    or open the{' '}
                    <a href="/guide/materials">field manual</a>.
                  </p>
                )}
                {unsellableMissing.length > 0 && buyableMissing.length > 0 ? (
                  <p class="muted margin-0">
                    Can’t buy:{' '}
                    {unsellableMissing
                      .map((item) => titleCase(item.name))
                      .join(', ')}
                    .
                  </p>
                ) : null}
                {buyMessage ? (
                  <p class="notice margin-0">
                    {buyMessage}
                  </p>
                ) : null}
              </div>
            ) : selected.length > 0 ? (
              <p class="muted margin-0">
                All pot ingredients are in your satchel.
              </p>
            ) : null}
          </div>

          <div class="filter-panel brew-filters">
            <div class="filter-actions filter-actions-tight">
              {GROUPS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={group === item.id}
                  onClick={() => setGroup(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <label for="brew-search">
              <span class="muted">Search in {GROUPS.find((g) => g.id === group)?.label}</span>
              <input
                id="brew-search"
                name="brew-search"
                type="search"
                value={query}
                placeholder="Name or effect"
                onInput={(event) =>
                  setQuery((event.target as HTMLInputElement).value)
                }
              />
            </label>
            <label for="brew-location">
              <span class="muted">Found near</span>
              <select
                id="brew-location"
                name="brew-location"
                value={location}
                onChange={(event) =>
                  setLocation((event.target as HTMLSelectElement).value)
                }
              >
                <option value="">Any location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </label>
            <label class="brew-checkbox">
              <input
                type="checkbox"
                checked={satchelOnly}
                onChange={(event) =>
                  setSatchelOnly((event.target as HTMLInputElement).checked)
                }
              />
              <span>Only what I carry</span>
            </label>
          </div>

          {satchelOnly && satchelIds.size === 0 ? (
            <p class="notice">
              Your satchel is empty.{' '}
              <a href="/shop">Visit the shop</a> to pack ingredients.
            </p>
          ) : visiblePicker.length === 0 ? (
            <p class="notice muted">No ingredients in this shelf match.</p>
          ) : (
            <ul class="brew-row-list">
              {visiblePicker.map((item) => (
                <li key={item.sourceId}>
                  <IngredientRow
                    image={item.image}
                    title={titleCase(item.name)}
                    meta={
                      <>
                        <span class="badge">{item.group}</span>
                        {item.cookingEffect ? (
                          <EffectFamilyChip family={item.cookingEffect} />
                        ) : null}
                        {item.heartsRecovered ? (
                          <HeartsDisplay value={item.heartsRecovered} label="" />
                        ) : null}
                      </>
                    }
                    locations={item.commonLocations}
                    regions={regions}
                    actionLabel="add"
                    onClick={() => toggle(item.sourceId)}
                    disabled={selected.length >= 5}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div class="stack">
          <section class="stack">
            <h2 class="margin-0">Cook result</h2>
            {result == null ? (
              <p class="notice muted margin-0">
                Nothing in the pot yet — add ingredients to cook. Opening a
                recipe only shows its guide until you fill the pot.
              </p>
            ) : (
              <div class="notice stack">
                <p class="margin-0">
                  <strong>
                    {result.ok
                      ? result.matchedRecipe?.name ??
                        (result.effectFamily !== 'hearts' &&
                        selected.some((s) => s.isCritter)
                          ? 'Improvised elixir'
                          : 'Improvised dish')
                      : result.matchedRecipe?.name ?? 'Failed brew'}
                  </strong>
                </p>
                <BrewEffectSummary
                  effectFamily={result.effectFamily}
                  strengthBand={result.strengthBand}
                  durationBand={result.durationBand}
                  heartsEstimate={result.heartsEstimate}
                />
                <p class="margin-0">{result.merchantNote}</p>
                {result.failureReason ? (
                  <p class="muted margin-0">
                    Reason: {result.failureReason}
                  </p>
                ) : null}
                <LocationLinks
                  locations={[
                    ...new Set(selected.flatMap((s) => s.commonLocations)),
                  ]}
                  regions={regions}
                />
              </div>
            )}
          </section>

          {resolved && activeRecipe ? (
            <section
              class="entry-card stack brew-recipe-guide"
              id={activeRecipe.slug}
            >
              <div class="brew-tray-header">
                <h2 class="margin-0">Recipe guide</h2>
                <button type="button" onClick={clearRecipe}>
                  Close
                </button>
              </div>
              {activeRecipe.image ? (
                <img
                  class="brew-recipe-hero"
                  src={activeRecipe.image}
                  alt={activeRecipe.name}
                  width="128"
                  height="128"
                />
              ) : null}
              <div>
                <strong>{activeRecipe.name}</strong>
                <p class="muted margin-top-tight">
                  {activeRecipe.kind}
                </p>
              </div>
              <BrewEffectSummary
                effectFamily={activeRecipe.effectFamily}
                strengthBand={activeRecipe.strengthBand}
                durationBand={activeRecipe.durationBand}
              />
              <p class="margin-0">{activeRecipe.merchantNote}</p>
              <h3 class="margin-0">Needed ingredients</h3>
              <ul class="brew-row-list">
                {resolved.slots.map((slot: ResolvedSlotExample) => (
                  <li key={slot.label}>
                    <IngredientRow
                      asButton={false}
                      image={slot.image}
                      title={slot.label}
                      meta={
                        slot.sourceId && satchelIds.has(slot.sourceId) ? (
                          <span class="badge">in satchel</span>
                        ) : slot.sourceId ? (
                          <a href={`/shop?recipe=${activeRecipe.slug}`}>
                            Find in shop
                          </a>
                        ) : null
                      }
                      locations={slot.commonLocations}
                      regions={regions}
                    />
                  </li>
                ))}
              </ul>
              {activeRecipe.kind !== 'failure' ? (
                <button type="button" onClick={fillPotFromRecipe}>
                  Fill pot with examples
                </button>
              ) : null}
            </section>
          ) : null}

          <section class="brew-featured-recipes stack">
            <h2 class="margin-0">Try a named recipe</h2>
            <p class="muted margin-0">
              Meals and elixirs Sor keeps taped above the bench. Open a guide,
              then fill the pot — the full cookbook is below.
            </p>
            {(['meal', 'elixir'] as const).map((kind) => {
              const featured = recipes
                .filter((recipe) => recipe.kind === kind)
                .slice(0, 4);
              if (featured.length === 0) return null;
              return (
                <div class="stack" key={kind}>
                  <h3 class="margin-0">
                    {kind === 'meal' ? 'Meals' : 'Elixirs'}
                  </h3>
                  <ul class="brew-featured-grid">
                    {featured.map((recipe) => (
                      <li key={recipe.slug}>
                        <button
                          type="button"
                          class={`brew-row brew-recipe-card${
                            activeRecipeSlug === recipe.slug ? ' is-active' : ''
                          }`}
                          onClick={() => selectRecipe(recipe)}
                        >
                          {recipe.image ? (
                            <img
                              class="brew-thumb"
                              src={recipe.image}
                              alt={recipe.name}
                              width="72"
                              height="72"
                              loading="lazy"
                            />
                          ) : (
                            <span class="brew-thumb brew-thumb-placeholder badge">
                              ?
                            </span>
                          )}
                          <div class="brew-row-body">
                            <strong>{recipe.name}</strong>
                            <div class="brew-meta">
                              <EffectFamilyChip family={recipe.effectFamily} />
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </section>

          <h2 class="brew-cookbook-heading">Full cookbook</h2>
          <details class="brew-cookbook">
            <summary class="brew-cookbook-summary">
              <span>Browse every recipe</span>
              <span class="muted">{recipes.length} recipes</span>
            </summary>
            <div class="stack brew-cookbook-body">
              <p class="muted margin-0">
                Every named meal, elixir, and failure. Opening a recipe shows its
                guide; it does not cook until you fill the pot.
              </p>
              <ul class="brew-row-list">
                {recipes.map((recipe) => (
                  <li key={recipe.slug}>
                    <button
                      type="button"
                      class={`brew-row brew-recipe-card${
                        activeRecipeSlug === recipe.slug ? ' is-active' : ''
                      }`}
                      onClick={() => selectRecipe(recipe)}
                    >
                      {recipe.image ? (
                        <img
                          class="brew-thumb"
                          src={recipe.image}
                          alt={recipe.name}
                          width="72"
                          height="72"
                          loading="lazy"
                        />
                      ) : (
                        <span class="brew-thumb brew-thumb-placeholder badge">
                          ?
                        </span>
                      )}
                      <div class="brew-row-body">
                        <strong>{recipe.name}</strong>
                        <div class="brew-meta">
                          <span class="muted">{recipe.kind}</span>
                          <EffectFamilyChip family={recipe.effectFamily} />
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
