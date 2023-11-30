import { VariantProps, cva } from 'class-variance-authority';

import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/utils/cn';

const typographyTags = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  muted: 'span',
  default: 'span',
} as { [key: string]: keyof JSX.IntrinsicElements };

const typographyVariants = cva('text-text text-base', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 text-3xl font-semibold tracking-tight',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
      muted: 'text-text/70',
      default: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface TypographyProps extends VariantProps<typeof typographyVariants> {
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const Typography = ({
  className,
  variant,
  asChild = false,
  children,
  ...props
}: TypographyProps) => {
  const Comp = asChild ? Slot : typographyTags[variant ?? 'default'];

  return (
    <Comp className={cn(typographyVariants({ variant, className }))} {...props}>
      {children}
    </Comp>
  );
};

Typography.displayName = 'Typography';
