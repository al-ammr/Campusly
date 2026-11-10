import * as React from 'react';
import { Star } from 'lucide-react';

export interface StarControlProps {
  count: number;
  isStarred?: boolean;
  onStar?: () => Promise<boolean> | boolean | void;
  listingTitle?: string;
  className?: string;
}

export function formatStarCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return String(count);
}

export const StarControl: React.FC<StarControlProps> = ({
  count: initialCount,
  isStarred: initialStarred = false,
  onStar,
  listingTitle = 'listing',
  className = '',
}) => {
  const [starred, setStarred] = React.useState<boolean>(initialStarred);
  const [count, setCount] = React.useState<number>(initialCount);
  const [isPending, setIsPending] = React.useState<boolean>(false);

  React.useEffect(() => {
    setStarred(initialStarred);
    setCount(initialCount);
  }, [initialStarred, initialCount]);

  const handleStar = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // UI-311: No unstar allowed; once starred, not tappable
    if (starred || isPending) return;

    // Optimistic update
    setStarred(true);
    setCount((prev) => prev + 1);
    setIsPending(true);

    try {
      if (onStar) {
        const result = await onStar();
        // If handler explicitly returned false, revert optimistic state
        if (result === false) {
          setStarred(false);
          setCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch {
      // Revert on error
      setStarred(false);
      setCount((prev) => Math.max(0, prev - 1));
    } finally {
      setIsPending(false);
    }
  };

  const formattedDisplay = formatStarCount(count);
  const accessibleLabel = starred
    ? `Starred, ${count} stars total for ${listingTitle}`
    : `Star this community, currently ${count} stars for ${listingTitle}`;

  return (
    <button
      type="button"
      onClick={handleStar}
      disabled={starred || isPending}
      aria-label={accessibleLabel}
      aria-pressed={starred}
      className={`
        min-h-[44px] min-w-[44px] px-2.5 py-1.5 rounded-full inline-flex items-center justify-center gap-1.5
        transition-colors duration-fast select-none
        border border-border dark:border-border-dark bg-surface dark:bg-surface-dark shadow-xs
        ${
          starred
            ? 'cursor-default text-ink dark:text-ink-dark'
            : 'cursor-pointer hover:bg-surface dark:hover:bg-surface-dark text-ink dark:text-ink-dark'
        }
        focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focusRing
        ${className}
      `}
    >
      <Star
        className={`
          w-4 h-4 shrink-0 transition-transform duration-fast
          ${
            starred
              ? 'fill-accent text-accent dark:fill-accent-dark dark:text-accent-dark scale-110'
              : 'text-ink-muted dark:text-ink-muted-dark hover:text-accent'
          }
        `}
        aria-hidden="true"
      />
      <span className="text-xs font-semibold tabular-nums text-ink dark:text-ink-dark">
        {formattedDisplay}
      </span>
    </button>
  );
};
