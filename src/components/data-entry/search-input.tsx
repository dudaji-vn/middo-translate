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

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  loading?: boolean;
  btnDisabled?: boolean;
  onClear?: () => void;
}

export interface SearchInputRef extends HTMLInputElement {
  reset: () => void;
}
export const SearchInput = forwardRef<SearchInputRef, SearchInputProps>(
  ({ btnDisabled, defaultValue, onClear, ...props }, ref) => {
    const [value, setValue] = useState(defaultValue || '');
    const inputRef = useRef<HTMLInputElement>(null);
    const handleClear = useCallback(() => {
      setValue('');
      onClear?.();
    }, [onClear]);
    const canClear = value !== '';

    useImperativeHandle(
      ref,
      () => ({
        ...(inputRef.current as HTMLInputElement),
        reset: () => {
          handleClear();
        },
      }),
      [handleClear],
    );

    return (
      <div className="relative w-full overflow-hidden rounded-full border bg-background">
        <div className="flex h-[48px] pl-3">
          <input
            value={value}
            ref={inputRef}
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
            <div className="flex items-center bg-inherit">
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
