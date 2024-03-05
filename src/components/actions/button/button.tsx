import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';

import { IconButton } from '@/components/actions/button/button.icon';
import { Icon } from '@/components/actions/button/icon';
import { buttonVariants } from '@/components/actions/button/button.styles';
import { Spinner } from '@/components/feedback/spinner';
import { cn } from '@/utils/cn';
import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariantsProps = VariantProps<typeof buttonVariants>;
type NativeButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

type IconProps =
  | { startIcon: React.ReactElement; endIcon?: never }
  | { endIcon: React.ReactElement; startIcon?: never }
  | { endIcon?: undefined; startIcon?: undefined };

export type ButtonProps = Omit<NativeButtonProps, keyof ButtonVariantsProps> &
  ButtonVariantsProps &
  IconProps & {
    asChild?: boolean;
    loading?: boolean;
  };

export interface ButtonComponent
  extends React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<HTMLButtonElement>
  > {
  Icon: typeof IconButton;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      loading = false,
      disabled = false,
      variant,
      size,
      color,
      shape,
      asChild = false,
      startIcon,
      endIcon,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        type="button"
        className={cn(
          buttonVariants({ variant, size, color, shape, className }),
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        <>
          {startIcon && (
            <Icon type="left" size={size}>
              {startIcon}
            </Icon>
          )}
          {loading ? <Spinner size={size} /> : <>{children}</>}
          {endIcon && <Icon type="right">{endIcon}</Icon>}
        </>
      </Comp>
    );
  },
) as ButtonComponent;
Button.displayName = 'Button';

Button.Icon = IconButton;
