import * as React from 'react';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean;
  suffix?: React.ReactNode;
  leftElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, suffix, leftElement, isError, type, ...props }, ref) => {
    const [isShowPassword, setIsShowPassword] = React.useState(false);
    return (
      <div className="relative">
        <input
          type={type === 'password' && isShowPassword ? 'text' : type}
          className={cn(
            'flex  w-full rounded-xl border border-input bg-background px-5 py-[14px] pr-[3.75rem] text-base font-normal leading-none ring-offset-background file:bg-transparent placeholder:text-muted-foreground focus-within:border-primary focus-within:caret-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ',
            className,
            isError && 'border-error focus-within:border-error',
          )}
          ref={ref}
          {...props}
        />
        {type === 'password' && (
          <div
            onClick={() => setIsShowPassword(!isShowPassword)}
            className="absolute right-1 top-1 h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-transparent p-[10px] text-sm  font-semibold text-primary ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:!bg-transparent disabled:!opacity-30 md:hover:bg-slate-200"
          >
            {isShowPassword ? (
              <EyeIcon className="text-slate-600 opacity-60" />
            ) : (
              <EyeOffIcon className="text-slate-600 opacity-60" />
            )}
          </div>
        )}
        {suffix && (
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-muted-foreground">
            {suffix}
          </div>
        )}
        {leftElement && (
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-muted-foreground">
            {leftElement}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';
