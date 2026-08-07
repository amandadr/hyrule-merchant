# Recipe authoring

Runtime recipes: `src/data/overrides/recipes.json`  
Reference corpus: `src/data/reference/ign-botw-cookbook.json` (118 IGN meals)  
Rules engine: `src/lib/brew/evaluate.ts`  
Slot resolver: `src/lib/brew/resolve.ts`  
Tag map: `src/lib/brew/tags.ts`  
Daily experiment: `src/lib/brew/daily.ts`

## Merchant rule summary

### Meals

- Pot size: **1–5** ingredients.
- Named match: every slot filled and every selected ingredient consumed.
- Slot kinds: `item`, `staple`, `tag`, `alternatives`, `special`.
- Free-brew: single cooking effect → effect dish with bands; no effect → hearts.
- Conflicting meal effects or mixing monster parts into meals → **Dubious Food**.

### Elixirs

- Critter (butterfly, darner, cricket, frog, lizard, firefly, beetle, fairy) sets **effect**.
- Monster entry (sold as a “part”) stretches **strength/duration** bands.
- Free-brew: critter + monster, no meal materials/staples mixed in.
- Critter alone or monster alone → clear failure note (not dubious).
- Meal + elixir mix → dubious / failure.

Bands are honest fiction — not BotW formula clones.

## Phase 3+ recipe set

Runtime cookbook is built from the full IGN meal corpus (**118** meals/failures) plus **5** merchant elixirs (**123** total).

Regenerate from reference:

```bash
npx tsx scripts/build-cookbook-from-ign.ts
```

### Meals

All IGN meal types: vegetarian, seafood, poultry/meat, surf & turf, desserts, monster foods, sides/snacks — including failure examples `dubious-food` and `rock-hard-food`.

### Elixirs (5)

| Slug | Critter | Monster stand-in | Effect |
| --- | --- | --- | --- |
| hasty-elixir | hot-footed frog (79) | chuchu (84) | speed up |
| spicy-elixir | summerwing (68) | chuchu (84) | cold resistance |
| chilly-elixir | winterwing (67) | fire chuchu (85) | heat resistance |
| sneaky-elixir | sunset firefly (78) | keese (88) | stealth up |
| mighty-elixir | bladed rhino beetle (75) | chuchu (84) | attack up |

## Adding a recipe

1. Prefer a row from the IGN reference (meals) or author an elixir pair.
2. Translate lines into slots (`stapleId` for milk/meat/rice/etc.), or re-run `build-cookbook-from-ign.ts` after updating the reference JSON.
3. Set `effectFamily` from the dominant ingredient effect or `hearts` / `variable` / `none`.
4. Copy meal images from `/images/recipes/{slug}.jpg` when available.
5. Link `sourceRefs.ignSlug` when applicable.
