import * as React from 'react';

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  hint?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  className?: string;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      name,
      label,
      options,
      value,
      defaultValue,
      onChange,
      helperText,
      errorMessage,
      disabled = false,
      className = '',
    },
    ref
  ) => {
    const generatedId = React.useId();
    const groupId = label ? `${generatedId}-group` : undefined;
    const helperId = `${generatedId}-helper`;
    const errorId = `${generatedId}-error`;

    const [selectedValue, setSelectedValue] = React.useState<string>(
      value !== undefined ? value : defaultValue || ''
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    const handleChange = (val: string) => {
      if (value === undefined) {
        setSelectedValue(val);
      }
      if (onChange) {
        onChange(val);
      }
    };

    const hasError = Boolean(errorMessage);

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-labelledby={groupId}
        aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
        className={`flex flex-col gap-2 text-left ${className}`}
      >
        {label && (
          <span
            id={groupId}
            className="text-sm font-semibold text-ink dark:text-ink-dark select-none"
          >
            {label}
          </span>
        )}

        <div className="flex flex-col gap-1">
          {options.map((opt) => {
            const isChecked = selectedValue === opt.value;
            const isDisabled = disabled || opt.disabled;
            const inputId = `${name}-${opt.value}`;

            return (
              <label
                key={opt.value}
                htmlFor={inputId}
                className={`
                  min-h-[44px] inline-flex items-center gap-3 cursor-pointer select-none py-1
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
                  <input
                    type="radio"
                    id={inputId}
                    name={name}
                    value={opt.value}
                    checked={isChecked}
                    disabled={isDisabled}
                    onChange={() => handleChange(opt.value)}
                    className="peer sr-only"
                  />
                  {/* Outer circle (24px) */}
                  <div
                    className={`
                      w-6 h-6 rounded-full border transition-colors duration-fast flex items-center justify-center
                      peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focusRing
                      ${
                        isChecked
                          ? 'border-brand dark:border-brand-dark'
                          : hasError
                            ? 'border-danger dark:border-danger-dark'
                            : 'border-border dark:border-border-dark'
                      }
                      bg-surface dark:bg-surface-dark
                    `}
                  >
                    {/* Inner dot */}
                    {isChecked && (
                      <div className="w-3 h-3 rounded-full bg-brand dark:bg-brand-dark" />
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-ink dark:text-ink-dark leading-snug">
                    {opt.label}
                  </span>
                  {opt.hint && (
                    <span className="text-xs text-ink-muted dark:text-ink-muted-dark">
                      {opt.hint}
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </div>

        {hasError ? (
          <p
            id={errorId}
            role="alert"
            className="text-xs text-danger dark:text-danger-dark font-medium"
          >
            {errorMessage}
          </p>
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

RadioGroup.displayName = 'RadioGroup';
