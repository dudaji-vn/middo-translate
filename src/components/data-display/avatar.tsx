import { Children, cloneElement, forwardRef, useMemo } from 'react';
import Image, { ImageProps } from 'next/image';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const avatarVariants = cva('overflow-hidden shrink-0 relative aspect-square', {
  variants: {
    size: {
      xs: 'size-6',
      sm: 'size-9',
      md: 'size-10',
      lg: 'size-12',
      xl: 'size-14',
      '2xl': 'size-16',
      '3xl': 'size-20',
      '4xl': 'size-24',
    },
    shape: {
      circle: 'rounded-full',
      square: 'rounded-none',
    },
  },
  defaultVariants: {
    size: 'md',
    shape: 'circle',
  },
});

export interface AvatarProps
  extends ImageProps,
    VariantProps<typeof avatarVariants> {}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ size, alt, shape, className, src, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(avatarVariants({ size, shape }), className)}>
        <Image
          {...props}
          fill
          alt={alt}
          sizes="(max-width: 640px) 100px, 200px"
          className="object-cover"
          src={
            src ||
            'https://res.cloudinary.com/devemail/image/upload/v1689673231/avatar/jys86gp3rnklfb6e6rzr.jpg'
          }
        />
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';

interface AvatarGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  children: React.ReactNode;
  limit?: number;
  avatarClassName?: string;
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    { className, children, limit, size, avatarClassName, shape, ...props },
    ref,
  ) => {
    const renderChildren = useMemo(() => {
      return Children.map(children, (child, index) => {
        if (limit && index >= limit) return null;
        const newChild = child as React.ReactElement;
        return cloneElement(newChild, {
          size,
          shape,
          className: cn(newChild.props.className, avatarClassName),
          ...newChild.props,
        });
      });
    }, [avatarClassName, children, limit, shape, size]);

    return (
      <div ref={ref} className={cn('size-fit flex', className)} {...props}>
        {renderChildren}
        {limit && Children.count(children) > limit && (
          <div
            className={cn(
              avatarVariants({ size, shape }),
              'flex items-center justify-center bg-background font-semibold text-primary/60',
              avatarClassName,
            )}
          >
            +{Children.count(children) - limit}
          </div>
        )}
      </div>
    );
  },
);

AvatarGroup.displayName = 'AvatarGroup';
