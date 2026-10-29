# The Good Detour

Unofficial, noncommercial portfolio prototype: a simulated Hyrule outfitter, field manual, and brewing bench. The in-world shop is **The Good Detour**, run by **Sorrel** (a former roadwarden) with a Korok companion named **Pip**. The engineering project name remains **Hyrule Merchant**.

Powered by a build-time snapshot of the [Hyrule Compendium API](https://github.com/gadhagod/Hyrule-Compendium-API) (Breath of the Wild). The site builds offline against committed snapshots — no live API at runtime.

**Not affiliated with Nintendo.** No real orders, payments, accounts, or personal data are collected. Prices, stock, recipes, and merchant notes are invented fiction.

> Pack smarter. Travel farther. Return with a better story.

## Current status

Live at [merchant.amandadroy.com](https://merchant.amandadroy.com/). The site stays public while development continues. Pages send `noindex, nofollow` (HTML meta and a Netlify `X-Robots-Tag`) so crawlers can fetch them and still leave them out of search results.

The data foundation, catalogue, field manual, region notes, journey packs, satchel, and brewing bench are working. Identity and world-building are drafted.

| Area | State |
| --- | --- |
| Identity | Shop, merchant, and companion named; `/merchant` page in Sorrel’s voice |
| Data pipeline | BotW snapshot ingested, Zod-validated, normalized, then enriched with overrides |
| Shop | Full Compendium catalogue (~389 SKUs) plus 15 pantry staples; filters, journey packs, recipe deep-links |
| Field manual | All snapshot categories (creatures, materials, equipment, monsters, treasure) |
| Regions | 15 BotW regions with authored field notes and a recommended journey pack each |
| Journey packs | Authored kits with per-item reasons; add the whole pack to the satchel from a region page |
| Brewing | Named meals from the IGN cookbook corpus, 5 merchant elixirs, free-brew rules, daily experiment |
| Satchel | Browser-persistent cart, scarcity caps, packing receipt, recommendations |
| Visual design | Parchment layout and a text wordmark. Still being polished in public |
| Deploy | [Netlify](https://merchant.amandadroy.com/): `npm run build`, publish `dist`, Node 22.12+. No environment variables |
| Case study | Not started |

Foundation brief phases: **0–3 are largely in place**, and the static site is deployed. **Phase 4 (polish)** continues on the public site. **Phase 5 (case study)** is still open. See [Next steps](#next-steps).

## Stack

- [Astro](https://astro.build) 7 + TypeScript, static output
- Preact islands for shop filters, brewing bench, and satchel
- [nanostores](https://github.com/nanostores/nanostores) + `localStorage` for satchel state
- Zod schemas at build time
- Vitest for data, brew, and recommendation unit tests

## Requirements

- Node.js 22.12+ (see `.nvmrc` and `engines` in `package.json`)

If your shell defaults to an older Node, run `nvm use` before install or dev.

`astro` is a project-local binary. Use `npm run …` or `npx astro …`, not a global `astro` command.

## Setup

```bash
npm install
npm run ingest   # optional — refresh snapshots if you want newer API data
npm run dev
```

For a background dev server (preferred in this repo):

```bash
npm run dev:bg
npm run dev:status
npm run dev:logs
npm run dev:stop
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local Astro dev server |
| `npm run dev:bg` | Dev server in the background |
| `npm run build` | Static production build (committed snapshots only; no live API) |
| `npm run preview` | Preview the production build |
| `npm run ingest` | Refresh BotW compendium + regions snapshots from the API |
| `npm run parse:ign-cookbook` | Re-parse the saved IGN cookbook HTML into reference JSON |
| `npm run build:cookbook` | Rebuild runtime `recipes.json` from the IGN reference |
| `npm test` | Unit tests (schemas, normalize/enrich, brew rules, recommendations) |

## Site map

| Route | Role |
| --- | --- |
| `/` | Home, snapshot meta, today’s bench challenge |
| `/shop` | Catalogue with shelf filters; `?recipe=` deep-links |
| `/shop/[slug]` | Product detail |
| `/guide` | Field Manual index |
| `/guide/[category]/[slug]` | Manual entry |
| `/regions` | Destination list |
| `/regions/[slug]` | API facts, Sorrel’s field notes, and journey pack |
| `/brew` | Brewing bench (meals, elixirs, free-brew, daily experiment) |
| `/satchel` | Cart, packing receipt, “what else to carry” recommendations |
| `/merchant` | Origin story, credits, noncommercial disclaimer |

## Data pipeline

Source facts and invented shop fiction stay separate.

1. `npm run ingest` fetches `/v3/compendium/all?game=botw` and `/v3/regions/all`.
2. Snapshots land under `src/data/raw/` (`*-latest.json` plus dated copies) with `source-meta.json`.
3. Build-time Zod validation normalizes records into internal models (`src/lib/data/`).
4. Invented commerce, recipes, outfits, and region notes live only in `src/data/overrides/`.
5. Merchant pantry staples (milk, meats, rice, …) live in `merchant-staples.json` with synthetic ids `900001+` — they fill Compendium gaps and are never mixed into the snapshot.
6. The IGN cookbook dump is **reference-only** under `src/data/reference/` until `build:cookbook` writes runtime recipes.

The production build uses the last known-good `*-latest.json` files. It does not call the API.

## Authoring

| File | What it owns |
| --- | --- |
| `src/data/overrides/products.json` | Optional price / stock / note overrides |
| `src/data/overrides/merchant-staples.json` | Pantry SKUs missing from the Compendium |
| `src/data/overrides/recipes.json` | Named meals and elixirs |
| `src/data/overrides/outfits.json` | Journey packs (per-region kits + trail skewer) |
| `src/data/overrides/regions.json` | Sorrel’s field notes per region |
| `src/data/overrides/exclusions.json` | Source ids to keep out of the shop |
| `src/config/site.ts` | Brand strings, names, game scope |

Guides: [docs/catalogue-authoring.md](docs/catalogue-authoring.md), [docs/recipe-authoring.md](docs/recipe-authoring.md).

## Docs

| Document | Purpose |
| --- | --- |
| [docs/Hyrule_Merchant_Project_Foundation_Brief.md](docs/Hyrule_Merchant_Project_Foundation_Brief.md) | Concept, architecture, MVP, phased roadmap |
| [docs/shop-backstory.md](docs/shop-backstory.md) | Origin of The Good Detour, Sorrel, and Pip |
| [docs/merchant-character.md](docs/merchant-character.md) | Voice, values, habits |
| [docs/Website_Delivery_Framework_MRC.md](docs/Website_Delivery_Framework_MRC.md) | General MRC delivery process |
| [src/data/reference/README.md](src/data/reference/README.md) | Cookbook reference corpus (not runtime) |

## Next steps

Ordered for a polished first release rather than more systems.

1. **Keep the storefront in Sorrel’s voice.** The header is the text name, The Good Detour. Replace leftover generic notes as you playtest.
2. **Journey packs.** Done — each region has a recommended pack with reasons and add-to-satchel. Tighten copy and kits as you playtest.
3. **Fix missing art.** Recipes and staples reference `/images/recipes/…` and `/images/staples/…` that are not in `public/` (except a staple fallback SVG).
4. **Tighten the catalogue.** Default commerce covers every Compendium record. Curate shelves, exclusions, and merchant notes so the shop feels chosen, not dumped.
5. **Relationship browsing.** Link monsters → drops → products → recipes → regions so the guide and shop read as one world.
6. **Phase 4 polish.** Accessibility (keyboard, contrast, reduced motion), responsive QA, and a performance pass on the live Netlify site. Keep `noindex` until you want it searchable.
7. **Case study.** A short public page that explains the pipeline, fiction boundary, and design decisions — the portfolio artifact this project is meant to produce.

Later: field journal / favourites, richer brew “use what I have,” more region kits, and a merchant circuit map. Stay out of real payments, live APIs, and full game-formula simulation.
