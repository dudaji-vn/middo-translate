import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/data-display/popover';

import { Button } from '@/components/actions';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { useAppStore } from '@/stores/app.store';
import { SHORTCUTS } from '@/types/shortcuts';
import { cn } from '@/utils/cn';
import Picker from '@emoji-mart/react';
import { Smile } from 'lucide-react';
import { useState } from 'react';
import { Editor } from '@tiptap/react';

export interface EmojiToggleButtonProps {
  editor: Editor | null;
}

export const EmojiButton = ({ editor }: EmojiToggleButtonProps) => {
  const isMobile = useAppStore((state) => state.isMobile);
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
        sideOffset={isMobile ? 14 : 24}
        alignOffset={isMobile ? 0 : -14}
        align="start"
        className={cn(
          'w-fit border-none !bg-transparent p-0 shadow-none',
          isMobile && 'w-screen',
        )}
      >
        <Picker
          theme="light"
          onEmojiSelect={(emoji: any) => {
            editor?.commands.insertContent({
              type: 'text',
              text: emoji.native,
            });
            editor?.commands.focus();
          }}
          skinTonePosition="none"
          previewPosition="none"
        />
      </PopoverContent>
    </Popover>
  );
};
