import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/data-display';
import { useAuthStore } from '@/stores/auth.store';
import { SmilePlusIcon } from 'lucide-react';
import { Message, Reaction } from '../../types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/data-display/popover';
import { useAppStore } from '@/stores/app.store';
import EmojiPicker from 'emoji-picker-react';
import { cn } from '@/utils/cn';
import { useReactMessage } from '../../hooks';

export interface MessageItemReactionBarProps {
  message: Message;
}

export const MessageItemReactionBar = ({
  message,
}: MessageItemReactionBarProps) => {
  const isMobile = useAppStore((state) => state.isMobile);
  const { mutate } = useReactMessage();

  const reactions = message.reactions || [];
  const reactionsByEmoji = reactions.reduce(
    (acc: Record<string, Reaction[]>, reaction) => {
      const { emoji } = reaction;
      if (!acc[emoji]) {
        acc[emoji] = [];
      }
      acc[emoji].push(reaction);
      return acc;
    },
    {},
  );

  return (
    <div className="flex h-5 justify-end">
      <div className="flex -translate-y-1/2 gap-1">
        <div className="flex items-center gap-1">
          {Object.entries(reactionsByEmoji).map(([emoji, reactions]) => (
            <ReactionItem key={emoji} reactions={reactions} />
          ))}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <div className="flex h-5 w-5 flex-1 items-center justify-center rounded-full bg-white shadow-1">
              <SmilePlusIcon className="h-4 w-4 text-neutral-600" />
            </div>
          </PopoverTrigger>
          <PopoverContent
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
              height={320}
              width={isMobile ? '100%' : ''}
              onEmojiClick={(emojiObj) => {
                mutate({ id: message._id, emoji: emojiObj.emoji });
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

const ReactionItem = (props: { reactions: Reaction[] }) => {
  const { reactions } = props;
  return (
    <div className="flex h-5  items-center justify-center rounded-full bg-white shadow-1">
      <Tooltip>
        <TooltipContent>
          {reactions.map((reaction) => (
            <div key={reaction.user._id} className="flex items-center">
              <span className="mx-[2px] text-xs">{reaction.user.name}</span>
            </div>
          ))}
        </TooltipContent>
        <TooltipTrigger>
          <span className="mx-[2px] text-sm">{reactions[0].emoji}</span>
        </TooltipTrigger>
      </Tooltip>
      <span className="mx-[2px] mr-1 text-xs text-neutral-600">
        {reactions.length}
      </span>
    </div>
  );
};
