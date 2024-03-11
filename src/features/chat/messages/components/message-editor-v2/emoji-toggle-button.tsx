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
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { useState } from 'react';
import { SHORTCUTS } from '@/types/shortcuts';
import { useMessageEditor } from '.';

export interface EmojiToggleButtonProps {}

export const EmojiToggleButton = (props: EmojiToggleButtonProps) => {
  const isMobile = useAppStore((state) => state.isMobile);
  const { richText } = useMessageEditor();

  const [openEmojisPicker, setOpenEmojisPicker] = useState(false);

  useKeyboardShortcut([SHORTCUTS.OPEN_EMOJI], (e) => {
    e?.preventDefault();
    setOpenEmojisPicker((prev) => !prev);
  });

  return (
    <Popover open={openEmojisPicker} onOpenChange={setOpenEmojisPicker}>
      <PopoverTrigger asChild>
        <Button.Icon variant="ghost" color="default" size="xs">
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
            richText?.commands.insertContent(emojiObj.emoji);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
