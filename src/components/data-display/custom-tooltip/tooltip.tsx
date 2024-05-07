'use client';

import React, { forwardRef } from 'react';
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/data-display';
import { useAppStore } from '@/stores/app.store';
import { cn } from '@/utils/cn';
export type TooltipProps = {
  title: string;
  children?: React.ReactNode;
  triggerItem?: React.ReactNode;
  triggerProps?: React.ComponentProps<typeof TooltipTrigger>;
  contentProps?: React.ComponentProps<typeof TooltipContent>;
};
const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    { children, title, triggerItem, triggerProps, contentProps, ...rest },
    ref,
  ) => {
    const { isMobile } = useAppStore();
    return (
      <ShadcnTooltip delayDuration={100} {...rest}>
        {!isMobile && (
          <TooltipContent
            {...contentProps}
            className={cn(
              'rounded-lg bg-black/60 text-white',
              contentProps?.className,
            )}
          >
            <p>{title}</p>
          </TooltipContent>
        )}
        {children || (
          <TooltipTrigger asChild {...triggerProps}>
            <div>{triggerItem}</div>
          </TooltipTrigger>
        )}
      </ShadcnTooltip>
    );
  },
);
Tooltip.displayName = 'Tooltip';
export default Tooltip;
