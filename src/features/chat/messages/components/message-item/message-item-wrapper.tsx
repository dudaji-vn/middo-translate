import { Button } from '@/components/actions';
import { LongPressMenu } from '@/components/actions/long-press-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { Drawer, DrawerContent } from '@/components/data-display/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/data-display/popover';
import { useAppStore } from '@/stores/app.store';
import { cn } from '@/utils/cn';
import EmojiPicker from '@emoji-mart/react';
import { Clock9Icon, MoreVerticalIcon, SmilePlusIcon } from 'lucide-react';
import moment from 'moment';
import {
  PropsWithChildren,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'usehooks-ts';
import { MessageItem } from '.';
import { useReactMessage } from '../../hooks';
import { Message } from '../../types';
import { actionItems, useMessageActions } from '../message-actions';
import { MessageEmojiPicker } from '../message-emoji-picker';
import { useTranslatedFromText } from '@/hooks/use-translated-from-text';

export interface MessageItemWrapperProps {
  isMe: boolean;
  message: Message;
  setActive: (active: boolean) => void;
  discussionDisabled?: boolean;
  disabledAllActions?: boolean;
}

export const MessageItemWrapper = ({
  disabledAllActions,
  ...props
}: MessageItemWrapperProps & PropsWithChildren) => {
  const isMobile = useAppStore((state) => state.isMobile);
  const { isMe, message, setActive, discussionDisabled } = props;

  const { onAction } = useMessageActions();

  const items = useMemo(() => {
    return actionItems
      .filter((item) => {
        switch (item.action) {
          case 'copy':
            return message.type === 'text';
          case 'forward':
            return message.type !== 'call';
          case 'pin':
            if (discussionDisabled) return false;
            if (message.isPinned) return false;
            if (message.type === 'call') return false;
            if (
              message.forwardOf &&
              (!message.content || !message.media?.length)
            )
              return false;
            return true;
          case 'unpin':
            return message.isPinned;
          case 'reply':
            return !discussionDisabled;
          default:
            return true;
        }
      })
      .map((item) => ({
        ...item,
        onAction: () =>
          onAction({
            action: item.action,
            message,
            isMe,
          }),
      }));
  }, [isMe, message, onAction]);

  const Wrapper = useMemo(() => {
    if (message.status === 'removed') return RemovedWrapper;
    if (isMobile) return MobileWrapper;
    return DesktopWrapper;
  }, [isMobile, message.status]);

  if (disabledAllActions) {
    return <div className="relative">{props.children}</div>;
  }

  return (
    <div className="relative">
      <Wrapper
        setActive={setActive}
        isMe={isMe}
        message={message}
        items={items}
      >
        {props.children}
      </Wrapper>
    </div>
  );
};

export type MessageItemMobileWrapperProps = {
  items: any[];
} & MessageItemWrapperProps &
  PropsWithChildren;

const MobileWrapper = ({
  children,
  items,
  isMe,
  message,
  setActive,
}: MessageItemMobileWrapperProps) => {
  const { value, setValue, setFalse } = useBoolean(false);

  const { t } = useTranslation('common');
  const {
    setFalse: hideEmoji,
    value: showEmoji,
    setValue: changeShowEmoji,
    setTrue: openEmoji,
  } = useBoolean(false);
  const { mutateAsync } = useReactMessage();
  const handleEmojiClick = async (emoji: string) => {
    await mutateAsync({ id: message._id, emoji });
    hideEmoji();
  };

  const translatedFrom = useTranslatedFromText({
    languageCode: message.language,
  });

  return (
    <>
      <LongPressMenu
        isOpen={value}
        hasBackdrop={false}
        onOpenChange={(isOpen) => {
          setValue(isOpen);
          setActive(isOpen);
        }}
      >
        <LongPressMenu.Trigger>{children}</LongPressMenu.Trigger>
        <LongPressMenu.Menu
          outsideComponent={
            <div className="w-full px-3 py-2">
              {translatedFrom && (
                <span
                  className={cn(
                    'mb-1  mt-1 block text-xs font-light text-white drop-shadow-2xl',
                    isMe ? 'text-end' : 'pl-7 text-start',
                  )}
                >
                  {translatedFrom}
                </span>
              )}
              <span
                className={cn(
                  'mb-2 flex items-center pl-8 pr-3 text-xs text-white',
                  isMe ? 'justify-end' : 'justify-start pl-7',
                )}
              >
                <Clock9Icon className="mr-1 inline-block size-3" />
                {moment(message.createdAt).format('lll')}
              </span>

              <div
                className={cn(
                  'pointer-events-none relative w-fit flex-1',
                  isMe ? 'ml-auto' : '',
                )}
              >
                <DisplayMessage isMe={isMe} message={message} />
              </div>
              <div className="pointer-events-auto">
                <MessageEmojiPicker
                  onClickMore={() => {
                    openEmoji();
                    setFalse();
                  }}
                  onEmojiClick={() => {
                    setFalse();
                    setActive(false);
                  }}
                  messageId={message._id}
                />
              </div>
            </div>
          }
        >
          {items.map((item) => (
            <LongPressMenu.Item
              key={item.action}
              startIcon={item.icon}
              color={item.color === 'error' ? 'error' : 'default'}
              onClick={item.onAction}
            >
              {t(item.label)}
            </LongPressMenu.Item>
          ))}
        </LongPressMenu.Menu>
      </LongPressMenu>
      <Drawer open={showEmoji} onOpenChange={changeShowEmoji}>
        <DrawerContent>
          <div
            data-vaul-no-drag
            className="custom-emoji-picker flex justify-center"
          >
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
    </>
  );
};

const DesktopWrapper = ({
  items,
  children,
  isMe,
  message,
}: MessageItemMobileWrapperProps) => {
  const { setFalse, value, setValue } = useBoolean(false);
  const { t } = useTranslation('common');
  const formattedDate = moment(message.createdAt).format('lll');
  const translatedFrom = useTranslatedFromText({
    languageCode: message.language,
  });
  return (
    <>
      <Tooltip
        triggerItem={children}
        title={
          translatedFrom
            ? translatedFrom + ' • ' + formattedDate
            : formattedDate
        }
        contentProps={{
          className: 'bg-black/60 text-white rounded-lg',
          align: isMe ? 'end' : 'start',
        }}
      />
      <div
        className={cn(
          'absolute top-1/2 hidden -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:flex',
          isMe
            ? '-left-4 -translate-x-full'
            : '-right-4 translate-x-full flex-row-reverse',
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button.Icon size="ss" variant="ghost" color="default">
              <MoreVerticalIcon />
            </Button.Icon>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {items.map((item) => (
              <DropdownMenuItem
                disabled={item.disabled}
                key={item.action}
                onClick={item.onAction}
              >
                {cloneElement(item.icon, {
                  size: 16,
                  className: cn('mr-2', item.color && `text-${item.color}`),
                })}

                <span className={cn(item.color && `text-${item.color}`)}>
                  {t(item.label)}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Popover
          open={value}
          onOpenChange={(open) => {
            setValue(open);
          }}
        >
          <PopoverTrigger asChild>
            <Button.Icon size="ss" variant="ghost" color="default">
              <SmilePlusIcon />
            </Button.Icon>
          </PopoverTrigger>
          <PopoverContent
            align={isMe ? 'end' : 'start'}
            className={cn('w-fit border-none !bg-transparent p-0 shadow-none')}
          >
            <MessageEmojiPicker
              align={isMe ? 'end' : 'start'}
              onEmojiClick={() => {
                setFalse();
              }}
              messageId={message._id}
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

const RemovedWrapper = ({ children, items }: MessageItemMobileWrapperProps) => {
  return <>{children}</>;
};

const DisplayMessage = ({
  isMe,
  message,
}: {
  isMe: boolean;
  message: Message;
}) => {
  const messageItemRef = useRef<HTMLDivElement>(null);
  const { value, setTrue, setFalse } = useBoolean(false);
  useEffect(() => {
    if (messageItemRef?.current) {
      setTimeout(() => {
        const clientHeight = messageItemRef?.current?.clientHeight;
        if (clientHeight !== undefined && clientHeight >= 250) setTrue();
        else setFalse();
      }, 200);
    }
  }, [setFalse, setTrue, message]);
  return (
    <div ref={messageItemRef} className={cn(!value && 'mb-2')}>
      <MessageItem
        isDraw
        sender={isMe ? 'me' : 'other'}
        showReactionBar={false}
        message={message}
        showAvatar={!isMe}
        disabledAllActions
        discussionDisabled
        className={cn(
          'relative  max-h-[250px] overflow-hidden',
          value && 'message-blur rounded-b-none',
        )}
      />
    </div>
  );
};
