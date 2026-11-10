'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ReportDialog } from '@/components/ui/report-dialog';
import { useToast } from '@/components/ui/toast';
import { Share2, Flag, Check } from 'lucide-react';

export interface SpotlightActionsProps {
  id: string;
  businessName: string;
  offer: string;
  className?: string;
}

export const SpotlightActions: React.FC<SpotlightActionsProps> = ({
  id,
  businessName,
  offer,
  className = '',
}) => {
  const { addToast } = useToast();
  const [isReportOpen, setIsReportOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleShare = async () => {
    const shareData = {
      title: `${businessName} | Campusly Spotlight`,
      text: offer,
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

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      addToast({
        type: 'success',
        message: 'Spotlight link copied to clipboard!',
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
    <div className={`flex items-center gap-3 ${className}`}>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleShare}
        className="flex items-center gap-1.5 h-10"
        aria-label={`Share ${businessName}`}
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

      <Button
        variant="tertiary"
        size="sm"
        onClick={() => setIsReportOpen(true)}
        className="flex items-center gap-1.5 h-10 text-xs text-ink-muted hover:text-danger"
        aria-label={`Report ${businessName}`}
      >
        <Flag className="w-3.5 h-3.5" />
        <span>Report</span>
      </Button>

      <ReportDialog
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        listingId={id}
        listingTitle={businessName}
        isSpotlight={true}
      />
    </div>
  );
};
