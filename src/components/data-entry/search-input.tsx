'use client';

import {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { SearchIcon, XCircleIcon } from 'lucide-react';

import { cn } from '@/utils/cn';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import isEqual from 'lodash/isEqual';
import { useSideChatStore } from '@/features/chat/stores/side-chat.store';

export interface SearchInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  loading?: boolean;
  btnDisabled?: boolean;
  onClear?: () => void;
  onEnter?: () => void;
  leftElement?: React.ReactNode;
  showSearchButton?: boolean;
  wrapperClassName?: string;
}

export interface SearchInputRef extends HTMLInputElement {
  reset: () => void;
  focus: () => void;
}
export const SearchInput = forwardRef<SearchInputRef, SearchInputProps>(
  (
    {
      btnDisabled,
      defaultValue,
      onClear,
      onEnter,
      leftElement,
      showSearchButton = true,
      wrapperClassName,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = useState(defaultValue || '');
    const { setCurrentSide } = useSideChatStore();
    const inputRef = useRef<HTMLInputElement>(null);
    const handleClear = useCallback(() => {
      setValue('');
      onClear?.();
    }, [onClear]);
    const [canClear, setCanClear] = useState(false);
    useKeyboardShortcut(
      [SHORTCUTS.SEARCH, SHORTCUTS.NEW_CONVERSATION],
      (_, matchedKeys) => {
        if (isEqual(matchedKeys, SHORTCUTS.NEW_CONVERSATION)) {
          setCurrentSide('individual');
          return;
        }
        inputRef.current?.focus();
      },
    );
    useImperativeHandle(
      ref,
      () => ({
        ...(inputRef.current as HTMLInputElement),
        focus: () => {
          inputRef.current?.focus();
        },
        reset: () => {
          setValue('');
        },
      }),
      [],
    );

    useEffect(() => {
      if (props.autoFocus === undefined || props.autoFocus) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 200);
      }
    }, [props.autoFocus]);

    useEffect(() => {
      setValue(props.value || '');
    }, [props.value]);

    return (
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-xl border bg-background transition-all dark:border-neutral-800',
          wrapperClassName,
        )}
      >
        <div className="flex h-11 pl-1 transition-all ">
          {leftElement}
          <input
            onKeyDown={(e) => {
              if (e.key === 'Enter' && onEnter) {
                e.preventDefault();
                onEnter();
              }
            }}
            {...props}
            value={value}
            ref={inputRef}
            type="text"
            onFocus={(e) => {
              props.onFocus?.(e);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 200);
            }}
            onChange={(e) => {
              props.onChange?.(e);
              setCanClear(e.target.value.length > 0);
              setValue(e.target.value);
            }}
            className={`w-full border-0 bg-inherit p-2  ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent dark:text-neutral-50 ${props.className}`}
          />
          {canClear ? (
            <button
              onClick={handleClear}
              className={
                'flex aspect-square h-full items-center justify-center p-2  disabled:text-text dark:text-neutral-50'
              }
            >
              <XCircleIcon className="h-5 w-5 opacity-60" />
            </button>
          ) : (
            <>
              {showSearchButton && (
                <div className="flex h-11 w-11 items-center bg-inherit dark:text-neutral-50">
                  <SearchButton disabled />
                </div>
              )}
            </>
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
          'flex aspect-square h-full items-center justify-center p-2 text-primary disabled:text-text dark:text-neutral-50',
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
