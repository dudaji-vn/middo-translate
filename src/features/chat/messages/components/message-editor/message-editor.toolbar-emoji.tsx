import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/data-display/popover';

import { Button } from '@/components/actions';
import EmojiPicker from 'emoji-picker-react';
import { Smile } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/stores/app.store';
import { useMessageEditorText } from './message-editor.text-context';

export interface MessageEditorToolbarEmojiProps {}

export const MessageEditorToolbarEmoji = (
  props: MessageEditorToolbarEmojiProps,
) => {
  const isMobile = useAppStore((state) => state.isMobile);
  const { text, setText, focusInput } = useMessageEditorText();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button.Icon variant="ghost" color="default" size="sm">
          <Smile />
        </Button.Icon>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={24}
        alignOffset={isMobile ? 0 : -14}
        align="end"
        className={cn(
          'w-fit border-none !bg-transparent p-0 shadow-none',
          isMobile && 'w-screen px-3',
        )}
      >
        <EmojiPicker
          skinTonesDisabled
          previewConfig={{ showPreview: false }}
          lazyLoadEmojis
          searchDisabled
          autoFocusSearch={false}
          width={isMobile ? '100%' : ''}
          onEmojiClick={(emojiObj) => {
            setText(text + emojiObj.emoji);
            focusInput();
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
