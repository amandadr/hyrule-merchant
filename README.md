# Hyrule Merchant

Unofficial, noncommercial portfolio prototype: a simulated Hyrule shop and field guide powered by a build-time snapshot of the [Hyrule Compendium API](https://github.com/gadhagod/Hyrule-Compendium-API).

**Not affiliated with Nintendo.** No real orders, payments, accounts, or personal data are collected. Prices and stock are fictional.

## Requirements

- Node.js 22.12+

## Setup

```bash
npm install
npm run ingest   # fetch API snapshots into src/data/raw (optional if latest already committed)
npm run dev
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local Astro dev server |
| `npm run build` | Static production build (uses committed snapshots; no live API) |
| `npm run preview` | Preview the production build |
| `npm run ingest` | Refresh BotW compendium + regions snapshots from the API |
| `npm test` | Run unit tests (schema / normalize) |

## Data pipeline

1. `npm run ingest` fetches `/v3/compendium/all?game=botw` and `/v3/regions/all`
2. Snapshots are written under `src/data/raw/` (`*-latest.json` plus dated copies)
3. Build-time Zod validation normalizes records into `SourceEntry` models
4. Invented shop fields live only in `src/data/overrides/` — never mixed into source facts
5. Merchant pantry staples (milk, meats, rice, …) live in `merchant-staples.json` with synthetic ids `900001+`
6. Named recipes / outfits are authored overlays; IGN cookbook dump is reference-only under `src/data/reference/`

The site builds offline against the last known-good `*-latest.json` files.

## Placeholder brand

Shop name is currently **Hyrule Merchant**. World-building, voice, and styling come later.
