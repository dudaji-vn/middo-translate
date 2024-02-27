import { forwardRef, useEffect, useState } from 'react';

import { Button } from '@/components/actions';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { ChatSettingMenu } from '@/features/chat/components/chat-setting';
import {
  ArrowRight,
  ChevronRight,
  ChevronRightSquare,
  Plus,
  Settings,
} from 'lucide-react';
import { useMessageEditorText } from './message-editor-text-context';
import { MessageEditorToolbarEmoji } from './message-editor-toolbar-emoji';
import { MessageEditorToolbarFile } from './message-editor-toolbar-file';
import { MessageEditorToolbarLangControl } from './message-editor-toolbar-lang-control';
import { MessageEditorToolbarMic } from './message-editor-toolbar-mic';
import { MessageEditorToolbarTranslateTool } from './message-editor-toolbar-translate';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import { useChatStore } from '@/features/chat/store';
import isEqual from 'lodash/isEqual';
import { cn } from '@/utils/cn';

export interface MessageEditorToolbarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  disableMedia?: boolean;
  shrink?: boolean;
  onExpand?: () => void;
}
export const MessageEditorToolbar = forwardRef<
  HTMLDivElement,
  MessageEditorToolbarProps
>(({ disableMedia = false, shrink = false, ...props }, ref) => {
  const { listening } = useMessageEditorText();

  const { toggleShowTranslateOnType, toggleShowMiddleTranslation } =
    useChatStore();
  useKeyboardShortcut(
    [
      SHORTCUTS.TURN_ON_OFF_TRANSLATION,
      SHORTCUTS.TURN_ON_OFF_TRANSLATION_PREVIEW,
    ],
    (_, matchedKey) => {
      if (isEqual(matchedKey, SHORTCUTS.TURN_ON_OFF_TRANSLATION)) {
        toggleShowMiddleTranslation();
        return;
      }
      if (isEqual(matchedKey, SHORTCUTS.TURN_ON_OFF_TRANSLATION_PREVIEW)) {
        toggleShowTranslateOnType();
      }
    },
    true,
  );
  useEffect(() => {
    // enable submit form by enter
    const formRef = document.getElementById('message-editor');
    if (!formRef) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        formRef?.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true }),
        );
      }
    };
    if (listening) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [listening]);
  return (
    <>
      <MessageEditorToolbarTranslateTool />
      <div ref={ref} {...props} className={cn('flex-rows flex items-end')}>
          {shrink ? (
            <Button.Icon
              onClick={() => props.onExpand?.()}
              variant="ghost"
              size="xs"
              color="default"
              className='mb-1'
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
    </>
  );
});
MessageEditorToolbar.displayName = 'MessageEditorToolbar';
