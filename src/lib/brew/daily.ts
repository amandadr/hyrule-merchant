/** Deterministic “daily experiment” from a calendar date (no server). */

import type { Recipe } from '@/lib/data/schemas';

export interface DailyExperiment {
  dateKey: string;
  recipe: Recipe;
  blurb: string;
}

function hashDateKey(dateKey: string): number {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i += 1) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function dateKeyFromDate(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getDailyExperiment(
  recipes: Recipe[],
  date: Date = new Date(),
): DailyExperiment | null {
  const candidates = recipes.filter(
    (recipe) => recipe.kind === 'meal' || recipe.kind === 'elixir',
  );
  if (candidates.length === 0) return null;

  const dateKey = dateKeyFromDate(date);
  const index = hashDateKey(dateKey) % candidates.length;
  const recipe = candidates[index]!;

  return {
    dateKey,
    recipe,
    blurb: `Today’s bench challenge (${dateKey}): brew ${recipe.name}. Effect family: ${recipe.effectFamily}.`,
  };
}
