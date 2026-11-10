'use client';

import * as React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Radio } from '@/components/ui/radio';
import { useToast } from '@/components/ui/toast';
import { VALID_REPORT_REASONS, ReportReason } from '@/lib/constants/reports';

export interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
  isSpotlight?: boolean;
}

const REASON_LABELS: Record<ReportReason, string> = {
  wrong_info: 'Incorrect or misleading information',
  inappropriate: 'Inappropriate or harmful content',
  spam: 'Spam, advertising, or duplicate',
  scam: 'Scam, impersonation, or financial fraud',
  other: 'Other issue',
};

export const ReportDialog: React.FC<ReportDialogProps> = ({
  isOpen,
  onClose,
  listingId,
  listingTitle,
  isSpotlight = false,
}) => {
  const { addToast } = useToast();
  const [reason, setReason] = React.useState<ReportReason>('wrong_info');
  const [note, setNote] = React.useState('');
  const [honeypot, setHoneypot] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const endpoint = isSpotlight
        ? `/api/v1/spotlight/${listingId}/report`
        : `/api/v1/listings/${listingId}/report`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-campusly-action': '1',
        },
        body: JSON.stringify({
          reason,
          note: note.trim() || undefined,
          honeypot,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit report');
      }

      addToast({
        type: 'success',
        message: 'Thank you. Our moderation team has received your report.',
      });

      onClose();
      setNote('');
      setReason('wrong_info');
    } catch {
      addToast({
        type: 'error',
        message: 'Unable to submit report right now. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Report Listing"
      description={`Help keep Campusly safe and accurate for ABU Zaria. Tell us what is wrong with "${listingTitle}".`}
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            loading={isSubmitting}
            loadingText="Submitting..."
          >
            Submit Report
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot field (hidden from genuine users) */}
        <div aria-hidden="true" style={{ display: 'none' }}>
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-light mb-2">
            Reason for reporting
          </label>
          <div className="space-y-2">
            {VALID_REPORT_REASONS.map((r) => (
              <Radio
                key={r}
                name="report_reason"
                value={r}
                label={REASON_LABELS[r]}
                checked={reason === r}
                onChange={() => setReason(r)}
              />
            ))}
          </div>
        </div>

        <div>
          <Textarea
            label="Additional details (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Please provide any helpful context (max 300 characters)..."
            maxLength={300}
            rows={3}
          />
        </div>
      </form>
    </Dialog>
  );
};
