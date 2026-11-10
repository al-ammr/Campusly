'use client';

import * as React from 'react';
import { StarControl } from '@/components/ui/star-control';
import { Button } from '@/components/ui/button';
import { ReportDialog } from '@/components/ui/report-dialog';
import { useToast } from '@/components/ui/toast';
import { Share2, Flag, Calendar, Check, Copy, HelpCircle } from 'lucide-react';
import { StarExplanationModal } from '@/components/StarExplanationModal';

export interface ListingActionsProps {
  id: string;
  kind: 'community' | 'event' | 'opportunity';
  title: string;
  summary: string;
  starCount?: number;
  initialStarred?: boolean;
  icsUrl?: string;
  className?: string;
}

export const ListingActions: React.FC<ListingActionsProps> = ({
  id,
  kind,
  title,
  summary,
  starCount = 0,
  initialStarred = false,
  icsUrl,
  className = '',
}) => {
  const { addToast } = useToast();
  const [isReportOpen, setIsReportOpen] = React.useState(false);
  const [isStarExplOpen, setIsStarExplOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Star action handler (D06 API-206)
  const handleStar = async (): Promise<boolean> => {
    // D09 LEG-211: Show explanation at first use if not already acknowledged
    try {
      if (typeof window !== 'undefined' && !localStorage.getItem('campusly_star_explained')) {
        setIsStarExplOpen(true);
      }
    } catch {
      // Ignore storage errors
    }
    try {
      const res = await fetch(`/api/v1/listings/${id}/star`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-campusly-action': '1',
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (errorData.error?.code === 'rate_limited') {
          addToast({
            type: 'error',
            message: 'Daily star limit reached. Thank you for supporting communities!',
          });
          return false;
        }
        if (errorData.error?.code === 'device_too_new') {
          addToast({
            type: 'error',
            message: 'New devices cannot star immediately to prevent spam. Please check back later.',
          });
          return false;
        }
        return false;
      }

      addToast({
        type: 'success',
        message: `Starred "${title}". Thank you!`,
      });
      return true;
    } catch {
      addToast({
        type: 'error',
        message: 'Could not cast star. Please check your connection.',
      });
      return false;
    }
  };

  // Native share with clipboard fallback (D04 SHR-01)
  const handleShare = async () => {
    const shareData = {
      title: `${title} | Campusly ABU Zaria`,
      text: summary,
      url: window.location.href,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    // Fallback: Copy link
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      addToast({
        type: 'success',
        message: 'Link copied to clipboard!',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast({
        type: 'error',
        message: 'Failed to copy link.',
      });
    }
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center gap-3 flex-wrap">
        {/* Community Star Control (API-206, D07 BR-200) */}
        {kind === 'community' && (
          <div className="flex items-center gap-2">
            <StarControl
              count={starCount}
              isStarred={initialStarred}
              onStar={handleStar}
              listingTitle={title}
            />
          </div>
        )}

        {/* Add to Calendar (.ics) for Events (API-110) */}
        {kind === 'event' && icsUrl && (
          <a
            href={icsUrl}
            download
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-md text-xs font-semibold bg-sand-light dark:bg-sand-light-dark text-ink dark:text-ink-dark border border-sand-dark dark:border-sand-dark-dark hover:bg-sand-dark/50 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-cypress-green dark:text-cypress-green-dark" />
            <span>Add to Calendar</span>
          </a>
        )}

        {/* Share Button (Native / Copy fallback) */}
        <Button
          variant="secondary"
          size="sm"
          onClick={handleShare}
          className="flex items-center gap-1.5 h-10"
          aria-label={`Share ${title}`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-success" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </>
          )}
        </Button>

        {/* Report Button (D06 API-207, D07 BR-040) */}
        <Button
          variant="tertiary"
          size="sm"
          onClick={() => setIsReportOpen(true)}
          className="flex items-center gap-1.5 h-10 text-xs text-ink-muted hover:text-danger"
          aria-label={`Report ${title}`}
        >
          <Flag className="w-3.5 h-3.5" />
          <span>Report</span>
        </Button>
      </div>

      {/* Star Explanation notice per D09 LEG-211 */}
      {kind === 'community' && (
        <div className="flex items-center gap-1.5 text-[11px] text-ink-muted dark:text-ink-muted-dark">
          <span>We use a small device cookie so each device gets one star.</span>
          <button
            type="button"
            onClick={() => setIsStarExplOpen(true)}
            className="inline-flex items-center text-accent hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded cursor-pointer"
            aria-label="Learn how stars work"
          >
            <HelpCircle className="w-3 h-3 ml-0.5" aria-hidden="true" />
            <span className="ml-1">Learn more</span>
          </button>
        </div>
      )}

      {/* Star Explanation Modal (D09 LEG-211) */}
      <StarExplanationModal
        isOpen={isStarExplOpen}
        onClose={() => setIsStarExplOpen(false)}
      />

      {/* Report Modal */}
      <ReportDialog
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        listingId={id}
        listingTitle={title}
        isSpotlight={false}
      />
    </div>
  );
};
