import { forwardRef } from 'react';

import { Button } from '@/components/actions';
import {
  ChevronRight,
} from 'lucide-react';
import { MessageEditorToolbarEmoji } from './message-editor-toolbar-emoji';
import { MessageEditorToolbarFile } from './message-editor-toolbar-file';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';

import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';

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
>(({ disableMedia = false, shrink = false, onExpand, ...props }, ref) => {
  const {t} = useTranslation('common')
  return (
      <div ref={ref} {...props} className={cn('flex-rows flex  items-end  max-md:pb-[1px] pb-[5px]')}>
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
                title={t('TOOL_TIP.ATTACHMENT')}
                triggerItem={<MessageEditorToolbarFile />}
              />

              <Tooltip
                title={t('TOOL_TIP.EMOJI')}
                triggerItem={<MessageEditorToolbarEmoji />}
              />
            </>
          )}
      </div>
  );
});
MessageEditorToolbar.displayName = 'MessageEditorToolbar';
