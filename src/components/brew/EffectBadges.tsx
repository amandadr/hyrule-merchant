import type { ComponentChildren } from 'preact';

type StrengthBand = 'weak' | 'mid' | 'strong';
type DurationBand = 'short' | 'mid' | 'long';

const EFFECT_CLASS: Record<string, string> = {
  hearts: 'effect-hearts',
  'stamina recovery': 'effect-stamina',
  'speed up': 'effect-speed',
  'cold resistance': 'effect-cold',
  'heat resistance': 'effect-heat',
  'stealth up': 'effect-stealth',
  'attack up': 'effect-attack',
  'defense up': 'effect-defense',
  'shock resistance': 'effect-shock',
  variable: 'effect-variable',
  none: 'effect-none',
};

function effectClass(family: string): string {
  return EFFECT_CLASS[family.toLowerCase()] ?? 'effect-variable';
}

function HeartIcon({
  filled,
  size = 16,
}: {
  filled: 'full' | 'half' | 'empty';
  size?: number;
}) {
  return (
    <svg
      class={`effect-heart effect-heart-${filled}`}
      viewBox="0 0 16 16"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path
        class="effect-heart-outline"
        d="M8 14.2 6.7 13C3.4 10 1.3 8.1 1.3 5.7 1.3 3.7 2.8 2.2 4.8 2.2c1.1 0 2.2.5 2.9 1.4C8.4 2.7 9.5 2.2 10.6 2.2c2 0 3.5 1.5 3.5 3.5 0 2.4-2.1 4.3-5.4 7.3L8 14.2z"
      />
      {filled === 'full' ? (
        <path
          class="effect-heart-fill"
          d="M8 14.2 6.7 13C3.4 10 1.3 8.1 1.3 5.7 1.3 3.7 2.8 2.2 4.8 2.2c1.1 0 2.2.5 2.9 1.4C8.4 2.7 9.5 2.2 10.6 2.2c2 0 3.5 1.5 3.5 3.5 0 2.4-2.1 4.3-5.4 7.3L8 14.2z"
        />
      ) : null}
      {filled === 'half' ? (
        <path
          class="effect-heart-fill effect-heart-half"
          d="M8 14.2 6.7 13C3.4 10 1.3 8.1 1.3 5.7 1.3 3.7 2.8 2.2 4.8 2.2c1.1 0 2.2.5 2.9 1.4C8.4 2.7 9.5 2.2 10.6 2.2c2 0 3.5 1.5 3.5 3.5 0 2.4-2.1 4.3-5.4 7.3L8 14.2z"
        />
      ) : null}
    </svg>
  );
}

export function HeartsDisplay({
  value,
  label = 'Hearts',
  emphasize = false,
}: {
  value: number;
  label?: string;
  emphasize?: boolean;
}) {
  const clamped = Math.max(0, Math.min(value, 10));
  const full = Math.floor(clamped);
  const half = clamped - full >= 0.25;
  const iconSize = emphasize ? 20 : 16;
  const icons: ComponentChildren[] = [];
  for (let i = 0; i < full; i++) {
    icons.push(<HeartIcon key={`f-${i}`} filled="full" size={iconSize} />);
  }
  if (half) icons.push(<HeartIcon key="half" filled="half" size={iconSize} />);
  if (icons.length === 0) {
    icons.push(<HeartIcon key="empty" filled="empty" size={iconSize} />);
  }

  return (
    <span
      class={`effect-meter${emphasize ? ' effect-meter-emphasis' : ''}`}
      title={`${value} hearts`}
    >
      {label ? <span class="effect-meter-label muted">{label}</span> : null}
      <span class="effect-hearts-row" aria-label={`${value} hearts`}>
        {icons}
      </span>
    </span>
  );
}

function ClockIcon({ band }: { band: DurationBand }) {
  const fill = band === 'short' ? 0.25 : band === 'mid' ? 0.55 : 0.92;
  const angle = Math.round(fill * 360);

  return (
    <span
      class={`effect-clock effect-clock-${band}`}
      style={{ '--clock-angle': `${angle}deg` }}
      aria-hidden="true"
    >
      <span class="effect-clock-face" />
      <span class="effect-clock-hand" />
    </span>
  );
}

function StrengthBars({ band }: { band: StrengthBand }) {
  const level = band === 'weak' ? 1 : band === 'mid' ? 2 : 3;
  return (
    <span
      class={`effect-strength effect-strength-${band}`}
      aria-hidden="true"
    >
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          class={`effect-strength-bar${n <= level ? ' is-on' : ''}`}
        />
      ))}
    </span>
  );
}

