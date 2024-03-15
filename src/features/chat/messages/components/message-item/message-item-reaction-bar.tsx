import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/feedback';
import { Message, Reaction } from '../../types';
import { Tabs, TabsList, TabsTrigger } from '@/components/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/data-display';

import { Button } from '@/components/actions';
import { CloseIcon } from 'yet-another-react-lightbox';
import { UserItem } from '@/features/users/components';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/auth.store';
import { useBoolean } from 'usehooks-ts';
import { useReactMessage } from '../../hooks';
import { useState } from 'react';

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

  const user = useAuthStore((state) => state.user);

  const [tabValue, setTabValue] = useState<string>('all');

  const { setValue, value } = useBoolean(false);

  const { mutate } = useReactMessage();

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
            <ReactionItem
              onClick={() => {
                if (reactions.length > 0) {
                  setValue(true);
                }
              }}
              key={emoji}
              reactions={reactions}
            />
          ))}
        </div>
      </div>
      <AlertDialog open={value} onOpenChange={setValue}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Message reactions?</AlertDialogTitle>
          </AlertDialogHeader>
          <Tabs value={tabValue} className="w-full px-3">
            <TabsList className="justify-start">
              <TabsTrigger
                value="all"
                onClick={() => setTabValue('all')}
                className="w-16 !rounded-none"
              >
                All
              </TabsTrigger>
              {Object.values(reactions).map((react) => {
                return (
                  <TabsTrigger
                    key={react.emoji}
                    value={react.emoji}
                    onClick={() => setTabValue(react.emoji)}
                    className="max-h-[53px] w-16 !rounded-none"
                  >
                    <span className="text-xl"> {react.emoji}</span>
                    <div className="ml-1">
                      <span>{reactionsByEmoji[react.emoji]?.length}</span>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
          <div>
            {tabValue === 'all' && (
              <div>
                {reactions.map((reaction) => {
                  const isMe = reaction.user._id === user?._id;
                  return (
                    <UserItem
                      key={reaction.user._id}
                      user={reaction.user}
                      rightElement={
                        <div className="flex items-center">
                          <span className="mx-[2px] text-2xl">
                            {reaction.emoji}
                          </span>
                          {isMe && (
                            <Button.Icon
                              onClick={() => {
                                mutate({
                                  id: message._id,
                                  emoji: reaction.emoji,
                                });
                              }}
                              size="xs"
                              variant="ghost"
                              color="default"
                            >
                              <CloseIcon />
                            </Button.Icon>
                          )}
                        </div>
                      }
                    />
                  );
                })}
              </div>
            )}
            {tabValue !== 'all' && (
              <>
                {reactionsByEmoji[tabValue]?.map((reaction) => (
                  <UserItem
                    key={reaction.user._id}
                    user={reaction.user}
                    rightElement={
                      reaction.user._id === user?._id && (
                        <Button.Icon
                          onClick={() => {
                            mutate({
                              id: message._id,
                              emoji: reaction.emoji,
                            });
                          }}
                          size="xs"
                          color="default"
                          variant="ghost"
                          className="shrink-0"
                        >
                          <CloseIcon />
                        </Button.Icon>
                      )
                    }
                  />
                ))}
              </>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const ReactionItem = (props: {
  reactions: Reaction[];
  onClick?: () => void;
}) => {
  const { reactions } = props;
  const user = useAuthStore((state) => state.user);
  return (
    <div
      onClick={props.onClick}
      className="flex h-5 items-center justify-center rounded-full border border-neutral-50 bg-white shadow-1"
    >
      <Tooltip>
        <TooltipContent className="rounded-2xl">
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
