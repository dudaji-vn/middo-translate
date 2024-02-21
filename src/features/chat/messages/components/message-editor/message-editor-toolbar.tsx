import { forwardRef, useEffect, useState } from 'react';

import { Button } from '@/components/actions';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { ChatSettingMenu } from '@/features/chat/components/chat-setting';
import { Settings } from 'lucide-react';
import { useMessageEditorText } from './message-editor-text-context';
import { MessageEditorToolbarEmoji } from './message-editor-toolbar-emoji';
import { MessageEditorToolbarFile } from './message-editor-toolbar-file';
import { MessageEditorToolbarLangControl } from './message-editor-toolbar-lang-control';
import { MessageEditorToolbarMic } from './message-editor-toolbar-mic';
import { MessageEditorToolbarTranslateTool } from './message-editor-toolbar-translate';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';

export interface MessageEditorToolbarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  disableMedia?: boolean;
}

  const SHORTCUT_TOGGLE_SETTING = ['shift', '?'];
export const MessageEditorToolbar = forwardRef<
  HTMLDivElement,
  MessageEditorToolbarProps
>(({ disableMedia = false, ...props }, ref) => {
  const { listening } = useMessageEditorText();
  const room = useVideoCallStore((state) => state.room);
  const [openSetting, setOpenSetting] = useState(false);
  const handleToggleSetting = () => {
    console.log('openSetting', openSetting)
    setOpenSetting((prev) => !prev);
  };
  useKeyboardShortcut(SHORTCUT_TOGGLE_SETTING, handleToggleSetting);
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
      <div ref={ref} {...props} className="flex items-center">
        <MessageEditorToolbarLangControl />
        {!disableMedia && <Tooltip title="Upload files" triggerItem={<MessageEditorToolbarFile />} />}
        {!room && (
          <Tooltip title="Speech-to-text" triggerItem={<MessageEditorToolbarMic />} />
        )}
        <Tooltip
          title="Emojis"
          triggerItem={<MessageEditorToolbarEmoji />}
        />
        <Tooltip
          title="Settings"
          triggerItem={
            <ChatSettingMenu open={openSetting} onOpenChange={setOpenSetting}>
              <Button.Icon color="default" size="xs" variant="ghost">
                <Settings />
              </Button.Icon>
            </ChatSettingMenu>
          }
        />
      </div>
    </>
  );
});
MessageEditorToolbar.displayName = 'MessageEditorToolbar';
