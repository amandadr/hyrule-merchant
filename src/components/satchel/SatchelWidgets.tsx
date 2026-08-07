import { useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import {
  addToSatchel,
  clearSatchel,
  removeFromSatchel,
  satchelItems,
  satchelTotal,
} from '@/stores/satchel';
import type { StockStatus } from '@/lib/data/normalize';

interface Props {
  productSlug: string;
  sourceId: number;
  name: string;
  priceRupees: number;
  stockStatus: StockStatus;
}

export default function AddToSatchelButton({
  productSlug,
  sourceId,
  name,
  priceRupees,
  stockStatus,
}: Props) {
  const items = useStore(satchelItems);
  const [message, setMessage] = useState<string | null>(null);
  const inSatchel = items.some((item) => item.productSlug === productSlug);

  return (
    <div class="stack">
      <p class="notice muted">
        Simulated cart only. Nothing is purchased or stored on a server.
        {stockStatus === 'scarce' ? ' Scarce goods cap at 2 in the satchel.' : ''}
        {stockStatus === 'special_order' ? ' Special orders cap at 1.' : ''}
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => {
            const result = addToSatchel({
              productSlug,
              sourceId,
              name,
              priceRupees,
              stockStatus,
            });
            setMessage(result.ok ? null : result.reason ?? 'Could not add.');
          }}
        >
          {inSatchel ? 'Add another' : 'Add to satchel'}
        </button>
        {inSatchel ? (
          <button type="button" onClick={() => removeFromSatchel(productSlug)}>
            Remove
          </button>
        ) : null}
      </div>
      {message ? <p class="notice">{message}</p> : null}
    </div>
  );
}

export function SatchelPanel() {
  const items = useStore(satchelItems);
  const total = satchelTotal(items);

  if (items.length === 0) {
    return (
      <div class="stack">
        <p class="notice muted">
          Simulated cart only. Your satchel is empty — browse the shop to add
          goods.
        </p>
        <p>
          <a href="/shop">Visit the shop</a>
        </p>
      </div>
    );
  }

  return (
    <div class="stack">
      <p class="notice muted">
        Simulated cart only. Totals use fictional rupee prices and persist in
        this browser.
      </p>
      <ul class="stack" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item) => (
          <li
            key={item.productSlug}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem',
              alignItems: 'baseline',
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: '0.5rem',
            }}
          >
            <div>
              <strong>
                <a href={`/shop/${item.productSlug}`}>{item.name}</a>
              </strong>
              <div class="muted">
                × {item.quantity} · {item.priceRupees} rupees each
                {item.stockStatus === 'special_order' ? ' · special order' : ''}
                {item.stockStatus === 'scarce' ? ' · scarce' : ''}
              </div>
            </div>
            <button type="button" onClick={() => removeFromSatchel(item.productSlug)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p>
        <strong>Total:</strong> {total} rupees
      </p>
      <button type="button" onClick={() => clearSatchel()}>
        Clear satchel
      </button>
    </div>
  );
}
