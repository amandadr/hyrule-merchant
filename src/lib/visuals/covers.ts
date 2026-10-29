import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CoversFileSchema, type EntryCategory } from '@/lib/data/schemas';
import { titleCaseName } from '@/lib/data/normalize';

/**
 * Portraits for roads and field-manual sections.
 * The compendium snapshot has entry art, not map tiles, so each region is
 * pictured by a subject travelers meet there.
 */

export interface PicturedSubject {
  image: string;
  name: string;
  label: string;
}

interface NamedImage {
  name: string;
  image: string;
}

// Walk up to the repo root, then into src. During `astro build` this module
// is emitted under dist/, and a path relative to src/lib/visuals lands in dist/data.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const COVERS_PATH = path.join(ROOT, 'src', 'data', 'overrides', 'covers.json');

let coversCache: ReturnType<typeof CoversFileSchema.parse> | null = null;

export function getCoverNames(): ReturnType<typeof CoversFileSchema.parse> {
  if (coversCache) return coversCache;
  const file = JSON.parse(readFileSync(COVERS_PATH, 'utf8')) as unknown;
  coversCache = CoversFileSchema.parse(file);
  return coversCache;
}

export function pictureOf(
  entryName: string | undefined,
  entries: readonly NamedImage[],
): PicturedSubject | undefined {
  if (!entryName) return undefined;
  const entry = entries.find((item) => item.name === entryName);
  if (!entry) return undefined;
  return {
    image: entry.image,
    name: entry.name,
    label: titleCaseName(entry.name),
  };
}

export function regionCover(
  regionSlug: string,
  entries: readonly NamedImage[],
): PicturedSubject | undefined {
  return pictureOf(getCoverNames().regions[regionSlug], entries);
}

export function categoryCover(
  category: EntryCategory,
  entries: readonly NamedImage[],
): PicturedSubject | undefined {
  return pictureOf(getCoverNames().categories[category], entries);
}
