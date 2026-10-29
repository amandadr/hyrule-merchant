import { useEffect, useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import {
  addToSatchel,
  clearSatchel,
  decrementSatchel,
  incrementSatchel,
  removeFromSatchel,
  satchelCount,
  satchelItems,
  satchelTotal,
} from '@/stores/satchel';
import { maxSatchelQuantity } from '@/lib/shop/stock';
import type { StockStatus } from '@/lib/data/normalize';

const DEFAULT_THUMB = '/images/staples/default.svg';

interface ItemMeta {
  image: string;
  category: string;
  origin: string;
  stockStatus: StockStatus;
  cookingEffect: string;
}

type ItemIndex = Record<string, ItemMeta>;

interface AddProps {
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
}: AddProps) {
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

/** In-world microcopy for scarce / seasonal / special-order supplies. */
function scarcityLine(status: StockStatus, atCap: boolean): string | null {
  if (atCap) {
    return 'That is all I can pack you this circuit.';
  }
  switch (status) {
    case 'scarce':
      return 'Scarce — I am not gathering more until this patch recovers.';
    case 'seasonal':
      return 'Seasonal — only around for part of the year.';
    case 'special_order':
      return 'Special order — one to a customer.';
    default:
      return null;
  }
}

interface PanelProps {
  itemIndex?: ItemIndex;
}

export function SatchelPanel({ itemIndex = {} }: PanelProps) {
  const items = useStore(satchelItems);
  const [showReceipt, setShowReceipt] = useState(false);
  const [confirmEmpty, setConfirmEmpty] = useState(false);

  // Satchel state is device-local (localStorage); render only after mount so
  // the server's empty-satchel markup can't leave stale rows/links hydrated.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <section class="stack satchel-panel" aria-busy="true">
        <p class="muted">Opening Sorrel’s ledger…</p>
      </section>
    );
  }

  const total = satchelTotal(items);
  const count = satchelCount(items);
  const kinds = items.length;

  if (items.length === 0) {
    return (
      <section class="stack satchel-panel">
        <div class="shop-empty stack">
          <p style={{ margin: 0 }}>
            <strong>Sorrel’s ledger.</strong> Your satchel is empty.
          </p>
          <p class="muted" style={{ margin: 0 }}>
            Pick a road for a journey pack, browse the shelves, or cook something
            at the bench.
          </p>
          <div class="home-cta-row">
            <a class="button button-primary" href="/regions">
              Where are you headed?
            </a>
            <a class="button" href="/shop">
              Visit the shop
            </a>
            <a class="button" href="/brew">
              Open the brewing bench
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section class="stack satchel-panel">
      <p class="satchel-ledger-note">
        <strong>Sorrel’s ledger.</strong> Your satchel is saved on this device.
        Rupees and stock are part of the journey simulation; nothing here creates
        a real order.
      </p>

      <ul class="satchel-list">
        {items.map((item) => {
          const meta = itemIndex[item.productSlug];
          const status = meta?.stockStatus ?? item.stockStatus ?? 'available';
          const cap = maxSatchelQuantity(status);
          const atCap = cap != null && item.quantity >= cap;
          const lineTotal = item.priceRupees * item.quantity;
          const note = scarcityLine(status, atCap);

          return (
            <li class="satchel-row" key={item.productSlug}>
              <img
                class="satchel-thumb"
                src={meta?.image || DEFAULT_THUMB}
                alt={item.name}
                loading="lazy"
                width="56"
                height="56"
              />
              <div class="satchel-row-main">
                <strong>
                  <a href={`/shop/${item.productSlug}`}>{item.name}</a>
                </strong>
                <div class="muted satchel-row-price">
                  {item.priceRupees} rupees each · {lineTotal} rupees total
                </div>
                {note ? <div class="satchel-row-scarce">{note}</div> : null}
              </div>
              <div class="satchel-row-actions">
                <div class="qty-control" role="group" aria-label={`${item.name} quantity`}>
                  <button
                    type="button"
                    class="qty-button"
                    aria-label={`Decrease ${item.name} quantity`}
                    onClick={() => decrementSatchel(item.productSlug)}
                  >
                    <span aria-hidden="true">−</span>
                  </button>
                  <span class="qty-value" aria-live="polite">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    class="qty-button"
                    aria-label={`Increase ${item.name} quantity`}
                    aria-disabled={atCap ? 'true' : undefined}
                    disabled={atCap}
                    onClick={() => {
                      if (!atCap) incrementSatchel(item.productSlug);
                    }}
                  >
                    <span aria-hidden="true">+</span>
                  </button>
                </div>
                <button
                  type="button"
                  class="satchel-remove"
                  aria-label={`Remove ${item.name} from satchel`}
                  onClick={() => removeFromSatchel(item.productSlug)}
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div class="satchel-summary">
        <h2 class="satchel-summary-title">Your satchel</h2>
        <p class="muted satchel-summary-count">
          {kinds} {kinds === 1 ? 'kind' : 'kinds'} of supplies · {count}{' '}
          {count === 1 ? 'item' : 'items'}
        </p>
        <dl class="satchel-summary-lines">
          <div>
            <dt>Goods</dt>
            <dd>{total} rupees</dd>
          </div>
          <div class="satchel-summary-total">
            <dt>Total</dt>
            <dd>{total} rupees</dd>
          </div>
        </dl>
        <button
          type="button"
          class="button satchel-cta"
          aria-expanded={showReceipt ? 'true' : 'false'}
          onClick={() => setShowReceipt((open) => !open)}
        >
          {showReceipt ? 'Close the ledger' : 'Review your order with Sorrel →'}
        </button>

        {showReceipt ? (
          <div class="satchel-receipt" role="region" aria-label="Packing receipt">
            <h3 class="satchel-receipt-title">Packing receipt</h3>
            <ul class="satchel-receipt-list">
              {items.map((item) => (
                <li key={item.productSlug}>
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{item.priceRupees * item.quantity} rupees</span>
                </li>
              ))}
            </ul>
            <div class="satchel-receipt-total">
              <span>Total</span>
              <span>{total} rupees</span>
            </div>
            <p class="satchel-receipt-signoff">
              “Packed and ready. Travel well — and come back with a story.” — Sorrel
            </p>
          </div>
        ) : null}

        <div class="satchel-empty-action">
          {confirmEmpty ? (
            <span class="satchel-confirm">
              Empty everything from your satchel?{' '}
              <button
                type="button"
                class="link-button link-button-danger"
                onClick={() => {
                  clearSatchel();
                  setConfirmEmpty(false);
                  setShowReceipt(false);
                }}
              >
                Yes, empty it
              </button>{' '}
              <button
                type="button"
                class="link-button"
                onClick={() => setConfirmEmpty(false)}
              >
                Keep it
              </button>
            </span>
          ) : (
            <button
              type="button"
              class="link-button"
              onClick={() => setConfirmEmpty(true)}
            >
              Empty satchel
            </button>
          )}
        </div>
      </div>

      <div class="satchel-sticky-bar">
        <span class="satchel-sticky-figures">
          {count} {count === 1 ? 'item' : 'items'} · {total} rupees
        </span>
        <button
          type="button"
          class="button satchel-sticky-cta"
          onClick={() => setShowReceipt(true)}
        >
          Review →
        </button>
      </div>
    </section>
  );
}
