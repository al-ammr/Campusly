import * as React from 'react';

export interface SwitchProps {
  id?: string;
  label: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  description?: string;
  className?: string;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      id,
      label,
      checked,
      defaultChecked = false,
      onChange,
      disabled = false,
      description,
      className = '',
    },
    ref
  ) => {
    const generatedId = React.useId();
    const switchId = id || generatedId;
    const descId = description ? `${switchId}-desc` : undefined;

    const [isOn, setIsOn] = React.useState<boolean>(
      checked !== undefined ? checked : defaultChecked
    );

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsOn(checked);
      }
    }, [checked]);

    const handleToggle = () => {
      if (disabled) return;
      const next = !isOn;
      if (checked === undefined) {
        setIsOn(next);
      }
      if (onChange) {
        onChange(next);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleToggle();
      }
    };

    const active = checked !== undefined ? checked : isOn;

    return (
      <div
        className={`min-h-[44px] flex items-center justify-between gap-4 py-1 select-none ${className}`}
      >
        <div className="flex flex-col cursor-pointer" onClick={handleToggle}>
          <label
            id={`${switchId}-label`}
            htmlFor={switchId}
            className={`text-sm font-medium text-ink dark:text-ink-dark cursor-pointer ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {label}
          </label>
          {description && (
            <span
              id={descId}
              className="text-xs text-ink-muted dark:text-ink-muted-dark"
            >
              {description}
            </span>
          )}
        </div>

        <button
          ref={ref}
          id={switchId}
          type="button"
          role="switch"
          aria-checked={active}
          aria-labelledby={`${switchId}-label`}
          aria-describedby={descId}
          disabled={disabled}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          className={`
            relative inline-flex items-center h-7 w-12 shrink-0 rounded-full cursor-pointer
            p-0.5 border-2 border-transparent transition-colors duration-fast
            disabled:opacity-50 disabled:cursor-not-allowed
            focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focusRing
            ${active ? 'bg-brand dark:bg-brand-dark' : 'bg-border dark:bg-border-dark'}
          `}
        >
          <span
            className={`
              pointer-events-none inline-block h-5 w-5 rounded-full bg-surface dark:bg-surface-dark
              shadow-sm transform transition duration-fast ease-in-out
              ${active ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>
    );
  }
);

Switch.displayName = 'Switch';
