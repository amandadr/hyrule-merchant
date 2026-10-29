# Catalogue authoring

Products are **every Compendium entry** plus `src/data/overrides/merchant-staples.json` (synthetic pantry SKUs). Optional authored pricing lives in `src/data/overrides/products.json` and overrides the defaults for matching `sourceId`s. Never invent prices into the Compendium snapshot.

## Full catalogue

`enrichProducts()` builds one shop SKU per Compendium record (~389) + 15 staples. Missing override rows get deterministic fictional `priceRupees` / `stockStatus` / `merchantNote` from `defaultProductCommerce()`.

Authored overrides in `products.json` still refine high-traffic SKUs (effects, staples companions, trail gear).

Shop UI defaults to a **shelf** (Materials / Creatures / Equipment / Pantry staples). Recipe deep-links: `/shop?recipe=curry-rice`.

## Stock / price bands (fictional)

| Band | Price cue | Stock | Satchel cap |
| --- | --- | --- | --- |
| Staple pantry | 8–18 | mostly `available` | unlimited |
| Effect materials | 14–40 | `available` / `scarce` / `seasonal` | scarce ≤2, seasonal ≤3 |
| Critters / parts | 6–16 | mostly `available` | — |
| Gear | ~28+ by power | `available` / `special_order` / `scarce` | special_order ≤1 |
| Treasure | 40–120 | `scarce` | scarce ≤2 |

`not_sold` / `guide_only` never appear in the shop grid (use only via overrides).

## Checklist per authored override

1. Valid `sourceId` from Compendium **or** staple in `900001+`
2. `priceRupees`, `stockStatus`, voiceful `merchantNote`
3. Prefer linking climate goods into a region journey pack (`outfits.json`)
4. Critters/monsters needed by elixir recipes should be purchasable
