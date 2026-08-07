import type { ComponentChildren } from 'preact';
import {
  EffectFamilyChip,
  HeartsDisplay,
} from '@/components/brew/EffectBadges';

const STOCK_LABEL: Record<string, string> = {
  available: 'In Stock',
  scarce: 'Scarce',
  seasonal: 'Seasonal',
  special_order: 'Special Order',
  guide_only: 'Guide Only',
  not_sold: 'Not Sold',
};

const SHELF_LABEL: Record<string, string> = {
  staples: 'Pantry',
  materials: 'Materials',
  creatures: 'Creatures',
  equipment: 'Equipment',
  monsters: 'Parts',
};

function RupeeIcon() {
  return (
    <svg
      class="rupee-icon"
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M8 1.2 13.5 5v6L8 14.8 2.5 11V5L8 1.2zm0 1.7L4 5.3v5.4l4 2.4 4-2.4V5.3L8 2.9z"
      />
      <path fill="currentColor" d="M8 5.2 10.6 8 8 10.8 5.4 8z" />
    </svg>
  );
}

function StockGlyph({ status }: { status: string }) {
  if (status === 'scarce') {
    return (
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
        <path
          d="M8 2 14 13H2L8 2z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.4"
        />
        <path d="M8 6.5v3.2M8 11.2h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    );
  }
  if (status === 'seasonal') {
    return (
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
        <circle cx="8" cy="8" r="3" fill="currentColor" />
        <path
          d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M12.6 3.4l-1.4 1.4M4.8 11.2l-1.4 1.4"
          stroke="currentColor"
          stroke-width="1.3"
          fill="none"
        />
      </svg>
    );
  }
  if (status === 'special_order') {
    return (
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
        <path
          d="M3 4.5h10v8H3zM5.5 4.5V3.2a2.5 2.5 0 0 1 5 0V4.5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.4"
        />
      </svg>
    );
  }
  // available / default — check
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" stroke-width="1.3" />
      <path
        d="M5.2 8.1 7.1 10l3.7-4.2"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function ShelfGlyph({ shelf }: { shelf: string }) {
  if (shelf === 'staples') {
    return (
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
        <path
          d="M3 13V6l5-3 5 3v7H3z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.3"
        />
        <path d="M6.5 13V8h3v5" fill="none" stroke="currentColor" stroke-width="1.3" />
      </svg>
    );
  }
  if (shelf === 'creatures' || shelf === 'monsters') {
    return (
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
        <circle cx="8" cy="7" r="3.2" fill="none" stroke="currentColor" stroke-width="1.3" />
        <path
          d="M4 13c1.2-2 2.8-3 4-3s2.8 1 4 3"
          fill="none"
          stroke="currentColor"
          stroke-width="1.3"
          stroke-linecap="round"
        />
      </svg>
    );
  }
  if (shelf === 'equipment') {
    return (
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
        <path
          d="M10 2l4 4-7 7H3v-4l7-7z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.3"
        />
      </svg>
    );
  }
  // materials
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path
        d="M8 2c2.5 0 4.5 3.2 4.5 6.2S10 14 8 14 3.5 11.2 3.5 8.2 5.5 2 8 2z"
        fill="none"
        stroke="currentColor"
        stroke-width="1.3"
      />
      <path d="M8 5v5M6 8.5h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
    </svg>
  );
}

export function RupeePrice({
  amount,
  compact = false,
  emphasize = false,
}: {
  amount: number;
  compact?: boolean;
  emphasize?: boolean;
}) {
  return (
    <span
      class={`product-chip product-chip-price${emphasize ? ' is-emphasis' : ''}`}
      title={`${amount} rupees`}
    >
      <RupeeIcon />
      <span>
        {amount}
        {compact ? '' : <span class="product-chip-unit"> rupees</span>}
      </span>
    </span>
  );
}

export function StockChip({ status }: { status: string }) {
  const label = STOCK_LABEL[status] ?? titleCaseWords(status.replace(/_/g, ' '));
  return (
    <span
      class={`product-chip product-chip-stock stock-${status}`}
      title={label}
    >
      <StockGlyph status={status} />
      <span>{label}</span>
    </span>
  );
}

function titleCaseWords(value: string): string {
  return value
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export function ShelfChip({
  shelf,
  origin,
  category,
}: {
  shelf?: string;
  origin?: string;
  category?: string;
}) {
  const key =
    shelf ||
    (origin === 'merchant_staple' ? 'staples' : category) ||
    'materials';
  const label = SHELF_LABEL[key] ?? titleCaseWords(key.replace(/_/g, ' '));
  return (
    <span class={`product-chip product-chip-shelf shelf-${key}`} title={label}>
      <ShelfGlyph shelf={key} />
      <span>{label}</span>
    </span>
  );
}

export function ProductMeta({
  priceRupees,
  stockStatus,
  origin,
  category,
  cookingEffect,
  heartsRecovered,
  shelf,
  compactPrice = true,
  emphasizePrice = false,
}: {
  priceRupees: number;
  stockStatus: string;
  origin?: string;
  category?: string;
  cookingEffect?: string;
  heartsRecovered?: number;
  shelf?: string;
  compactPrice?: boolean;
  emphasizePrice?: boolean;
}) {
  const chips: ComponentChildren[] = [
    <StockChip key="stock" status={stockStatus} />,
    <ShelfChip
      key="shelf"
      shelf={shelf}
      origin={origin}
      category={category}
    />,
  ];

  if (cookingEffect) {
    chips.push(<EffectFamilyChip key="effect" family={cookingEffect} />);
  }

  const showHearts = Boolean(heartsRecovered && heartsRecovered > 0);

  return (
    <div class={`product-meta${emphasizePrice ? ' product-meta-stacked' : ''}`}>
      <div class="product-price-row">
        <RupeePrice
          amount={priceRupees}
          compact={compactPrice}
          emphasize={emphasizePrice}
        />
        {showHearts ? (
          <HeartsDisplay
            value={heartsRecovered!}
            label=""
            emphasize={emphasizePrice}
          />
        ) : null}
      </div>
      <div class="product-meta-chips">{chips}</div>
    </div>
  );
}
