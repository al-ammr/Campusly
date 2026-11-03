import * as React from 'react';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helperText?: string;
  errorMessage?: string;
  isRequired?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id,
      label,
      helperText,
      errorMessage,
      isRequired = false,
      maxLength,
      showCharacterCount = false,
      className = '',
      value,
      defaultValue,
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const helperId = `${textareaId}-helper`;
    const errorId = `${textareaId}-error`;
    const counterId = `${textareaId}-counter`;

    const [charLength, setCharLength] = React.useState<number>(() => {
      if (typeof value === 'string') return value.length;
      if (typeof defaultValue === 'string') return defaultValue.length;
      return 0;
    });

    React.useEffect(() => {
      if (typeof value === 'string') {
        setCharLength(value.length);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharLength(e.target.value.length);
      if (onChange) {
        onChange(e);
      }
    };

    const hasError = Boolean(errorMessage);
    const remainingChars = maxLength !== undefined ? maxLength - charLength : undefined;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        <div className="flex items-center justify-between">
          <label
            htmlFor={textareaId}
            className="text-sm font-semibold text-ink dark:text-ink-dark cursor-pointer select-none"
          >
            {label}{' '}
            <span className="text-xs font-normal text-ink-muted dark:text-ink-muted-dark">
              ({isRequired ? 'required' : 'optional'})
            </span>
          </label>
          {showCharacterCount && maxLength !== undefined && (
            <span
              id={counterId}
              aria-live="polite"
              className="text-xs font-normal tabular-nums text-ink-muted dark:text-ink-muted-dark"
            >
              {remainingChars} characters remaining
            </span>
          )}
        </div>

        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={
            hasError
              ? errorId
              : helperText
                ? helperId
                : showCharacterCount && maxLength !== undefined
                  ? counterId
                  : undefined
          }
          className={`
            w-full min-h-[120px] px-3.5 py-3 rounded-md text-base
            bg-surface dark:bg-surface-dark
            text-ink dark:text-ink-dark
            placeholder:text-ink-muted/60 dark:placeholder:text-ink-muted-dark/60
            border transition-colors duration-fast
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-y
            ${
              hasError
                ? 'border-danger dark:border-danger-dark focus-visible:outline-danger'
                : 'border-border dark:border-border-dark focus-visible:outline-focusRing'
            }
            ${className}
          `}
          {...props}
        />

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

Textarea.displayName = 'Textarea';