function EffectGlyph({ family }: { family: string }) {
  const key = family.toLowerCase();
  // Simple geometric glyphs — CSS colors the chip
  if (key.includes('cold')) {
    return (
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path
          d="M8 1v14M1 8h14M3.5 3.5l9 9M12.5 3.5l-9 9"
          stroke="currentColor"
          stroke-width="1.4"
          fill="none"
        />
      </svg>
    );
  }
  if (key.includes('heat')) {
    return (
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <circle cx="8" cy="8" r="3" fill="currentColor" />
        <path
          d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6 13 13M13 3l-1.4 1.4M3 13l1.4-1.4"
          stroke="currentColor"
          stroke-width="1.4"
          fill="none"
        />
      </svg>
    );
  }
  if (key.includes('speed') || key.includes('swift')) {
    return (
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path
          d="M2 5h7l2-2h3M2 8h10M2 11h6l2 2h4"
          stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          stroke-linecap="round"
        />
      </svg>
    );
  }
  if (key.includes('stealth') || key.includes('silent')) {
    return (
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path
          d="M2 8c2-3 4.5-4.5 6-4.5S12 5 14 8c-2 3-4.5 4.5-6 4.5S4 11 2 8z"
          stroke="currentColor"
          stroke-width="1.3"
          fill="none"
        />
        <circle cx="8" cy="8" r="1.6" fill="currentColor" />
      </svg>
    );
  }
  if (key.includes('attack') || key.includes('mighty')) {
    return (
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path
          d="M10 2l4 4-7 7H3v-4l7-7zM3 13l2-2"
          stroke="currentColor"
          stroke-width="1.3"
          fill="none"
        />
      </svg>
    );
  }
  if (key.includes('defense') || key.includes('tough')) {
    return (
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path
          d="M8 2 13 4v4c0 3.2-2.2 5.5-5 6.5C5.2 13.5 3 11.2 3 8V4l5-2z"
          stroke="currentColor"
          stroke-width="1.3"
          fill="none"
        />
      </svg>
    );
  }
  if (key.includes('stamina') || key.includes('endura')) {
    return (
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path
          d="M9 1 4 9h4l-1 6 5-8H8l1-6z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (key.includes('shock') || key.includes('electric')) {
    return (
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path d="M9 1 4 9h4l-1 6 5-8H8l1-6z" fill="currentColor" />
      </svg>
    );
  }
  if (key === 'hearts') {
    return (
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path
          fill="currentColor"
          d="M8 14.2 6.7 13C3.4 10 1.3 8.1 1.3 5.7 1.3 3.7 2.8 2.2 4.8 2.2c1.1 0 2.2.5 2.9 1.4C8.4 2.7 9.5 2.2 10.6 2.2c2 0 3.5 1.5 3.5 3.5 0 2.4-2.1 4.3-5.4 7.3L8 14.2z"
        />
      </svg>
    );
  }
  if (key === 'none') {
    return (
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.3" fill="none" />
        <path d="M5 5l6 6M11 5l-6 6" stroke="currentColor" stroke-width="1.3" />
      </svg>
    );
  }
  // variable / unknown
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        d="M4 8c0-2 1.5-3.5 4-3.5S12 5.5 12 7.5 10 10 8 10s-2 .7-2 2 .8 2 2 2 2-.5 2-1"
        stroke="currentColor"
        stroke-width="1.4"
        fill="none"
        stroke-linecap="round"
      />
      <circle cx="8" cy="14" r="0.9" fill="currentColor" />
    </svg>
  );
}

function titleCaseLabel(value: string): string {
  return value
    .replace(/_/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export function EffectFamilyChip({ family }: { family: string }) {
  return (
    <span class={`effect-chip ${effectClass(family)}`}>
      <EffectGlyph family={family} />
      <span>{titleCaseLabel(family)}</span>
    </span>
  );
}

export function DurationMeter({ band }: { band: DurationBand }) {
  const label = band === 'short' ? 'Short' : band === 'mid' ? 'Medium' : 'Long';
  return (
    <span class="effect-meter" title={`Duration: ${band}`}>
      <span class="effect-meter-label muted">Duration</span>
      <span class="effect-meter-value">
        <ClockIcon band={band} />
        <span>{label}</span>
      </span>
    </span>
  );
}

export function StrengthMeter({ band }: { band: StrengthBand }) {
  const label = band === 'weak' ? 'Weak' : band === 'mid' ? 'Mid' : 'Strong';
  return (
    <span class="effect-meter" title={`Strength: ${band}`}>
      <span class="effect-meter-label muted">Strength</span>
      <span class="effect-meter-value">
        <StrengthBars band={band} />
        <span>{label}</span>
      </span>
    </span>
  );
}

export function BrewEffectSummary({
  effectFamily,
  strengthBand,
  durationBand,
  heartsEstimate,
}: {
  effectFamily: string;
  strengthBand?: StrengthBand;
  durationBand?: DurationBand;
  heartsEstimate?: number;
}) {
  return (
    <div class="effect-summary">
      <EffectFamilyChip family={effectFamily} />
      {strengthBand ? <StrengthMeter band={strengthBand} /> : null}
      {durationBand ? <DurationMeter band={durationBand} /> : null}
      {heartsEstimate != null && heartsEstimate > 0 ? (
        <HeartsDisplay value={heartsEstimate} />
      ) : null}
    </div>
  );
}
