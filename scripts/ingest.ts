import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const RAW_DIR = path.join(ROOT, 'src', 'data', 'raw');

const GAME = 'botw';
const COMPENDIUM_URL =
  'https://api.hyrule-compendium.com/v3/compendium/all?game=botw';
const REGIONS_URL = 'https://api.hyrule-compendium.com/v3/regions/all';

interface ApiEnvelope<T> {
  status: number;
  message: string;
  data: T;
}

async function fetchJson<T>(url: string): Promise<ApiEnvelope<T>> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  const body = (await response.json()) as ApiEnvelope<T>;
  if (body.status !== 200) {
    throw new Error(`API error for ${url}: status=${body.status} message=${body.message}`);
  }
  return body;
}

function todayStamp(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

async function writeSnapshots(basename: string, payload: unknown): Promise<void> {
  const datedPath = path.join(RAW_DIR, `${basename}-${todayStamp()}.json`);
  const latestPath = path.join(RAW_DIR, `${basename}-latest.json`);
  const json = `${JSON.stringify(payload, null, 2)}\n`;
  await writeFile(datedPath, json, 'utf8');
  await writeFile(latestPath, json, 'utf8');
  console.log(`Wrote ${path.relative(ROOT, datedPath)}`);
  console.log(`Wrote ${path.relative(ROOT, latestPath)}`);
}

async function main(): Promise<void> {
  await mkdir(RAW_DIR, { recursive: true });

  console.log(`Fetching ${COMPENDIUM_URL}`);
  const compendium = await fetchJson<unknown[]>(COMPENDIUM_URL);

  console.log(`Fetching ${REGIONS_URL}`);
  const regions = await fetchJson<unknown[]>(REGIONS_URL);

  await writeSnapshots(`compendium-${GAME}`, compendium);
  await writeSnapshots(`regions-${GAME}`, regions);

  const entries = Array.isArray(compendium.data) ? compendium.data : [];
  const categoryCounts: Record<string, number> = {};
  for (const entry of entries) {
    if (entry && typeof entry === 'object' && 'category' in entry) {
      const category = String((entry as { category: string }).category);
      categoryCounts[category] = (categoryCounts[category] ?? 0) + 1;
    }
  }

  const meta = {
    game: GAME,
    retrievedAt: new Date().toISOString(),
    upstream: {
      compendium: COMPENDIUM_URL,
      regions: REGIONS_URL,
    },
    counts: {
      entries: entries.length,
      regions: Array.isArray(regions.data) ? regions.data.length : 0,
      byCategory: categoryCounts,
    },
  };

  const metaPath = path.join(RAW_DIR, 'source-meta.json');
  await writeFile(metaPath, `${JSON.stringify(meta, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${path.relative(ROOT, metaPath)}`);
  console.log(
    `Ingest complete: ${meta.counts.entries} entries, ${meta.counts.regions} regions`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
