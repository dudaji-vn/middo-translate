import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/data-display';
import Picker from '@emoji-mart/react';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/actions';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/data-display/popover';
import { useAppStore } from '@/stores/app.store';
import { PlusIcon } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { useReactMessage } from '../../hooks';
import { cn } from '@/utils/cn';

export interface MessageEmojiPickerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  messageId: string;
  onEmojiClick?: (emoji: string) => void;
  onClickMore?: () => void;
  align?: 'start' | 'end';
}
type Emoji = {
  name: string;
  value: string;
};
const defaultEmoji: Emoji[] = [
  {
    name: 'love',
    value: '❤️',
  },
  {
    name: 'like',
    value: '👍',
  },
  {
    name: 'smile',
    value: '🙂',
  },

  {
    name: 'laugh',
    value: '😆',
  },
  {
    name: 'sad',
    value: '😢',
  },
];
export const MessageEmojiPicker = forwardRef<
  HTMLDivElement,
  MessageEmojiPickerProps
>(
  (
    { messageId, onEmojiClick, onClickMore, align = 'start', ...props },
    ref,
  ) => {
    const { mutate } = useReactMessage();
    const handleEmojiClick = (emoji: string) => {
      mutate({ id: messageId, emoji });
      onEmojiClick && onEmojiClick(emoji);
    };
    const isMobile = useAppStore((state) => state.isMobile);

    return (
      <div
        onClick={(e) => e.stopPropagation()}
        ref={ref}
        {...props}
        className="flex w-full items-center justify-between gap-1 rounded-full border-neutral-50 bg-white p-1 px-1 pl-3 shadow-1 md:w-fit"
      >
        <AnimatePresence>
          {defaultEmoji.map((emoji, index) => (
            <motion.div
              initial={{ opacity: 0, translateY: 20, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                translateY: 0,

                transition: {
                  delay: index * 0.05,
                },
              }}
              exit={{ opacity: 0, scale: 0 }}
              key={emoji.name}
            >
              <Tooltip>
                <TooltipContent className="rounded-full">
                  <span className="mx-[2px] text-sm">{emoji.name}</span>
                </TooltipContent>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => {
                      handleEmojiClick(emoji.value);
                    }}
                    key={emoji.name}
                    className="disable-text-selection all flex h-8 w-8 origin-bottom cursor-pointer items-center justify-center rounded-full text-[32px] transition-transform ease-linear hover:scale-150 md:text-[28px]"
                  >
                    {emoji.value}
                  </div>
                </TooltipTrigger>
              </Tooltip>
            </motion.div>
          ))}
        </AnimatePresence>

        {!isMobile ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button.Icon size="xs" color="default">
                <PlusIcon />
              </Button.Icon>
            </PopoverTrigger>
            <PopoverContent
              align={align}
              alignOffset={-12}
              className={cn(
                '-mt-12 w-fit border-none !bg-transparent p-0 shadow',
              )}
            >
              <Picker
                theme="light"
                onEmojiSelect={(emoji: any) => {
                  handleEmojiClick(emoji.native);
                }}
                skinTonePosition="none"
                previewPosition="none"
              />
            </PopoverContent>
          </Popover>
        ) : (
          <Button.Icon onClick={onClickMore} size="xs" color="default">
            <PlusIcon />
          </Button.Icon>
        )}
      </div>
    );
  },
);
MessageEmojiPicker.displayName = 'MessageEmojiPicker';
