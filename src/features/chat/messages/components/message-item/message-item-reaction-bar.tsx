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
import { useTranslation } from 'react-i18next';
import { MessageEmojiPicker } from '../message-emoji-picker';
import { Drawer, DrawerContent } from '@/components/data-display/drawer';
import EmojiPicker from '@emoji-mart/react';

export interface MessageItemReactionBarProps {
  message: Message;
  isMe: boolean;
}

export const MessageItemReactionBar = ({
  message,
  isMe,
}: MessageItemReactionBarProps) => {
  const reactions = message.reactions || [];
  const { t } = useTranslation('common');
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
  const {
    value: showEmoji,
    setValue: changeShowEmoji,
    setFalse: hideEmoji,
    setTrue: openEmoji,
  } = useBoolean(false);

  const { setValue, value } = useBoolean(false);

  const { mutate } = useReactMessage();

  const keys = Object.keys(reactionsByEmoji);

  const handleEmojiClick = (emoji: string) => {
    mutate({ id: message._id, emoji });
    hideEmoji();
  };

  return (
    <div
      className={cn(
        'mt-0.5 flex h-5',
        isMe ? 'justify-end' : 'justify-start pl-7',
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
            <AlertDialogTitle>
              {t('CONVERSATION.MESSAGE_REACTION')}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <Tabs value={tabValue} className="w-full px-3">
            <TabsList className="justify-start">
              <TabsTrigger
                value="all"
                onClick={() => setTabValue('all')}
                className="w-16 !rounded-none"
              >
                {t('COMMON.ALL')}
              </TabsTrigger>
              {keys.map((key) => {
                const react = reactionsByEmoji[key][0];
                return (
                  <TabsTrigger
                    key={key}
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
          <div className="max-h-64 overflow-y-auto">
            {tabValue === 'all' ? (
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
            ) : (
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
            <AlertDialogAction>{t('COMMON.CLOSE')}</AlertDialogAction>
          </AlertDialogFooter>
          <div className="pointer-events-auto absolute -bottom-3 flex w-full translate-y-full justify-center rounded-full shadow-1 md:shadow-none">
            <MessageEmojiPicker
              onClickMore={() => {
                openEmoji();
              }}
              messageId={message._id}
            />
          </div>
          <Drawer open={showEmoji} onOpenChange={changeShowEmoji}>
            <DrawerContent>
              <div className="custom-emoji-picker flex justify-center">
                <EmojiPicker
                  theme="light"
                  onEmojiSelect={(emoji: any) => {
                    handleEmojiClick(emoji.native);
                  }}
                  skinTonePosition="none"
                  previewPosition="none"
                />
              </div>
            </DrawerContent>
          </Drawer>
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
  const { t } = useTranslation('common');
  const user = useAuthStore((state) => state.user);
  return (
    <div
      onClick={props.onClick}
      className="flex h-5 cursor-pointer items-center justify-center rounded-full border border-neutral-50 bg-white"
    >
      <Tooltip>
        <TooltipContent className="rounded-2xl">
          {reactions.map((reaction) => (
            <div key={reaction.user._id} className="flex items-center">
              <span className="mx-[2px] text-sm">
                {reaction.user._id === user?._id
                  ? t('CONVERSATION.YOU')
                  : reaction.user.name}
              </span>
            </div>
          ))}
        </TooltipContent>
        <TooltipTrigger className="flex h-fit items-center">
          <span className="mx-[2px] inline-block text-xs">
            {reactions[0].emoji}
          </span>
        </TooltipTrigger>
      </Tooltip>
      <span className="mx-[2px] mr-1 text-xs text-neutral-600">
        {reactions.length}
      </span>
    </div>
  );
};
