import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { Button } from '@/components/actions';
import { ChevronRight } from 'lucide-react';
import { EmojiToggleButton } from './emoji-toggle-button';
import { AttachmentButton } from './attachment-button';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';

import { cn } from '@/utils/cn';

export interface ToolbarRef extends HTMLDivElement {
  expand: () => void;
  collapse: () => void;
}

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  disableMedia?: boolean;
  isMultiline?: boolean;
}
export const Toolbar = forwardRef<ToolbarRef, ToolbarProps>(
  ({ disableMedia = false, ...props }, ref) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const divRef = useRef<HTMLDivElement>(null);
    const expand = () => {
      setIsExpanded(true);
    };
    const collapse = () => {
      setIsExpanded(false);
    };
    useImperativeHandle(
      ref,
      () => ({
        ...(divRef.current as HTMLDivElement),
        expand,
        collapse,
      }),
      [],
    );
    return (
      <div
        ref={divRef}
        {...props}
        className={cn('flex-rows flex  items-end  pb-[5px]')}
      >
        {!isExpanded ? (
          <Button.Icon
            onClick={expand}
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
