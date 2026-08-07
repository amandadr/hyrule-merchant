import type { StockStatus } from '@/lib/data/normalize';

/** Fictional satchel quantity caps by stock status. */
export function maxSatchelQuantity(stockStatus: StockStatus): number | null {
  switch (stockStatus) {
    case 'scarce':
      return 2;
    case 'seasonal':
      return 3;
    case 'special_order':
      return 1;
    case 'not_sold':
    case 'guide_only':
      return 0;
    default:
      return null; // unlimited for available
  }
}

export function canAddToSatchel(
  stockStatus: StockStatus,
  currentQuantity: number,
  addBy = 1,
): { ok: boolean; reason?: string; max?: number } {
  const max = maxSatchelQuantity(stockStatus);
  if (max === 0) {
    return { ok: false, reason: 'This item is not sold from the cart.', max: 0 };
  }
  if (max == null) {
    return { ok: true };
  }
  if (currentQuantity + addBy > max) {
    return {
      ok: false,
      reason: `Scarce stock — merchants only pack up to ${max}.`,
      max,
    };
  }
  return { ok: true, max };
}
