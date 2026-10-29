import type { MerchantStaple, ProductOverride } from './schemas';
import type {
  MaterialEntry,
  Product,
  SourceEntry,
  StockStatus,
} from './normalize';
import { slugify } from './normalize';
import { GAME } from '@/config/site';

const DEFAULT_STAPLE_IMAGE = '/images/staples/default.svg';

/** Public path for a staple art file (`Bird_Egg.png` from name "Bird Egg"). */
export function stapleImagePath(staple: Pick<MerchantStaple, 'name' | 'image'>): string {
  if (staple.image) return staple.image;
  const fileName = staple.name.trim().replace(/\s+/g, '_');
  if (!fileName) return DEFAULT_STAPLE_IMAGE;
  return `/images/staples/${fileName}.png`;
}

export function stapleToMaterialEntry(staple: MerchantStaple): MaterialEntry {
  return {
    id: staple.sourceId,
    sourceId: staple.sourceId,
    slug: slugify(staple.name),
    name: staple.name,
    category: 'materials',
    description: staple.description,
    image: stapleImagePath(staple),
    commonLocations: staple.commonLocations,
    dlc: false,
    game: GAME,
    cookingEffect: staple.cookingEffect,
    heartsRecovered: staple.heartsRecovered,
  };
}

export function enrichStapleProduct(staple: MerchantStaple): Product {
  const entry = stapleToMaterialEntry(staple);
  return {
    slug: entry.slug,
    sourceId: staple.sourceId,
    stapleId: staple.stapleId,
    origin: 'merchant_staple',
    entry,
    priceRupees: staple.priceRupees,
    stockStatus: staple.stockStatus,
    merchantNote: staple.merchantNote,
  };
}

function mix(sourceId: number): number {
  return (Math.imul(sourceId, 2654435761) >>> 0) % 1000;
}

/** Fictional commerce defaults when no product override exists. */
export function defaultProductCommerce(entry: SourceEntry): {
  priceRupees: number;
  stockStatus: StockStatus;
  merchantNote: string;
} {
  const m = mix(entry.sourceId);

  switch (entry.category) {
    case 'materials': {
      const hasEffect = Boolean(entry.cookingEffect?.trim());
      const priceRupees = hasEffect ? 14 + (m % 27) : 8 + (m % 15);
      const stockStatus: StockStatus =
        hasEffect && m % 5 === 0
          ? 'scarce'
          : m % 11 === 0
            ? 'seasonal'
            : 'available';
      return {
        priceRupees,
        stockStatus,
        merchantNote:
          'For the pot or the pack. Check the cooking effect before you buy a stack.',
      };
    }
    case 'creatures': {
      if (entry.edible) {
        const hasEffect = Boolean(entry.cookingEffect?.trim());
        return {
          priceRupees: hasEffect ? 16 + (m % 30) : 10 + (m % 18),
          stockStatus: m % 7 === 0 ? 'scarce' : 'available',
          merchantNote:
            'Cook it, or carry it for the road. Catch quality varies.',
        };
      }
      return {
        priceRupees: 8 + (m % 18),
        stockStatus: m % 9 === 0 ? 'scarce' : 'available',
          merchantNote:
            'For elixirs and odd requests. Read the Field Manual if you are not sure what it drops.',
      };
    }
    case 'monsters':
      return {
        priceRupees: 6 + (m % 22),
        stockStatus: m % 8 === 0 ? 'scarce' : 'available',
        merchantNote:
          'A part for the brewing bench. Pair it with a critter that has an effect to make an elixir.',
      };
    case 'equipment': {
      const attack = entry.properties.attack ?? 0;
      const defense = entry.properties.defense ?? 0;
      const power = Math.max(attack, defense);
      const priceRupees = 28 + power * 2 + (m % 25);
      const stockStatus: StockStatus =
        m % 7 === 0 ? 'special_order' : m % 11 === 0 ? 'scarce' : 'available';
      return {
        priceRupees,
        stockStatus,
        merchantNote:
          'Trail gear from the cart. Read the properties before you pack it.',
      };
    }
    case 'treasure':
      return {
        priceRupees: 40 + (m % 80),
        stockStatus: 'scarce',
        merchantNote:
          'A rare find. Take it only if this road needs it.',
      };
  }
}

/**
 * Build the shop catalogue from every Compendium entry (+ merchant staples).
 * Authored rows in `products.json` override price, stock, and merchant note.
 */
export function enrichProducts(
  entries: SourceEntry[],
  overrides: ProductOverride[],
  staples: MerchantStaple[] = [],
): Product[] {
  const overrideById = new Map(
    overrides.map((override) => [override.sourceId, override]),
  );
  for (const override of overrides) {
    if (!entries.some((entry) => entry.sourceId === override.sourceId)) {
      throw new Error(
        `Product override references missing sourceId ${override.sourceId}`,
      );
    }
  }

  const products: Product[] = [];
  const usedSlugs = new Set<string>();

  for (const entry of entries) {
    const override = overrideById.get(entry.sourceId);
    const commerce = override
      ? {
          priceRupees: override.priceRupees,
          stockStatus: override.stockStatus,
          merchantNote: override.merchantNote,
        }
      : defaultProductCommerce(entry);

    const slug = slugify(entry.name);
    if (usedSlugs.has(slug)) {
      throw new Error(`Duplicate product slug after enrich: ${slug}`);
    }
    usedSlugs.add(slug);
    products.push({
      slug,
      sourceId: entry.sourceId,
      origin: 'compendium',
      entry,
      priceRupees: commerce.priceRupees,
      stockStatus: commerce.stockStatus,
      merchantNote: commerce.merchantNote,
    });
  }

  const byId = new Map(entries.map((entry) => [entry.sourceId, entry]));
  for (const staple of staples) {
    if (byId.has(staple.sourceId)) {
      throw new Error(
        `Merchant staple sourceId ${staple.sourceId} collides with a Compendium entry`,
      );
    }
    const product = enrichStapleProduct(staple);
    if (usedSlugs.has(product.slug)) {
      throw new Error(`Duplicate product slug for staple: ${product.slug}`);
    }
    usedSlugs.add(product.slug);
    products.push(product);
  }

  return products.sort((a, b) => a.entry.name.localeCompare(b.entry.name));
}
