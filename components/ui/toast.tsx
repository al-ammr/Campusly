'use client';

import * as React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  durationMs?: number;
}

export interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentToast, setCurrentToast] = React.useState<ToastItem | null>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const dismissToast = React.useCallback((id?: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setCurrentToast((prev) => (id ? (prev?.id === id ? null : prev) : null));
  }, []);

  const showToast = React.useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const id = Math.random().toString(36).substring(2, 9);
      const defaultDuration = toast.type === 'error' ? 8000 : 4000;
      const duration = toast.durationMs || defaultDuration;

      const newToast: ToastItem = { ...toast, id };
      setCurrentToast(newToast);

      timerRef.current = setTimeout(() => {
        dismissToast(id);
      }, duration);
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, addToast: showToast, dismissToast }}>
      {children}

      {/* Toast Region - positioned above bottom tab bar */}
      <div
        aria-live="polite"
        className="fixed bottom-20 lg:bottom-6 left-0 right-0 z-toast flex justify-center px-4 pointer-events-none"
      >
        {currentToast && (
          <div
            role={currentToast.type === 'error' ? 'alert' : 'status'}
            className={`
              pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg shadow-lg border
              w-full max-w-md transition-all duration-base
              ${
                currentToast.type === 'error'
                  ? 'bg-raised dark:bg-raised-dark border-danger dark:border-danger-dark text-ink dark:text-ink-dark'
                  : currentToast.type === 'success'
                    ? 'bg-raised dark:bg-raised-dark border-success dark:border-success-dark text-ink dark:text-ink-dark'
                    : 'bg-raised dark:bg-raised-dark border-border dark:border-border-dark text-ink dark:text-ink-dark'
              }
            `}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {currentToast.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-danger dark:text-danger-dark shrink-0" aria-hidden="true" />
              ) : currentToast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-success dark:text-success-dark shrink-0" aria-hidden="true" />
              ) : (
                <Info className="w-5 h-5 text-info dark:text-info-dark shrink-0" aria-hidden="true" />
              )}
              <span className="text-sm font-medium leading-tight">
                {currentToast.message}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {currentToast.action && (
                <button
                  type="button"
                  onClick={() => {
                    currentToast.action?.onClick();
                    dismissToast(currentToast.id);
                  }}
                  className="px-2.5 py-1 text-xs font-bold text-brand dark:text-brand-dark hover:underline rounded focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing"
                >
                  {currentToast.action.label}
                </button>
              )}

              <button
                type="button"
                onClick={() => dismissToast(currentToast.id)}
                aria-label="Dismiss message"
                className="w-10 h-10 flex items-center justify-center text-ink-muted hover:text-ink dark:text-ink-muted-dark dark:hover:text-ink-dark rounded-full focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
};
