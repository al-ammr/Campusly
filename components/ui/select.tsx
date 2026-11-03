import * as React from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  isRequired?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      label,
      options,
      placeholder = 'Select an option',
      helperText,
      errorMessage,
      isRequired = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;

    const hasError = Boolean(errorMessage);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        <label
          htmlFor={selectId}
          className="text-sm font-semibold text-ink dark:text-ink-dark cursor-pointer select-none"
        >
          {label}{' '}
          <span className="text-xs font-normal text-ink-muted dark:text-ink-muted-dark">
            ({isRequired ? 'required' : 'optional'})
          </span>
        </label>

        <div className="relative w-full">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            className={`
              w-full h-12 pl-3.5 pr-10 rounded-md text-base appearance-none
              bg-surface dark:bg-surface-dark
              text-ink dark:text-ink-dark
              border transition-colors duration-fast
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                hasError
                  ? 'border-danger dark:border-danger-dark focus-visible:outline-danger'
                  : 'border-border dark:border-border-dark focus-visible:outline-focusRing'
              }
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-ink-muted">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          <ChevronDown
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-ink-muted dark:text-ink-muted-dark"
            aria-hidden="true"
          />
        </div>

        {hasError ? (
          <div
            id={errorId}
            role="alert"
            className="flex items-center gap-1.5 text-xs text-danger dark:text-danger-dark font-medium"
          >
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        ) : helperText ? (
          <p
            id={helperId}
            className="text-xs text-ink-muted dark:text-ink-muted-dark"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
