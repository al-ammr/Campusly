'use client';

import React, { useId } from 'react';
import { clsx } from 'clsx';
import { AlertCircle } from 'lucide-react';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
  errorMessage?: string;
  isRequired?: boolean;
  requiredIndicator?: 'required' | 'optional' | 'none';
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      helperText,
      error,
      errorMessage,
      isRequired,
      requiredIndicator = 'none',
      id: customId,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;
    const activeError = error || errorMessage;
    const showRequired = isRequired || requiredIndicator === 'required' || props.required;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="text-[13px] font-semibold text-ink select-none">
            {label}
          </label>
          {showRequired ? (
            <span className="text-[11px] font-medium text-ink-muted">(required)</span>
          ) : requiredIndicator === 'optional' ? (
            <span className="text-[11px] font-medium text-ink-muted">(optional)</span>
          ) : null}
        </div>

        <input
          ref={ref}
          id={id}
          disabled={disabled}
          required={showRequired}
          aria-invalid={activeError ? 'true' : 'false'}
          aria-describedby={activeError ? errorId : helperText ? helperId : undefined}
          className={clsx(
            'h-12 w-full px-4 rounded-sm text-[16px] text-ink bg-surface border transition-colors outline-none',
            'placeholder:text-ink-muted placeholder:opacity-60',
            'focus-visible:outline focus-visible:outline-3 focus-visible:outline-focusRing focus-visible:outline-offset-1',
            activeError
              ? 'border-danger focus-visible:outline-danger'
              : 'border-border focus:border-brand',
            disabled && 'cursor-not-allowed opacity-50 bg-surface-container',
            className
          )}
          {...props}
        />

        {activeError ? (
          <p id={errorId} className="flex items-center gap-1.5 text-[12px] font-medium text-danger mt-0.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{activeError}</span>
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-[12px] text-ink-muted mt-0.5">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

TextField.displayName = 'TextField';
