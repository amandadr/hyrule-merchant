import { useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { addToSatchel, satchelItems } from '@/stores/satchel';
import type { JourneyPackCardPayload } from '@/lib/journey/packs';
import type { StockStatus } from '@/lib/data/normalize';

interface Props {
  pack: JourneyPackCardPayload;
}

export default function JourneyPackCard({ pack }: Props) {
  const items = useStore(satchelItems);
  const [message, setMessage] = useState<string | null>(null);

  const ownedBySlug = new Map(
    items.map((item) => [item.productSlug, item.quantity]),
  );

  function addPack(): void {
    let added = 0;
    let skipped = 0;
    const notes: string[] = [];

    for (const line of pack.items) {
      const result = addToSatchel({
        productSlug: line.productSlug,
        sourceId: line.sourceId,
        name: line.name,
        priceRupees: line.priceRupees,
        quantity: line.quantity,
        stockStatus: line.stockStatus as StockStatus,
      });
      if (result.ok) {
        added += 1;
      } else {
        skipped += 1;
        if (result.reason) notes.push(`${line.name}: ${result.reason}`);
      }
    }

    if (added > 0 && skipped === 0) {
      setMessage(`Packed ${added} supplies into your satchel.`);
    } else if (added > 0) {
      setMessage(
        `Packed ${added}. Skipped ${skipped}${notes[0] ? ` — ${notes[0]}` : '.'}`,
      );
    } else {
      setMessage(notes[0] ?? 'Could not add this pack — check satchel limits.');
    }
  }

  return (
    <section class="journey-pack" aria-labelledby={`pack-${pack.slug}-title`}>
      <header class="journey-pack-header">
        <ul class="kit-strip kit-strip-banner" aria-label={`${pack.name} contents`}>
          {pack.items.map((line) => (
            <li key={line.productSlug}>
              <img
                src={line.image}
                alt={line.name}
                width="72"
                height="72"
                loading="lazy"
              />
            </li>
          ))}
        </ul>
        <h3 id={`pack-${pack.slug}-title`}>{pack.name}</h3>
        <p class="journey-pack-objective">{pack.objective}</p>
        <p class="muted">{pack.merchantNote}</p>
      </header>

      <ul class="journey-pack-items">
        {pack.items.map((line) => {
          const owned = ownedBySlug.get(line.productSlug) ?? 0;
          return (
            <li class="journey-pack-item" key={line.productSlug}>
              <img
                class="journey-pack-thumb"
                src={line.image}
                alt={line.name}
                width="48"
                height="48"
                loading="lazy"
              />
              <div class="journey-pack-item-body">
                <div class="journey-pack-item-top">
                  <a href={line.href}>
                    <strong>
                      {line.name}
                      {line.quantity > 1 ? ` ×${line.quantity}` : ''}
                    </strong>
                  </a>
                  <span class="journey-pack-price">
                    {line.lineTotal} rupees
                  </span>
                </div>
                <p class="journey-pack-reason">{line.reason}</p>
                {owned > 0 ? (
                  <p class="muted journey-pack-owned">In satchel ×{owned}</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      <div class="journey-pack-footer">
        <p class="journey-pack-total">
          <strong>Pack total</strong>
          <span>{pack.totalRupees} rupees</span>
        </p>
        <button type="button" class="button journey-pack-cta" onClick={addPack}>
          Add pack to satchel
        </button>
        {message ? <p class="muted journey-pack-msg">{message}</p> : null}
        <p class="muted journey-pack-disclaimer">
          Fictional prices and stock — nothing here creates a real order.
        </p>
      </div>
    </section>
  );
}
