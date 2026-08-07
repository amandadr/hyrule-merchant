/**
 * Parse the locally saved IGN BotW cookbook HTML into reference JSON.
 *
 * Usage: npx tsx scripts/parse-ign-cookbook.ts
 *
 * Source page (saved at repo root):
 *   All Recipes and Cookbook - The Legend of Zelda_ Breath of the Wild Guide - IGN.html
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML_NAME =
  'All Recipes and Cookbook - The Legend of Zelda_ Breath of the Wild Guide - IGN.html';
const IGN_FILES_DIR = path.join(
  ROOT,
  'All Recipes and Cookbook - The Legend of Zelda_ Breath of the Wild Guide - IGN_files',
);
const OUT_DIR = path.join(ROOT, 'src', 'data', 'reference');
const RECIPE_IMAGES_DIR = path.join(ROOT, 'public', 'images', 'recipes');
const RECIPE_IMAGES_PUBLIC_BASE = '/images/recipes';

type RecipeImage = {
  path: string;
  filename: string;
  remoteSrc: string | null;
  source: string;
};

/** Prefer existing public assets; optionally copy once from a leftover IGN _files dump. */
function resolveRecipeImage(
  slug: string,
  htmlBasename: string | null,
  remoteSrc: string | null,
): RecipeImage | null {
  mkdirSync(RECIPE_IMAGES_DIR, { recursive: true });

  const existing = ['jpg', 'jpeg', 'png', 'webp']
    .map((ext) => `${slug}.${ext}`)
    .find((filename) => existsSync(path.join(RECIPE_IMAGES_DIR, filename)));

  if (existing) {
    return {
      path: `${RECIPE_IMAGES_PUBLIC_BASE}/${existing}`,
      filename: existing,
      remoteSrc,
      source: 'public/images/recipes',
    };
  }

  if (htmlBasename && existsSync(path.join(IGN_FILES_DIR, htmlBasename))) {
    const ext = path.extname(htmlBasename).toLowerCase() || '.jpg';
    const filename = `${slug}${ext}`;
    copyFileSync(path.join(IGN_FILES_DIR, htmlBasename), path.join(RECIPE_IMAGES_DIR, filename));
    return {
      path: `${RECIPE_IMAGES_PUBLIC_BASE}/${filename}`,
      filename,
      remoteSrc,
      source: 'migrated-from-ign-files',
    };
  }

  if (remoteSrc) {
    return {
      path: '',
      filename: '',
      remoteSrc,
      source: 'remote-only',
    };
  }

  return null;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\u00a0/g, ' ');
}

