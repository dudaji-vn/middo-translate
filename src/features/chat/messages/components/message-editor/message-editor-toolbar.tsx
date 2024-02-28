import { forwardRef } from 'react';

import { Button } from '@/components/actions';
import {
  ChevronRight,
} from 'lucide-react';
import { MessageEditorToolbarEmoji } from './message-editor-toolbar-emoji';
import { MessageEditorToolbarFile } from './message-editor-toolbar-file';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';

import { cn } from '@/utils/cn';

export interface MessageEditorToolbarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  disableMedia?: boolean;
  shrink?: boolean;
  onExpand?: () => void;
  isMultiline?: boolean;
}
export const MessageEditorToolbar = forwardRef<
  HTMLDivElement,
  MessageEditorToolbarProps
>(({ disableMedia = false, shrink = false, isMultiline, onExpand, ...props }, ref) => {
 
  return (
      <div ref={ref} {...props} className={cn('flex-rows flex items-end pb-[2px]')}>
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
              <Tooltip
                title="Upload files"
                triggerItem={<MessageEditorToolbarFile />}
              />

              <Tooltip
                title="Emojis"
                triggerItem={<MessageEditorToolbarEmoji />}
              />
            </>
          )}
      </div>
  );
});
MessageEditorToolbar.displayName = 'MessageEditorToolbar';
