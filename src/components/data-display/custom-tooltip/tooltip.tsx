import React, { forwardRef } from 'react';
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/data-display';
import { useAppStore } from '@/stores/app.store';

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
          <TooltipContent className="rounded-full" {...contentProps}>
            <p>{title}</p>
          </TooltipContent>
        )}
        {children || (
          <TooltipTrigger {...triggerProps}>{triggerItem}</TooltipTrigger>
        )}
      </ShadcnTooltip>
    );
  },
);

Tooltip.displayName = 'Tooltip';

export default Tooltip;
