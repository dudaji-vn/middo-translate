import * as React from 'react';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import './input.css';
import { Button } from '../actions';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean;
  suffix?: React.ReactNode;
  prefixEl?: React.ReactNode;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      wrapperProps,
      suffix,
      leftElement,
      rightElement,
      isError,
      type,
      required,
      prefixEl,
      ...props
    },
    ref,
  ) => {
    const [isShowPassword, setIsShowPassword] = React.useState(false);
    return (
      <div
        {...wrapperProps}
        className={cn('relative', wrapperProps?.className)}
      >
        {leftElement}
        <input
          type={type === 'password' && isShowPassword ? 'text' : type}
          className={cn(
            'z-10 flex h-12 w-full rounded-xl border border-input bg-background px-5 py-[14px] pr-[3.75rem] text-base font-normal leading-none ring-offset-background file:bg-transparent placeholder:!text-neutral-200 placeholder:text-muted-foreground focus-within:border-primary focus-within:caret-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-50',
            className,
            isError && 'border-error focus-within:border-error',
            prefixEl && 'pl-7',
          )}
          ref={ref}
          {...props}
          required={required}
          placeholder={required ? '' : props.placeholder}
          id={props.name}
        />
        {
          <label
            onClick={() => {
              const input = document.getElementById(String(props.name));
              input?.focus();
            }}
            className={
              required
                ? 'text-neutral  absolute inset-y-0 z-0 pl-5 pr-4 text-left leading-[52px] text-muted-foreground'
                : 'hidden'
            }
            htmlFor={props.placeholder}
          >
            {props.placeholder}
            <span className="font-light text-error">*</span>
          </label>
        }
        {type === 'password' && (
          <Button.Icon
            size={'sm'}
            variant={'ghost'}
            color={'default'}
            shape={'default'}
            onClick={() => setIsShowPassword(!isShowPassword)}
            className="absolute right-1 top-1/2 -translate-y-1/2"
          >
            {isShowPassword ? <EyeIcon /> : <EyeOffIcon />}
          </Button.Icon>
        )}
        {prefixEl && (
          <div className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-muted-foreground">
            {prefixEl}
          </div>
        )}
        {suffix && (
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-muted-foreground">
            {suffix}
          </div>
        )}

        {rightElement}
      </div>
    );
  },
);
Input.displayName = 'Input';
