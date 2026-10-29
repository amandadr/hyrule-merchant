import { useEffect, useMemo, useState } from 'preact/hooks';
import type { Product } from '@/lib/data/normalize';
import { ProductMeta } from '@/components/shop/ProductBadges';
import ProductCardAdd from '@/components/shop/ProductCardAdd';

export type ShopShelf = 'materials' | 'creatures' | 'equipment' | 'staples' | '';

interface ShopCard {
  slug: string;
  name: string;
  image: string;
  priceRupees: number;
  stockStatus: string;
  origin: string;
  category: string;
  cookingEffect?: string;
  heartsRecovered?: number;
  outfitSlugs: string[];
  recipeSlugs: string[];
  sourceId: number;
}

type SortKey = 'name' | 'price' | 'stock' | 'recovery';

interface Props {
  products: ShopCard[];
  stockStatuses: string[];
  effects: string[];
  categories: string[];
  outfits: Array<{ slug: string; name: string }>;
  recipes: Array<{ slug: string; name: string }>;
}

function titleCase(name: string): string {
  return name
    .split(' ')
    .map((part) => (part ? part[0]!.toUpperCase() + part.slice(1) : part))
    .join(' ');
}

function shelfOf(product: ShopCard): ShopShelf {
  if (product.origin === 'merchant_staple') return 'staples';
  if (product.category === 'materials' || product.category === 'treasure') {
    return 'materials';
  }
  if (product.category === 'creatures' || product.category === 'monsters') {
    return 'creatures';
  }
  if (product.category === 'equipment') return 'equipment';
  return 'materials';
}

const SHELVES: { id: ShopShelf; label: string }[] = [
  { id: 'materials', label: 'Materials' },
  { id: 'creatures', label: 'Creatures' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'staples', label: 'Pantry staples' },
];

