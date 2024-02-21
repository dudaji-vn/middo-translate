'use client';

import {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { SearchIcon, XCircleIcon } from 'lucide-react';

import { cn } from '@/utils/cn';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { useShortcutListenStore } from '@/stores/shortcut-listen.store';
import { set } from 'react-hook-form';

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  loading?: boolean;
  btnDisabled?: boolean;
  onClear?: () => void;
}

export interface SearchInputRef extends HTMLInputElement {
  reset: () => void;
}
const SHORTCUT_FOCUS_SEARCH = ['shift', 'f'];
export const SearchInput = forwardRef<SearchInputRef, SearchInputProps>(
  ({ btnDisabled, defaultValue, onClear, ...props }, ref) => {
    const [value, setValue] = useState(defaultValue || '');
    const inputRef = useRef<HTMLInputElement>(null);
    const handleClear = useCallback(() => {
      setValue('');
      onClear?.();
    }, [onClear]);
    const canClear = value !== '';
    const { setAllowShortcutListener } = useShortcutListenStore();
    useKeyboardShortcut([SHORTCUT_FOCUS_SEARCH], (e) => {
      setAllowShortcutListener(false);
      e?.preventDefault();
      inputRef.current?.focus();
    });
    useImperativeHandle(
      ref,
      () => ({
        ...(inputRef.current as HTMLInputElement),
        reset: () => {
          setValue('');
        },
      }),
      [],
    );

    return (
      <div className="relative w-full overflow-hidden rounded-full border bg-background transition-all">
        <div className="flex h-11 pl-3 transition-all">
          <input
            value={value}
            ref={inputRef}
            onBlur={() => setAllowShortcutListener(true)}
            type="text"
            {...props}
            onChange={(e) => {
              props.onChange?.(e);
              setValue(e.target.value);
            }}
            className={`w-full border-0 bg-inherit p-2 ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent ${props.className}`}
          />
          {canClear ? (
            <button
              onClick={handleClear}
              className={
                'flex aspect-square h-full items-center justify-center p-2  disabled:text-text'
              }
            >
              <XCircleIcon className="h-5 w-5 opacity-60" />
            </button>
          ) : (
            <div className="flex h-11 w-11 items-center bg-inherit">
              <SearchButton disabled />
            </div>
          )}
        </div>
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';

export interface SearchButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SearchButton = forwardRef<HTMLButtonElement, SearchButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'flex aspect-square h-full items-center justify-center p-2 text-primary disabled:text-text',
          className,
        )}
        {...props}
      >
        <SearchIcon className="h-5 w-5 opacity-60" />
      </button>
    );
  },
);

SearchButton.displayName = 'SearchButton';
