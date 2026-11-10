import * as React from 'react';
import { Button } from './button';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  consequence?: string; // One-sentence consequence
  description?: string; // Alternative description
  children?: React.ReactNode;
  footer?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  triggerRef?: React.RefObject<HTMLElement | null>;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  consequence,
  description,
  children,
  footer,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
  triggerRef,
  className = '',
}) => {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const safeButtonRef = React.useRef<HTMLButtonElement>(null);
  const titleId = React.useId();
  const descId = React.useId();

  // Focus trap and safe button auto-focus
  React.useEffect(() => {
    if (!isOpen) return;

    const previousActiveElement = document.activeElement as HTMLElement | null;

    // Focus safe action first (D03 requirement)
    const timer = setTimeout(() => {
      safeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const triggerNode = triggerRef?.current;

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;

      if (triggerNode) {
        triggerNode.focus();
      } else if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, onClose, isLoading, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-modal flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={() => {
          if (!isLoading) onClose();
        }}
        aria-hidden="true"
      />

      {/* Confirmation Dialog Panel */}
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={`
          relative z-10 w-full max-w-md bg-raised dark:bg-raised-dark
          rounded-lg shadow-md border border-border dark:border-border-dark
          p-6 flex flex-col gap-4 transition-all duration-fast
          ${className}
        `}
      >
        <div className="flex flex-col gap-1.5 text-left">
          <h2
            id={titleId}
            className="text-lg font-bold font-display text-ink dark:text-ink-dark leading-tight"
          >
            {title}
          </h2>
          {(consequence || description) && (
            <p
              id={descId}
              className="text-sm text-ink-muted dark:text-ink-muted-dark leading-relaxed"
            >
              {consequence || description}
            </p>
          )}
        </div>

        {children}

        {footer ? (
          footer
        ) : onConfirm ? (
          /* Action Buttons: Safe action first and focused by default */
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
            <Button
              ref={safeButtonRef}
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {cancelLabel}
            </Button>

            <Button
              variant={isDestructive ? 'destructive' : 'primary'}
              onClick={onConfirm}
              loading={isLoading}
              className="w-full sm:w-auto"
            >
              {confirmLabel}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
