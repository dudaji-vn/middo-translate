import { forwardRef } from 'react';

import { Button } from '@/components/actions';
import { ChevronRight } from 'lucide-react';
import { EmojiToggleButton } from './emoji-toggle-button';
import { AttachmentButton } from './attachment-button';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';

import { cn } from '@/utils/cn';

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  disableMedia?: boolean;
  shrink?: boolean;
  onExpand?: () => void;
  isMultiline?: boolean;
}
export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(
  ({ disableMedia = false, shrink = false, onExpand, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={cn('flex-rows flex  items-end  pb-[5px] max-md:pb-[1px]')}
      >
        {shrink ? (
          <Button.Icon
            onClick={() => onExpand?.()}
            variant="ghost"
            size="xs"
            color="default"
          >
            <ChevronRight className="h-5 w-5" />
          </Button.Icon>
        ) : (
          <>
            <Tooltip title="Upload files" triggerItem={<AttachmentButton />} />
            <Tooltip title="Emojis" triggerItem={<EmojiToggleButton />} />
          </>
        )}
      </div>
    );
  },
);
Toolbar.displayName = 'Toolbar';
