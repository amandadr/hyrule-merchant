import { useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { addToSatchel, satchelItems } from '@/stores/satchel';
import { maxSatchelQuantity } from '@/lib/shop/stock';
import type { StockStatus } from '@/lib/data/normalize';
import { titleCaseName } from '@/lib/data/normalize';

interface Props {
  productSlug: string;
  sourceId: number;
  name: string;
  priceRupees: number;
  stockStatus: string;
}

export default function ProductCardAdd({
  productSlug,
  sourceId,
  name,
  priceRupees,
  stockStatus,
}: Props) {
  const items = useStore(satchelItems);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  const status = stockStatus as StockStatus;
  const inSatchel = items.find((item) => item.productSlug === productSlug);
  const currentQty = inSatchel?.quantity ?? 0;
  const cap = maxSatchelQuantity(status);
  const remaining = cap == null ? 20 : Math.max(0, cap - currentQty);
  const maxSelectable = Math.max(1, Math.min(remaining || 1, 20));
  const canAdd = remaining > 0;

  function bump(delta: number): void {
    setMessage(null);
    setQuantity((current) =>
      Math.min(maxSelectable, Math.max(1, current + delta)),
    );
  }

  function add(): void {
    if (!canAdd) {
      setMessage(cap === 0 ? 'Not sold here.' : 'Satchel at stock cap.');
      return;
    }
    const qty = Math.min(quantity, remaining);
    const result = addToSatchel({
      productSlug,
      sourceId,
      name: titleCaseName(name),
      priceRupees,
      quantity: qty,
      stockStatus: status,
    });
    if (result.ok) {
      setMessage(`Added ×${qty}`);
      setQuantity(1);
    } else {
      setMessage(result.reason ?? 'Could not add.');
    }
  }

  return (
    <div class="product-card-actions">
      <div class="qty-control" aria-label="Quantity">
        <button
          type="button"
          class="qty-btn"
          onClick={() => bump(-1)}
          disabled={!canAdd || quantity <= 1}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span class="qty-value" aria-live="polite">
          {canAdd ? quantity : 0}
        </span>
        <button
          type="button"
          class="qty-btn"
          onClick={() => bump(1)}
          disabled={!canAdd || quantity >= maxSelectable}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        type="button"
        class="product-add-btn"
        onClick={add}
        disabled={!canAdd}
      >
        Add to satchel
      </button>
      {message ? <p class="product-add-msg muted">{message}</p> : null}
      {inSatchel && !message ? (
        <p class="product-add-msg muted">In satchel ×{currentQty}</p>
      ) : null}
    </div>
  );
}
