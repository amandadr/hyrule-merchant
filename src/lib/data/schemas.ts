import { z } from 'zod';

/** Nullable arrays from the API are coerced later; schemas accept null or array. */
const stringList = z.array(z.string()).nullable();

const baseEntry = {
  id: z.number().int(),
  name: z.string().min(1),
  description: z.string(),
  image: z.string().url(),
  common_locations: stringList,
  dlc: z.boolean(),
};

export const CreatureFoodSchema = z.object({
  ...baseEntry,
  category: z.literal('creatures'),
  edible: z.literal(true),
  cooking_effect: z.string(),
  hearts_recovered: z.number(),
});

export const CreatureNonFoodSchema = z.object({
  ...baseEntry,
  category: z.literal('creatures'),
  edible: z.literal(false),
  drops: stringList.optional(),
});

export const CreatureSchema = z.discriminatedUnion('edible', [
  CreatureFoodSchema,
  CreatureNonFoodSchema,
]);

export const EquipmentSchema = z.object({
  ...baseEntry,
  category: z.literal('equipment'),
  properties: z.object({
    attack: z.number().nullable(),
    defense: z.number().nullable(),
    effect: z.string().optional(),
    type: z.string().optional(),
  }),
});

export const MaterialSchema = z.object({
  ...baseEntry,
  category: z.literal('materials'),
  cooking_effect: z.string(),
  hearts_recovered: z.number(),
  fuse_attack_power: z.number().optional(),
});

export const MonsterSchema = z.object({
  ...baseEntry,
  category: z.literal('monsters'),
  drops: stringList,
});

export const TreasureSchema = z.object({
  ...baseEntry,
  category: z.literal('treasure'),
  drops: stringList,
});

export type RawEntry =
  | z.infer<typeof CreatureFoodSchema>
  | z.infer<typeof CreatureNonFoodSchema>
  | z.infer<typeof EquipmentSchema>
  | z.infer<typeof MaterialSchema>
  | z.infer<typeof MonsterSchema>
  | z.infer<typeof TreasureSchema>;

export const ApiEnvelopeSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(z.unknown()),
});

export const ShrineSchema = z.object({
  name: z.string(),
  puzzle: z.string(),
});

export const RawRegionSchema = z.object({
  name: z.string().min(1),
  settlements: z.array(z.string()),
  shrines: z.array(ShrineSchema),
  dlc_shrines: z.array(ShrineSchema).optional().default([]),
});

export const ProductOverrideSchema = z.object({
  sourceId: z.number().int(),
  priceRupees: z.number().nonnegative(),
  stockStatus: z.enum([
    'available',
    'scarce',
    'seasonal',
    'special_order',
    'guide_only',
    'not_sold',
  ]),
  merchantNote: z.string(),
});

export const ProductOverridesFileSchema = z.object({
  products: z.array(ProductOverrideSchema),
});

/** Cooking staples absent from the Compendium API — merchant-authored shop entries. */
export const MerchantStapleSchema = z.object({
  stapleId: z.string().min(1),
  /** Synthetic id in the 900001+ range; never collides with Compendium ids. */
  sourceId: z.number().int().min(900001),
  name: z.string().min(1),
  description: z.string().min(1),
  commonLocations: z.array(z.string()).default([]),
  cookingEffect: z.string().default(''),
  heartsRecovered: z.number().nonnegative().default(0),
  priceRupees: z.number().nonnegative(),
  stockStatus: z.enum([
    'available',
    'scarce',
    'seasonal',
    'special_order',
    'guide_only',
    'not_sold',
  ]),
  merchantNote: z.string(),
  /** Optional public path; defaults to /images/staples/default.svg */
  image: z.string().optional(),
});

export const MerchantStaplesFileSchema = z.object({
  staples: z.array(MerchantStapleSchema),
});

export const IngredientTagSchema = z.enum([
  'mushroom',
  'fruit',
  'vegetable_herb_flower',
  'vegetable',
  'radish',
  'carrot',
  'pumpkin',
  'carrot_or_pumpkin',
  'meat',
  'seafood',
  'fish',
  'crab',
  'porgy',
  'snail_or_crab',
  'nut',
  'gem_animal_or_monster_part',
]);

export type IngredientTag = z.infer<typeof IngredientTagSchema>;

export type IngredientSlot =
  | { kind: 'item'; sourceId: number }
  | { kind: 'staple'; stapleId: string }
  | {
      kind: 'tag';
      tag: IngredientTag;
      count?: number;
      distinct?: boolean;
      excludeNames?: string[];
    }
  | { kind: 'alternatives'; options: IngredientSlot[] }
  | { kind: 'special'; note: string };

const AtomicIngredientSlotSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('item'),
    sourceId: z.number().int(),
  }),
  z.object({
    kind: z.literal('staple'),
    stapleId: z.string().min(1),
  }),
  z.object({
    kind: z.literal('tag'),
    tag: IngredientTagSchema,
    count: z.number().int().positive().optional(),
    distinct: z.boolean().optional(),
    excludeNames: z.array(z.string()).optional(),
  }),
  z.object({
    kind: z.literal('special'),
    note: z.string().min(1),
  }),
]);

export const IngredientSlotSchema: z.ZodType<IngredientSlot> = z.union([
  AtomicIngredientSlotSchema,
  z.object({
    kind: z.literal('alternatives'),
    options: z.array(AtomicIngredientSlotSchema).min(1),
  }),
]);

export const RecipeSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  kind: z.enum(['meal', 'elixir', 'failure']),
  recipeTypeId: z
    .enum([
      'vegetarian_entree',
      'seafood_entree',
      'poultry_meat_entree',
      'surf_and_turf',
      'dessert',
      'monster_food',
      'side_snack',
      'elixir',
    ])
    .optional(),
  effectFamily: z.string().min(1),
  strengthBand: z.enum(['weak', 'mid', 'strong']).optional(),
  durationBand: z.enum(['short', 'mid', 'long']).optional(),
  ingredients: z.array(IngredientSlotSchema).min(1),
  merchantNote: z.string(),
  image: z.string().optional(),
  sourceRefs: z
    .object({
      ignSlug: z.string().optional(),
    })
    .optional(),
});

export const RecipesFileSchema = z.object({
  recipes: z.array(RecipeSchema),
});

export const OutfitSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  sourceIds: z.array(z.number().int()).min(2).max(4),
  merchantNote: z.string(),
  regionSlug: z.string().optional(),
});

export const OutfitsFileSchema = z.object({
  outfits: z.array(OutfitSchema),
});

export type RawRegion = z.infer<typeof RawRegionSchema>;
export type ProductOverride = z.infer<typeof ProductOverrideSchema>;
export type MerchantStaple = z.infer<typeof MerchantStapleSchema>;
export type Recipe = z.infer<typeof RecipeSchema>;
export type Outfit = z.infer<typeof OutfitSchema>;
export type EntryCategory = RawEntry['category'];

/** Reserved synthetic id band for merchant staples (not from the API). */
export const MERCHANT_STAPLE_SOURCE_ID_MIN = 900001;
