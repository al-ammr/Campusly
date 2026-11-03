import * as React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchSuggestion {
  id: string;
  label: string;
  category?: string;
}

export interface SearchFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  onSearchChange?: (value: string) => void;
  onSelectSuggestion?: (suggestion: SearchSuggestion) => void;
  onSubmitSearch?: (value: string) => void;
  debounceMs?: number;
}

export const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  (
    {
      id,
      label = 'Search',
      placeholder = 'Search communities, events, opportunities...',
      suggestions = [],
      onSearchChange,
      onSelectSuggestion,
      onSubmitSearch,
      debounceMs = 250,
      value: controlledValue,
      defaultValue,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const searchId = id || generatedId;
    const suggestionsId = `${searchId}-suggestions`;

    const [query, setQuery] = React.useState<string>(
      controlledValue !== undefined
        ? String(controlledValue)
        : String(defaultValue || '')
    );
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1);

    const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (controlledValue !== undefined) {
        setQuery(String(controlledValue));
      }
    }, [controlledValue]);

    // Handle outside clicks to close suggestions
    React.useEffect(() => {
      const handleOutsideClick = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const triggerDebouncedChange = (val: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        onSearchChange?.(val);
      }, debounceMs);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);
      setIsOpen(true);
      setHighlightedIndex(-1);
      triggerDebouncedChange(val);
    };

    const handleClear = () => {
      setQuery('');
      setIsOpen(false);
      setHighlightedIndex(-1);
      onSearchChange?.('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || suggestions.length === 0) {
        if (e.key === 'Enter') {
          e.preventDefault();
          onSubmitSearch?.(query);
        }
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          const item = suggestions[highlightedIndex];
          onSelectSuggestion?.(item);
          setQuery(item.label);
          setIsOpen(false);
        } else {
          onSubmitSearch?.(query);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const hasSuggestions = isOpen && suggestions.length > 0;

    return (
      <div ref={containerRef} className={`relative w-full text-left ${className}`}>
        <label htmlFor={searchId} className="sr-only">
          {label}
        </label>

        <div className="relative flex items-center w-full">
          {/* Search Icon */}
          <Search
            className="absolute left-3.5 w-5 h-5 text-ink-muted dark:text-ink-muted-dark pointer-events-none"
            aria-hidden="true"
          />

          <input
            ref={ref}
            id={searchId}
            type="search"
            value={query}
            onChange={handleChange}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            role="combobox"
            aria-expanded={hasSuggestions}
            aria-autocomplete="list"
            aria-controls={hasSuggestions ? suggestionsId : undefined}
            className={`
              w-full h-12 pl-11 pr-11 rounded-md text-base
              bg-surface dark:bg-surface-dark
              text-ink dark:text-ink-dark
              placeholder:text-ink-muted/60 dark:placeholder:text-ink-muted-dark/60
              border border-border dark:border-border-dark
              transition-colors duration-fast
              disabled:opacity-50 disabled:cursor-not-allowed
              focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focusRing
            `}
            {...props}
          />

          {/* Clear button */}
          {query.length > 0 && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search input"
              className="absolute right-2 w-8 h-8 flex items-center justify-center text-ink-muted hover:text-ink dark:text-ink-muted-dark dark:hover:text-ink-dark rounded focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focusRing"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {hasSuggestions && (
          <ul
            id={suggestionsId}
            role="listbox"
            className="absolute z-dropdown left-0 right-0 mt-1 py-1.5 rounded-md shadow-md bg-raised dark:bg-raised-dark border border-border dark:border-border-dark overflow-hidden max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, idx) => {
              const isSelected = idx === highlightedIndex;
              return (
                <li
                  key={suggestion.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onSelectSuggestion?.(suggestion);
                    setQuery(suggestion.label);
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`
                    px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between
                    ${
                      isSelected
                        ? 'bg-brand/10 text-brand dark:text-brand-dark font-medium'
                        : 'text-ink dark:text-ink-dark hover:bg-stone/50 dark:hover:bg-stone-dark/50'
                    }
                  `}
                >
                  <span>{suggestion.label}</span>
                  {suggestion.category && (
                    <span className="text-xs text-ink-muted dark:text-ink-muted-dark">
                      {suggestion.category}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
);

SearchField.displayName = 'SearchField';
