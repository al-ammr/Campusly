import * as React from 'react';
import { X } from 'lucide-react';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  triggerRef?: React.RefObject<HTMLElement | null>;
  className?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  triggerRef,
  className = '',
}) => {
  const sheetRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const titleId = React.useId();
  const descId = React.useId();

  // Focus trap and escape listener
  React.useEffect(() => {
    if (!isOpen) return;

    // Save previous active element to restore later if triggerRef is not passed
    const previousActiveElement = document.activeElement as HTMLElement | null;

    // Focus close button on open
    const focusTimeout = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && sheetRef.current) {
        const focusableElements = sheetRef.current.querySelectorAll<HTMLElement>(
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

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const triggerNode = triggerRef?.current;

    return () => {
      clearTimeout(focusTimeout);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;

      // Restore focus to trigger or previous element
      if (triggerNode) {
        triggerNode.focus();
      } else if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[200] flex items-end lg:items-center justify-center p-0 lg:p-4"
    >
      {/* Scrim Overlay */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity z-[200]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet / Dialog Panel */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className={`
          relative z-[201] w-full max-h-[90vh] bg-raised dark:bg-raised-dark
          rounded-t-lg lg:rounded-lg shadow-md border border-border dark:border-border-dark
          flex flex-col overflow-hidden transition-all duration-base
          lg:max-w-lg lg:w-full
          ${className}
        `}
      >
        {/* Mobile Drag Handle */}
        <div className="w-full flex items-center justify-center pt-2.5 pb-1 lg:hidden">
          <div className="w-10 h-1.5 rounded-full bg-border dark:bg-border-dark" />
        </div>

        {/* Header */}
        <div className="px-5 pt-3 pb-3 flex items-start justify-between border-b border-border/50 dark:border-border-dark/50">
          <div className="flex flex-col pr-4">
            <h2
              id={titleId}
              className="text-lg font-bold font-display text-ink dark:text-ink-dark leading-tight"
            >
              {title}
            </h2>
            {description && (
              <p
                id={descId}
                className="text-xs text-ink-muted dark:text-ink-muted-dark mt-0.5"
              >
                {description}
              </p>
            )}
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close sheet"
            className="w-11 h-11 flex items-center justify-center -mr-2 -mt-1 text-ink-muted hover:text-ink dark:text-ink-muted-dark dark:hover:text-ink-dark rounded-full focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="px-5 py-4 overflow-y-auto overscroll-contain flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
