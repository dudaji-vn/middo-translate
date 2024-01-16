import { forwardRef, useEffect } from 'react';

import { Button } from '@/components/actions';
import { FilePlus2 } from 'lucide-react';
import { MessageEditorToolbarEmoji } from './message-editor-toolbar-emoji';
import { MessageEditorToolbarLangControl } from './message-editor-toolbar-lang-control';
import { MessageEditorToolbarMic } from './message-editor-toolbar-mic';
import { MessageEditorToolbarTranslateTool } from './message-editor-toolbar-translate';
import { useMessageEditorMedia } from './message-editor-media-context';
import { useMessageEditorText } from './message-editor-text-context';

export interface MessageEditorToolbarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  disableMedia?: boolean;
}

export const MessageEditorToolbar = forwardRef<
  HTMLDivElement,
  MessageEditorToolbarProps
>(({ disableMedia = false, ...props }, ref) => {
  const { listening } = useMessageEditorText();
  const { open } = useMessageEditorMedia();

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
        {!disableMedia && (
          <Button.Icon onClick={open} color="default" size="xs" variant="ghost">
            <FilePlus2 />
          </Button.Icon>
        )}
        <MessageEditorToolbarMic />
        <MessageEditorToolbarEmoji />
      </div>
    </>
  );
});
MessageEditorToolbar.displayName = 'MessageEditorToolbar';