export default function ShopFilters({
  products,
  stockStatuses,
  effects,
  categories,
  outfits,
  recipes,
}: Props) {
  const [q, setQ] = useState('');
  const [stock, setStock] = useState('');
  const [effect, setEffect] = useState('');
  const [category, setCategory] = useState('');
  const [shelf, setShelf] = useState<ShopShelf>('materials');
  const [outfit, setOutfit] = useState('');
  const [recipe, setRecipe] = useState('');
  const [sort, setSort] = useState<SortKey>('name');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQ(params.get('q') ?? '');
    setStock(params.get('stock') ?? '');
    setEffect(params.get('effect') ?? '');
    setCategory(params.get('category') ?? '');
    const shelfParam = params.get('shelf') as ShopShelf | null;
    if (shelfParam && SHELVES.some((s) => s.id === shelfParam)) {
      setShelf(shelfParam);
    } else if (!params.get('shelf') && !params.get('recipe')) {
      setShelf('materials');
    }
    setOutfit(params.get('outfit') ?? '');
    setRecipe(params.get('recipe') ?? '');
    const sortParam = params.get('sort') as SortKey | null;
    if (
      sortParam === 'price' ||
      sortParam === 'stock' ||
      sortParam === 'name' ||
      sortParam === 'recovery'
    ) {
      setSort(sortParam);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (stock) params.set('stock', stock);
    if (effect) params.set('effect', effect);
    if (category) params.set('category', category);
    if (shelf) params.set('shelf', shelf);
    if (outfit) params.set('outfit', outfit);
    if (recipe) params.set('recipe', recipe);
    if (sort !== 'name') params.set('sort', sort);
    const next = params.toString();
    const url = next
      ? `${window.location.pathname}?${next}`
      : window.location.pathname;
    window.history.replaceState({}, '', url);
  }, [q, stock, effect, category, shelf, outfit, recipe, sort]);

  const recipeName = recipes.find((item) => item.slug === recipe)?.name;

  const visible = useMemo(() => {
    const query = q.trim().toLowerCase();
    const filtered = products.filter((product) => {
      if (query && !product.name.toLowerCase().includes(query)) return false;
      if (stock && product.stockStatus !== stock) return false;
      if (effect && product.cookingEffect !== effect) return false;
      if (category && product.category !== category) return false;
      if (shelf && shelfOf(product) !== shelf) return false;
      if (outfit && !product.outfitSlugs.includes(outfit)) return false;
      if (recipe && !product.recipeSlugs.includes(recipe)) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sort === 'price') return a.priceRupees - b.priceRupees;
      if (sort === 'stock') return a.stockStatus.localeCompare(b.stockStatus);
      if (sort === 'recovery') {
        const heartsA = a.heartsRecovered ?? 0;
        const heartsB = b.heartsRecovered ?? 0;
        if (heartsB !== heartsA) return heartsB - heartsA;
        return a.name.localeCompare(b.name);
      }
      return a.name.localeCompare(b.name);
    });
  }, [products, q, stock, effect, category, shelf, outfit, recipe, sort]);

  function reset(): void {
    setQ('');
    setStock('');
    setEffect('');
    setCategory('');
    setShelf('materials');
    setOutfit('');
    setRecipe('');
    setSort('name');
  }

  return (
    <div class="stack shop-crate">
      <h2 class="shop-crate-heading">Browse the crate</h2>
      <p class="muted margin-0">
        {products.length} goods on the wagon — filter by shelf, journey pack, or
        recipe.
      </p>

      {recipe && recipeName ? (
        <p class="notice">
          Showing ingredients for <strong>{recipeName}</strong>.{' '}
          <a href="/brew">Open brew bench</a>
        </p>
      ) : null}

      <div class="filter-actions">
        {SHELVES.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={shelf === item.id}
            onClick={() => setShelf(item.id)}
          >
            {item.label}
          </button>
        ))}
        <button type="button" onClick={() => setShelf('')}>
          All shelves
        </button>
      </div>

      <form
        class="filter-panel"
        onSubmit={(event) => event.preventDefault()}
        aria-label="Filter shop"
      >
        <label for="shop-search">
          <span class="muted">Search</span>
          <input
            id="shop-search"
            name="q"
            type="search"
            value={q}
            onInput={(event) => setQ((event.target as HTMLInputElement).value)}
          />
        </label>
        <label for="shop-stock">
          <span class="muted">Stock</span>
          <select
            id="shop-stock"
            name="stock"
            value={stock}
            onChange={(event) =>
              setStock((event.target as HTMLSelectElement).value)
            }
          >
            <option value="">Any</option>
            {stockStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label for="shop-effect">
          <span class="muted">Effect</span>
          <select
            id="shop-effect"
            name="effect"
            value={effect}
            onChange={(event) =>
              setEffect((event.target as HTMLSelectElement).value)
            }
          >
            <option value="">Any</option>
            {effects.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label for="shop-outfit">
          <span class="muted">Journey pack</span>
          <select
            id="shop-outfit"
            name="outfit"
            value={outfit}
            onChange={(event) =>
              setOutfit((event.target as HTMLSelectElement).value)
            }
          >
            <option value="">Any</option>
            {outfits.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label class="filter-field-span" for="shop-recipe">
          <span class="muted">Recipe ingredients</span>
          <select
            id="shop-recipe"
            name="recipe"
            value={recipe}
            onChange={(event) =>
              setRecipe((event.target as HTMLSelectElement).value)
            }
          >
            <option value="">Any</option>
            {recipes.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label for="shop-sort">
          <span class="muted">Sort</span>
          <select
            id="shop-sort"
            name="sort"
            value={sort}
            onChange={(event) =>
              setSort((event.target as HTMLSelectElement).value as SortKey)
            }
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="stock">Stock</option>
            <option value="recovery">Recovery</option>
          </select>
        </label>
        <details class="filter-more filter-field-span">
          <summary>More filters</summary>
          <div class="stack stack-top-pad">
            <label for="shop-category">
              <span class="muted">Kind</span>
              <select
                id="shop-category"
                name="category"
                value={category}
                onChange={(event) =>
                  setCategory((event.target as HTMLSelectElement).value)
                }
              >
                <option value="">Any</option>
                {categories.map((value) => (
                  <option key={value} value={value}>
                    {titleCase(value)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </details>
        <div class="filter-actions">
          <button type="button" onClick={reset}>
            Reset
          </button>
          <p class="muted margin-0">
            Showing {visible.length} of {products.length}
          </p>
        </div>
      </form>

      {visible.length === 0 ? (
        <div class="shop-empty stack">
          <p class="margin-0">
            <strong>Nothing on this shelf matches.</strong>
          </p>
          <p class="muted margin-0">
            Clear a filter, try another shelf, or browse a journey pack.
          </p>
          <div class="filter-actions">
            <button type="button" onClick={reset}>
              Clear filters
            </button>
            <a class="button" href="/regions">
              Pick a road
            </a>
          </div>
        </div>
      ) : (
        <ul class="grid-list">
          {visible.map((product) => (
            <li class="entry-card product-card" key={product.slug}>
              <a class="product-card-link" href={`/shop/${product.slug}`}>
                <img
                  class="product-card-image"
                  src={product.image}
                  alt={titleCase(product.name)}
                  width="96"
                  height="96"
                  loading="lazy"
                />
                <strong class="product-card-title">
                  {titleCase(product.name)}
                </strong>
              </a>
              <ProductMeta
                priceRupees={product.priceRupees}
                stockStatus={product.stockStatus}
                origin={product.origin}
                category={product.category}
                cookingEffect={product.cookingEffect}
                heartsRecovered={product.heartsRecovered}
                shelf={shelfOf(product)}
                emphasizePrice
              />
              <ProductCardAdd
                productSlug={product.slug}
                sourceId={product.sourceId}
                name={product.name}
                priceRupees={product.priceRupees}
                stockStatus={product.stockStatus}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function toShopCard(
  product: Product,
  outfitSlugs: string[],
  recipeSlugs: string[] = [],
): ShopCard {
  const cookingEffect =
    product.entry.category === 'materials'
      ? product.entry.cookingEffect || undefined
      : product.entry.category === 'creatures' && product.entry.edible === true
        ? product.entry.cookingEffect || undefined
        : undefined;

  const heartsRecovered =
    product.entry.category === 'materials'
      ? product.entry.heartsRecovered
      : product.entry.category === 'creatures' && product.entry.edible === true
        ? product.entry.heartsRecovered
        : undefined;

  return {
    slug: product.slug,
    name: product.entry.name,
    image: product.entry.image,
    priceRupees: product.priceRupees,
    stockStatus: product.stockStatus,
    origin: product.origin,
    category: product.entry.category,
    cookingEffect,
    heartsRecovered,
    outfitSlugs,
    recipeSlugs,
    sourceId: product.sourceId,
  };
}
