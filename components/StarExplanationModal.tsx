import * as React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Star, ShieldCheck } from 'lucide-react';

export interface StarExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * StarExplanationModal (D09 LEG-211)
 * Explains device-cookie star attribution and one-star-per-device rule.
 */
export const StarExplanationModal: React.FC<StarExplanationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const handleAcknowledge = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('campusly_star_explained', 'true');
      }
    } catch {
      // Storage error fallback
    }
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleAcknowledge}
      title="How Campus Stars Work"
      confirmLabel="Understood"
      onConfirm={handleAcknowledge}
    >
      <div className="space-y-4 py-2 text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-raised dark:bg-surface-raised-dark border border-border/80 dark:border-border-dark/80">
          <Star className="w-5 h-5 text-accent shrink-0 fill-accent" aria-hidden="true" />
          <p className="font-medium text-ink dark:text-ink-dark">
            We use a small device cookie so each device gets one star.
          </p>
        </div>

        <p>
          Stars provide an authentic signal of student interest across Ahmadu Bello University.
          To keep rankings fair, transparent, and spam-resistant:
        </p>

        <ul className="space-y-2 pl-4 list-disc text-xs">
          <li>Each device may star any public organization once.</li>
          <li>Stars cannot be revoked or undone once cast.</li>
          <li>No personal information, email, or account creation is required.</li>
          <li>Device age checks prevent bot farms and automated bursts.</li>
        </ul>

        <div className="flex items-center gap-2 pt-2 text-[11px] text-ink-muted/80 dark:text-ink-muted-dark/80">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
          <span>Compliant with NDPR &amp; Campusly Academic Registry Standards</span>
        </div>
      </div>
    </Dialog>
  );
};
