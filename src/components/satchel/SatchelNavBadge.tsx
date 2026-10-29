import { useStore } from '@nanostores/preact';
import { satchelCount, satchelItems } from '@/stores/satchel';

/** Live quantity badge for the My Satchel nav link. */
export default function SatchelNavBadge() {
  const items = useStore(satchelItems);
  const count = satchelCount(items);

  if (count <= 0) {
    return null;
  }

  return (
    <span class="satchel-nav-badge" aria-label={`${count} items in satchel`}>
      {count > 99 ? '99+' : count}
    </span>
  );
}
