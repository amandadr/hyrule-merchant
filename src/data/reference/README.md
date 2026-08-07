# Reference data (not runtime content)

Authoring aids collected for Phase 2 recipe and catalogue work. Cookbook JSON here is **not** loaded by the Astro site at build time unless explicitly wired later. Recipe **images** are static assets under `public/images/recipes/`.

## IGN BotW cookbook

| File | Purpose |
| --- | --- |
| [`ign-botw-cookbook.json`](ign-botw-cookbook.json) | Full parse: 118 meal recipes, structured ingredient slots, image refs, staple/tag metadata |
| [`ign-botw-cookbook.slim.json`](ign-botw-cookbook.slim.json) | Name + type + ingredient lines + image paths |
| [`recipe-images.manifest.json`](recipe-images.manifest.json) | Slug → `/images/recipes/{slug}.jpg` inventory |
| [`merchant-staples.suggested.json`](merchant-staples.suggested.json) | Name checklist only — **runtime data:** [`../overrides/merchant-staples.json`](../overrides/merchant-staples.json) |

**Images:** [`public/images/recipes/`](../../../public/images/recipes/) — one JPG per recipe, named by slug (e.g. `creamy-heart-soup.jpg`). Served at `/images/recipes/...`.

**Source:** [IGN — All Recipes and Cookbook](https://www.ign.com/wikis/the-legend-of-zelda-breath-of-the-wild/All_Recipes_and_Cookbook)  
**Local HTML (text re-parse only):** repo root `All Recipes and Cookbook - The Legend of Zelda_ Breath of the Wild Guide - IGN.html`  
**Regenerate JSON:** `npm run parse:ign-cookbook` (reuses images already in `public/images/recipes/`)

### What this covers

- Meal dishes only (vegetarian, seafood, meat, surf & turf, desserts, monster foods, sides)
- Ingredient lines as `item` | `tag` | `alternatives` | `special`
- Cross-links to Compendium `sourceId` when the name exists in `compendium-botw-latest.json`
- Local recipe thumbnails migrated out of the saved IGN `_files` dump

### What this does not cover

- **Elixirs** (separate IGN page)
- Effect / duration / hearts outcomes (IGN list does not include them; effects come from ingredients in-game)
- Exact game formula fidelity — merchant recipes remain a simplified authored overlay

### Compendium gap

The BotW Compendium API materials list (36 entries) omits staples such as Fresh Milk, Goat Butter, meats, Hylian Rice, Rock Salt, etc. Those resolve as shop products in [`../overrides/merchant-staples.json`](../overrides/merchant-staples.json) with synthetic `sourceId`s in the `900001+` band (not mixed into the Compendium snapshot).
