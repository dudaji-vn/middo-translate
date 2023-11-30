import { ButtonHTMLAttributes, forwardRef } from 'react';

import { Search } from '@easy-eva-icons/react';
import { cn } from '@/utils/cn';

interface SearchInputProps extends ButtonHTMLAttributes<HTMLInputElement> {
  loading?: boolean;
  btnDisabled?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ btnDisabled, ...props }, ref) => {
    return (
      <div className="relative w-full overflow-hidden rounded-full border bg-background">
        <div className="flex h-11 pl-3">
          <input
            ref={ref}
            type="text"
            {...props}
            className={`w-full border-0 bg-inherit p-2 ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent ${props.className}`}
          />
          <div className="flex items-center bg-inherit">
            <SearchButton disabled />
          </div>
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
        <Search className="h-5 w-5" />
      </button>
    );
  },
);

SearchButton.displayName = 'SearchButton';
