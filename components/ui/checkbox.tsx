import * as React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  helperText?: string;
  errorMessage?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      label,
      helperText,
      errorMessage,
      className = '',
      disabled,
      checked,
      defaultChecked,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;
    const helperId = `${checkboxId}-helper`;
    const errorId = `${checkboxId}-error`;

    const [isChecked, setIsChecked] = React.useState<boolean>(
      checked !== undefined ? Boolean(checked) : Boolean(defaultChecked)
    );

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(Boolean(checked));
      }
    }, [checked]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (checked === undefined) {
        setIsChecked(e.target.checked);
      }
      if (onChange) {
        onChange(e);
      }
    };

    const hasError = Boolean(errorMessage);

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={checkboxId}
          className={`
            min-h-[44px] inline-flex items-center gap-3 cursor-pointer select-none
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}
          `}
        >
          <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              checked={checked !== undefined ? checked : isChecked}
              disabled={disabled}
              onChange={handleChange}
              aria-invalid={hasError ? 'true' : 'false'}
              aria-describedby={
                hasError ? errorId : helperText ? helperId : undefined
              }
              className="peer sr-only"
              {...props}
            />
            {/* Visual checkbox box (24px) */}
            <div
              className={`
                w-6 h-6 rounded border transition-colors duration-fast flex items-center justify-center
                peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focusRing
                ${
                  isChecked
                    ? 'bg-brand dark:bg-brand-dark border-brand dark:border-brand-dark text-surface dark:text-ink'
                    : hasError
                      ? 'bg-surface dark:bg-surface-dark border-danger dark:border-danger-dark'
                      : 'bg-surface dark:bg-surface-dark border-border dark:border-border-dark'
                }
              `}
            >
              {isChecked && <Check className="w-4 h-4 stroke-[3]" aria-hidden="true" />}
            </div>
          </div>

          <span className="text-sm font-medium text-ink dark:text-ink-dark leading-snug">
            {label}
          </span>
        </label>

        {hasError ? (
          <p
            id={errorId}
            role="alert"
            className="text-xs text-danger dark:text-danger-dark font-medium pl-9"
          >
            {errorMessage}
          </p>
        ) : helperText ? (
          <p
            id={helperId}
            className="text-xs text-ink-muted dark:text-ink-muted-dark pl-9"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