function stripTags(s: string): string {
  return decodeEntities(s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function titleCaseName(name: string): string {
  const map: Record<string, string> = { 'rock salt': 'Rock Salt' };
  return map[name.toLowerCase()] ?? name;
}

const TAG_ALIASES: { tag: string; patterns: RegExp[] }[] = [
  { tag: 'radish', patterns: [/^radish$/i] },
  { tag: 'carrot', patterns: [/^carrot$/i] },
  { tag: 'pumpkin', patterns: [/^pumpkin$/i] },
  { tag: 'carrot_or_pumpkin', patterns: [/^carrot or pumpkin$/i] },
  { tag: 'mushroom', patterns: [/^mushroom$/i, /^mushrooms$/i] },
  {
    tag: 'vegetable_herb_flower',
    patterns: [
      /vegetable.*herb.*flower/i,
      /herb.*vegetable.*flower/i,
      /herb.*flower.*vegetable/i,
      /vegetable.*flower.*herb/i,
      /herbs.*vegetables.*flower/i,
      /^other vegetable, herb, or flower$/i,
    ],
  },
  { tag: 'seafood', patterns: [/^seafood$/i] },
  { tag: 'fish', patterns: [/^fish$/i] },
  { tag: 'crab', patterns: [/^crab$/i] },
  { tag: 'porgy', patterns: [/^porgy$/i] },
  { tag: 'snail_or_crab', patterns: [/^snail or crab$/i] },
  { tag: 'meat', patterns: [/^meat$/i, /^meats$/i] },
  { tag: 'fruit', patterns: [/^fruit$/i, /^fruits$/i, /^other fruit$/i] },
  { tag: 'nut', patterns: [/^nut$/i] },
  { tag: 'vegetable', patterns: [/^vegetable$/i] },
  { tag: 'gem_animal_or_monster_part', patterns: [/gem.*animal.*monster/i] },
];

function resolveTag(categoryHint: string): string {
  for (const { tag, patterns } of TAG_ALIASES) {
    if (patterns.some((p) => p.test(categoryHint))) return tag;
  }
  return slugify(categoryHint);
}

const MERCHANT_STAPLES = [
  'Bird Egg',
  'Cane Sugar',
  'Fresh Milk',
  'Goat Butter',
  'Goron Spice',
  'Hylian Rice',
  'Monster Extract',
  'Raw Bird Drumstick',
  'Raw Bird Thigh',
  'Raw Gourmet Meat',
  'Raw Meat',
  'Raw Prime Meat',
  'Raw Whole Bird',
  'Rock Salt',
  'Tabantha Wheat',
].map((name) => ({
  stapleId: slugify(name),
  name,
  note: 'Present in BotW cooking but absent from Hyrule Compendium API materials snapshot; author as merchant staple overlay when selling or brewing.',
}));

const stapleByName = new Map(MERCHANT_STAPLES.map((s) => [s.name.toLowerCase(), s]));

const RECIPE_TYPE_SLUG: Record<string, string> = {
  'Vegetarian Entrees': 'vegetarian_entree',
  'Seafood Entrees': 'seafood_entree',
  'Poultry and Meat Entrees': 'poultry_meat_entree',
  'Surf and Turf Entrees': 'surf_and_turf',
  Desserts: 'dessert',
  'Monster Foods': 'monster_food',
  'Sides and Snacks': 'side_snack',
};

type Ingredient =
  | {
      kind: 'item';
      raw: string;
      name: string;
      sourceId?: number | null;
      stapleId?: string;
      compendiumCategory?: string;
      compendiumName?: string;
      unresolved?: boolean;
      resolution?: string;
    }
  | {
      kind: 'tag';
      raw: string;
      tag: string;
      categoryHint: string;
      count: number;
      distinct: boolean;
      exclude?: string[];
    }
  | { kind: 'alternatives'; raw: string; options: Ingredient[] }
  | { kind: 'special'; raw: string };

function parseIngredient(rawInput: string): Ingredient {
  const text = titleCaseName(rawInput.trim());

  let m = text.match(/^Any four different (.+)$/i);
  if (m) {
    const hint = m[1];
    return {
      kind: 'tag',
      raw: text,
      tag: resolveTag(hint.replace(/s$/i, '')),
      categoryHint: hint,
      count: 4,
      distinct: true,
    };
  }

  m = text.match(/^Four different (.+)$/i);
  if (m) {
    const hint = m[1];
    return {
      kind: 'tag',
      raw: text,
      tag: resolveTag(hint),
      categoryHint: hint,
      count: 4,
      distinct: true,
    };
  }

  m = text.match(/^Any (.+?) excluding (.+)$/i);
  if (m) {
    const exclusions = m[2]
      .split(/\s+or\s+/i)
      .map((x) => titleCaseName(x.trim()))
      .filter(Boolean);
    return {
      kind: 'tag',
      raw: text,
      tag: resolveTag(m[1].trim()),
      categoryHint: m[1].trim(),
      count: 1,
      distinct: false,
      exclude: exclusions,
    };
  }

  if (/^Any /i.test(text)) {
    const categoryHint = text
      .replace(/^Any\s+/i, '')
      .trim()
      .replace(/\s+combination$/i, '')
      .trim();
    return {
      kind: 'tag',
      raw: text,
      tag: resolveTag(categoryHint),
      categoryHint,
      count: 1,
      distinct: false,
    };
  }

  if (
    /^Two or more /i.test(text) ||
    /^Generally /i.test(text) ||
    /^Monster parts$/i.test(text) ||
    /^Gems \(optional\)$/i.test(text) ||
    /^Wood$/i.test(text)
  ) {
    return { kind: 'special', raw: text };
  }

  if (/\sor\s/i.test(text) && !/^Any /i.test(text)) {
    const options = text
      .split(/\s+or\s+/i)
      .map((x) => x.trim())
      .filter(Boolean);
    return {
      kind: 'alternatives',
      raw: text,
      options: options.map((opt) => {
        if (/^any /i.test(opt)) {
          const hint = opt.replace(/^any\s+/i, '').trim();
          return {
            kind: 'tag' as const,
            raw: opt,
            tag: resolveTag(hint),
            categoryHint: hint,
            count: 1,
            distinct: false,
          };
        }
        const name = titleCaseName(opt);
        return { kind: 'item' as const, raw: name, name };
      }),
    };
  }

  const name = titleCaseName(text);
  return { kind: 'item', raw: name, name };
}

function main(): void {
  const htmlPath = path.join(ROOT, HTML_NAME);
  const html = readFileSync(htmlPath, 'utf8');
  const start = html.indexOf('<table class="jsx-3842362785">');
  const end = html.indexOf('</table>', start);
  if (start < 0 || end < 0) {
    throw new Error(`Recipe table not found in ${HTML_NAME}`);
  }
  const table = html.slice(start, end + 8);

  const compendium = JSON.parse(
    readFileSync(path.join(ROOT, 'src/data/raw/compendium-botw-latest.json'), 'utf8'),
  ) as { data: Array<{ id: number; name: string; category: string }> };
  const byName = new Map(
    compendium.data.map((entry) => [
      entry.name.toLowerCase(),
      { sourceId: entry.id, name: entry.name, category: entry.category },
    ]),
  );

  function attachResolution(ing: Ingredient): Ingredient {
    if (ing.kind === 'item') {
      const resolved = byName.get(ing.name.toLowerCase());
      const staple = stapleByName.get(ing.name.toLowerCase());
      if (resolved) {
        ing.sourceId = resolved.sourceId;
        ing.compendiumCategory = resolved.category;
        ing.compendiumName = resolved.name;
        ing.resolution = 'compendium';
      } else if (staple) {
        ing.sourceId = null;
        ing.stapleId = staple.stapleId;
        ing.resolution = 'merchant_staple';
      } else {
        ing.sourceId = null;
        ing.unresolved = true;
        ing.resolution = 'unresolved';
      }
    } else if (ing.kind === 'alternatives') {
      ing.options.forEach(attachResolution);
    }
    return ing;
  }

  const rowRe = /<tr class="jsx-3842362785">([\s\S]*?)<\/tr>/g;
  const rows: string[] = [];
  let rowMatch: RegExpExecArray | null;
  while ((rowMatch = rowRe.exec(table)) !== null) {
    rows.push(rowMatch[1]);
  }
  const dataRows = rows.filter((r) => !r.includes('<th'));

  const mealTypes = new Map<string, number>();
  const ingredientKinds: Record<string, number> = {
    item: 0,
    tag: 0,
    alternatives: 0,
    special: 0,
  };
  const tagCounts = new Map<string, number>();
  const uniqueIngredientRaws = new Set<string>();
  const recipes: unknown[] = [];

  for (const row of dataRows) {
    const tds = [...row.matchAll(/<td class="jsx-3842362785">([\s\S]*?)<\/td>/g)].map(
      (m) => m[1],
    );
    if (tds.length < 4) continue;

    const mealCell = tds[0];
    const imgMatch = mealCell.match(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"/);
    const name = imgMatch
      ? decodeEntities(imgMatch[1])
      : stripTags(mealCell.replace(/<img[\s\S]*?>/i, '')).replace(/\s+/g, ' ').trim();

    const recipeType = stripTags(tds[1]);
    const ingredientLis = [...tds[2].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) =>
      stripTags(m[1]),
    );
    const madeMatch = tds[3].match(/<span class="label">([^<]+)<\/span>/);
    const made = madeMatch ? decodeEntities(madeMatch[1]) : stripTags(tds[3]);

    const ingredients = ingredientLis.map((raw) => {
      uniqueIngredientRaws.add(raw);
      const parsed = attachResolution(parseIngredient(raw));
      ingredientKinds[parsed.kind] = (ingredientKinds[parsed.kind] ?? 0) + 1;
      if (parsed.kind === 'tag') {
        tagCounts.set(parsed.tag, (tagCounts.get(parsed.tag) ?? 0) + 1);
      }
      if (parsed.kind === 'alternatives') {
        for (const opt of parsed.options) {
          if (opt.kind === 'tag') {
            tagCounts.set(opt.tag, (tagCounts.get(opt.tag) ?? 0) + 1);
          }
        }
      }
      return parsed;
    });

    mealTypes.set(recipeType, (mealTypes.get(recipeType) ?? 0) + 1);

    const slug = slugify(name);
    const remoteSrc = (() => {
      const srcset = mealCell.match(/srcset="([^"]+)"/);
      if (!srcset) return null;
      return decodeEntities(srcset[1].split(',')[0].trim().split(/\s+/)[0]) || null;
    })();
    const htmlBasename = imgMatch?.[2]
      ? path.basename(decodeEntities(imgMatch[2]).split('?')[0])
      : null;

    recipes.push({
      slug,
      name,
      kind: 'meal',
      recipeType,
      recipeTypeId: RECIPE_TYPE_SLUG[recipeType] ?? slugify(recipeType),
      isFailureExample: /dubious|rock-hard/i.test(name),
      ingredients,
      ingredientCount: ingredients.length,
      made,
      image: resolveRecipeImage(slug, htmlBasename, remoteSrc),
    });
  }

  const unresolvedItems = new Set<string>();
  const stapleUsage = new Map<string, number>();
  for (const recipe of recipes as Array<{ ingredients: Ingredient[] }>) {
    const visit = (i: Ingredient): void => {
      if (i.kind === 'item' && i.unresolved) unresolvedItems.add(i.name);
      if (i.kind === 'item' && i.stapleId) {
        stapleUsage.set(i.stapleId, (stapleUsage.get(i.stapleId) ?? 0) + 1);
      }
      if (i.kind === 'alternatives') i.options.forEach(visit);
    };
    recipe.ingredients.forEach(visit);
  }

  mkdirSync(OUT_DIR, { recursive: true });

  type RecipeRecord = {
    slug: string;
    name: string;
    recipeType: string;
    recipeTypeId: string;
    ingredients: Ingredient[];
    image: RecipeImage | null;
  };
  const recipeRecords = recipes as RecipeRecord[];
  const imaged = recipeRecords.filter((r) => r.image?.path);
  const imageManifest = imaged.map((r) => {
    const filename = r.image!.filename;
    const diskPath = path.join(RECIPE_IMAGES_DIR, filename);
    return {
      slug: r.slug,
      name: r.name,
      path: r.image!.path,
      filename,
      bytes: existsSync(diskPath) ? statSync(diskPath).size : 0,
    };
  });

  const payload = {
    meta: {
      source: 'IGN All Recipes and Cookbook (saved HTML)',
      sourceUrl:
        'https://www.ign.com/wikis/the-legend-of-zelda-breath-of-the-wild/All_Recipes_and_Cookbook',
      localHtml: HTML_NAME,
      retrievedNote:
        'Parsed from locally saved HTML. Reference only for authoring — not Nintendo/IGN affiliated. Meal recipes only; elixirs are on a separate IGN page and are not included. Recipe images live in public/images/recipes/.',
      parsedAt: new Date().toISOString().slice(0, 10),
      recipeCount: recipes.length,
      mealTypeCounts: Object.fromEntries([...mealTypes.entries()]),
      ingredientKindCounts: ingredientKinds,
      uniqueIngredientLineCount: uniqueIngredientRaws.size,
      tagCounts: Object.fromEntries([...tagCounts.entries()].sort((a, b) => b[1] - a[1])),
      merchantStapleUsage: Object.fromEntries(
        [...stapleUsage.entries()].sort((a, b) => b[1] - a[1]),
      ),
      unresolvedSpecificItemCount: unresolvedItems.size,
      unresolvedSpecificItems: [...unresolvedItems].sort(),
      images: {
        directory: 'public/images/recipes',
        publicBasePath: RECIPE_IMAGES_PUBLIC_BASE,
        count: imaged.length,
        note: 'Filenames are recipe slugs. IGN _files dump is not required after migration.',
      },
      schemaNotes: [
        'Ingredient slots are item | tag | alternatives | special — not fixed sourceId lists.',
        'Effects are not listed on this IGN page; meal effects derive from ingredient cooking_effect in-game.',
        '15 cooking staples (milk, meats, rice, etc.) are missing from the Compendium API materials snapshot.',
      ],
    },
    merchantStaples: MERCHANT_STAPLES,
    ingredientTags: [...tagCounts.keys()].sort(),
    recipes,
  };

  writeFileSync(path.join(OUT_DIR, 'ign-botw-cookbook.json'), `${JSON.stringify(payload, null, 2)}\n`);
  writeFileSync(
    path.join(OUT_DIR, 'ign-botw-cookbook.slim.json'),
    `${JSON.stringify(
      {
        meta: {
          recipeCount: payload.meta.recipeCount,
          mealTypeCounts: payload.meta.mealTypeCounts,
          sourceUrl: payload.meta.sourceUrl,
          imageDirectory: 'public/images/recipes',
        },
        recipes: recipeRecords.map((r) => ({
          slug: r.slug,
          name: r.name,
          recipeType: r.recipeType,
          recipeTypeId: r.recipeTypeId,
          ingredients: r.ingredients.map((i) => i.raw),
          image: r.image?.path ?? null,
        })),
      },
      null,
      2,
    )}\n`,
  );
  writeFileSync(
    path.join(OUT_DIR, 'merchant-staples.suggested.json'),
    `${JSON.stringify(
      {
        meta: {
          note: 'Suggested overlay keys for cooking ingredients absent from Compendium API',
        },
        staples: MERCHANT_STAPLES,
      },
      null,
      2,
    )}\n`,
  );
  writeFileSync(
    path.join(OUT_DIR, 'recipe-images.manifest.json'),
    `${JSON.stringify(
      {
        meta: {
          count: imageManifest.length,
          directory: 'public/images/recipes',
          publicBasePath: RECIPE_IMAGES_PUBLIC_BASE,
          updatedAt: new Date().toISOString().slice(0, 10),
        },
        images: imageManifest,
      },
      null,
      2,
    )}\n`,
  );

  console.log(
    `Wrote ${recipes.length} recipes → ${path.relative(ROOT, path.join(OUT_DIR, 'ign-botw-cookbook.json'))}`,
  );
  console.log(
    `Recipe images: ${imaged.length} under ${path.relative(ROOT, RECIPE_IMAGES_DIR)}`,
  );
}

main();
