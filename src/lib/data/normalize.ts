import type { EntryCategory, RawEntry, RawRegion } from './schemas';
import { GAME } from '@/config/site';

export type GameId = typeof GAME;

export interface SourceEntryBase {
  id: number;
  sourceId: number;
  slug: string;
  name: string;
  category: EntryCategory;
  description: string;
  image: string;
  commonLocations: string[];
  dlc: boolean;
  game: GameId;
}

export interface CreatureFoodEntry extends SourceEntryBase {
  category: 'creatures';
  edible: true;
  cookingEffect: string;
  heartsRecovered: number;
}

export interface CreatureNonFoodEntry extends SourceEntryBase {
  category: 'creatures';
  edible: false;
  drops: string[];
}

export type CreatureEntry = CreatureFoodEntry | CreatureNonFoodEntry;

export interface EquipmentEntry extends SourceEntryBase {
  category: 'equipment';
  properties: {
    attack: number;
    defense: number;
    effect?: string;
    type?: string;
  };
}

export interface MaterialEntry extends SourceEntryBase {
  category: 'materials';
  cookingEffect: string;
  heartsRecovered: number;
  fuseAttackPower?: number;
}

export interface MonsterEntry extends SourceEntryBase {
  category: 'monsters';
  drops: string[];
}

export interface TreasureEntry extends SourceEntryBase {
  category: 'treasure';
  drops: string[];
}

export type SourceEntry =
  | CreatureEntry
  | EquipmentEntry
  | MaterialEntry
  | MonsterEntry
  | TreasureEntry;

export interface GuideEntry {
  entry: SourceEntry;
}

export type StockStatus =
  | 'available'
  | 'scarce'
  | 'seasonal'
  | 'special_order'
  | 'guide_only'
  | 'not_sold';

export interface Product {
  slug: string;
  sourceId: number;
  /** Present when the SKU is a merchant pantry staple (not Compendium-backed). */
  stapleId?: string;
  origin: 'compendium' | 'merchant_staple';
  entry: SourceEntry;
  priceRupees: number;
  stockStatus: StockStatus;
  merchantNote: string;
}

export interface Region {
  slug: string;
  name: string;
  settlements: string[];
  shrines: Array<{ name: string; puzzle: string }>;
  dlcShrines: Array<{ name: string; puzzle: string }>;
  /** Editorial placeholders — filled in later phases. */
  overview: string;
  conditions: string;
  hazards: string;
  usefulFinds: string;
  routeNotes: string;
  merchantStory: string;
}

export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\+/g, ' plus')
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function coerceStringList(value: string[] | null | undefined): string[] {
  return value ?? [];
}

function baseFromRaw(raw: RawEntry): SourceEntryBase {
  return {
    id: raw.id,
    sourceId: raw.id,
    slug: slugify(raw.name),
    name: raw.name,
    category: raw.category,
    description: raw.description,
    image: raw.image,
    commonLocations: coerceStringList(raw.common_locations),
    dlc: raw.dlc,
    game: GAME,
  };
}

export function normalizeEntry(raw: RawEntry): SourceEntry {
  const base = baseFromRaw(raw);

  switch (raw.category) {
    case 'creatures':
      if (raw.edible) {
        return {
          ...base,
          category: 'creatures',
          edible: true,
          cookingEffect: raw.cooking_effect,
          heartsRecovered: raw.hearts_recovered,
        };
      }
      return {
        ...base,
        category: 'creatures',
        edible: false,
        drops: coerceStringList(raw.drops),
      };
    case 'equipment':
      return {
        ...base,
        category: 'equipment',
        properties: {
          attack: raw.properties.attack ?? 0,
          defense: raw.properties.defense ?? 0,
          ...(raw.properties.effect !== undefined
            ? { effect: raw.properties.effect }
            : {}),
          ...(raw.properties.type !== undefined
            ? { type: raw.properties.type }
            : {}),
        },
      };
    case 'materials':
      return {
        ...base,
        category: 'materials',
        cookingEffect: raw.cooking_effect,
        heartsRecovered: raw.hearts_recovered,
        ...(raw.fuse_attack_power !== undefined
          ? { fuseAttackPower: raw.fuse_attack_power }
          : {}),
      };
    case 'monsters':
      return {
        ...base,
        category: 'monsters',
        drops: coerceStringList(raw.drops),
      };
    case 'treasure':
      return {
        ...base,
        category: 'treasure',
        drops: coerceStringList(raw.drops),
      };
  }
}

export function normalizeRegion(raw: RawRegion): Region {
  return {
    slug: slugify(raw.name),
    name: raw.name,
    settlements: raw.settlements,
    shrines: raw.shrines,
    dlcShrines: raw.dlc_shrines ?? [],
    overview: '',
    conditions: '',
    hazards: '',
    usefulFinds: '',
    routeNotes: '',
    merchantStory: '',
  };
}

export function titleCaseName(name: string): string {
  return name
    .split(' ')
    .map((part) =>
      part.length === 0 ? part : part[0]!.toUpperCase() + part.slice(1),
    )
    .join(' ');
}
