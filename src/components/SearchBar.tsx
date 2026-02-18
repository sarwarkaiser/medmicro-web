import { useState, useRef, useEffect } from 'react';
import { Search, X, Command } from 'lucide-react';
import { cn } from '../utils/classNames';

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value: controlledValue,
  onChange,
  placeholder = 'Search medications, guidelines, DSM-5...',
  className,
  autoFocus,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const clearSearch = () => {
    handleChange('');
    inputRef.current?.focus();
  };

  // Keyboard shortcut: Cmd/Ctrl + K to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && isFocused) {
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused]);

  return (
    <div
      className={cn(
        'relative flex items-center',
        isFocused && 'z-50',
        className
      )}
    >
      <div
        className={cn(
          'relative flex items-center w-full transition-all duration-200',
          isFocused && 'scale-[1.02]'
        )}
      >
        <Search
          className={cn(
            'absolute left-3 w-5 h-5 transition-colors',
            isFocused
              ? 'text-sky-500'
              : 'text-slate-400 dark:text-slate-500'
          )}
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            'w-full pl-10 pr-20 py-2.5',
            'bg-slate-100 dark:bg-slate-800',
            'border border-transparent',
            'rounded-xl',
            'text-slate-900 dark:text-slate-100',
            'placeholder:text-slate-400 dark:placeholder:text-slate-500',
            'focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500',
            'transition-all duration-200'
          )}
        />
        <div className="absolute right-2 flex items-center gap-1">
          {value && (
            <button
              onClick={clearSearch}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-1 text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-200 dark:bg-slate-700 rounded-md">
            <Command className="w-3 h-3" />
            <span>K</span>
          </kbd>
        </div>
      </div>
    </div>
  );
}

interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  count?: number;
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'red' | 'cyan';
}

export function FilterChip({
  label,
  active,
  onClick,
  count,
  color = 'blue',
}: FilterChipProps) {
  const colorClasses = {
    blue: active
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800'
      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700',
    green: active
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800'
      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700',
    purple: active
      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800'
      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700',
    amber: active
      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800'
      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700',
    red: active
      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800'
      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700',
    cyan: active
      ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800'
      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200',
        colorClasses[color],
        active && 'shadow-sm'
      )}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={cn(
            'text-xs px-1.5 py-0.5 rounded-full',
            active
              ? 'bg-white/50 dark:bg-black/20'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
