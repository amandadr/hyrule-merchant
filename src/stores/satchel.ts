import { persistentAtom } from '@nanostores/persistent';
import type { StockStatus } from '@/lib/data/normalize';
import { canAddToSatchel } from '@/lib/shop/stock';

export interface SatchelItem {
  productSlug: string;
  sourceId: number;
  name: string;
  priceRupees: number;
  quantity: number;
  stockStatus?: StockStatus;
}

export const satchelItems = persistentAtom<SatchelItem[]>('hyrule-merchant:satchel', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export function addToSatchel(
  item: Omit<SatchelItem, 'quantity'> & {
    quantity?: number;
    stockStatus?: StockStatus;
  },
): { ok: boolean; reason?: string } {
  const quantity = item.quantity ?? 1;
  const current = satchelItems.get();
  const existing = current.find((entry) => entry.productSlug === item.productSlug);
  const currentQty = existing?.quantity ?? 0;
  const stockStatus = item.stockStatus ?? existing?.stockStatus ?? 'available';
  const check = canAddToSatchel(stockStatus, currentQty, quantity);
  if (!check.ok) {
    return { ok: false, reason: check.reason };
  }

  if (existing) {
    satchelItems.set(
      current.map((entry) =>
        entry.productSlug === item.productSlug
          ? {
              ...entry,
              quantity: entry.quantity + quantity,
              stockStatus: stockStatus,
            }
          : entry,
      ),
    );
    return { ok: true };
  }

  satchelItems.set([
    ...current,
    {
      productSlug: item.productSlug,
      sourceId: item.sourceId,
      name: item.name,
      priceRupees: item.priceRupees,
      quantity,
      stockStatus,
    },
  ]);
  return { ok: true };
}

export function removeFromSatchel(productSlug: string): void {
  satchelItems.set(satchelItems.get().filter((entry) => entry.productSlug !== productSlug));
}

export function clearSatchel(): void {
  satchelItems.set([]);
}

export function satchelTotal(items: SatchelItem[]): number {
  return items.reduce((sum, item) => sum + item.priceRupees * item.quantity, 0);
}
