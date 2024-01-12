import { Message, Reaction } from '../../types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/data-display';

import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/auth.store';

export interface MessageItemReactionBarProps {
  message: Message;
  isMe: boolean;
}

export const MessageItemReactionBar = ({
  message,
  isMe,
}: MessageItemReactionBarProps) => {
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
    <div
      className={cn(
        'mb-1 mt-0.5 flex h-5',
        isMe ? 'justify-end' : 'justify-start pl-8 md:pl-8',
      )}
    >
      <div className="flex gap-1">
        <div className="flex items-center gap-1">
          {Object.entries(reactionsByEmoji).map(([emoji, reactions]) => (
            <ReactionItem key={emoji} reactions={reactions} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ReactionItem = (props: { reactions: Reaction[] }) => {
  const { reactions } = props;
  const user = useAuthStore((state) => state.user);
  return (
    <div className="flex h-5 items-center justify-center rounded-full border border-neutral-50 bg-white shadow-1">
      <Tooltip>
        <TooltipContent>
          {reactions.map((reaction) => (
            <div key={reaction.user._id} className="flex items-center">
              <span className="mx-[2px] text-sm">
                {reaction.user._id === user?._id ? 'You' : reaction.user.name}
              </span>
            </div>
          ))}
        </TooltipContent>
        <TooltipTrigger>
          <span className="mx-[2px]">{reactions[0].emoji}</span>
        </TooltipTrigger>
      </Tooltip>
      <span className="mx-[2px] mr-1 text-sm text-neutral-600">
        {reactions.length}
      </span>
    </div>
  );
};
