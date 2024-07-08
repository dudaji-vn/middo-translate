import { Button } from '@/components/actions';
import { LongPressMenu } from '@/components/actions/long-press-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/data-display';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/data-display/popover';
import { CUSTOM_EVENTS } from '@/configs/custom-event';
import { listenEvent } from '@/features/call/utils/custom-event.util';
import { formatTimeDisplay } from '@/features/chat/rooms/utils';
import { usePlatformStore } from '@/features/platform/stores';
import { useBusinessNavigationData } from '@/hooks';
import { useTranslatedFromText } from '@/hooks/use-translated-from-text';
import { useAppStore } from '@/stores/app.store';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/utils/cn';
import EmojiPicker from '@emoji-mart/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock9Icon, MoreVerticalIcon, SmilePlusIcon } from 'lucide-react';
import moment from 'moment';
import {
  cloneElement,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { isMobile as isMobileDevice } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { useBoolean, useOnClickOutside } from 'usehooks-ts';
import { MessageItem } from '.';
import { useReactMessage } from '../../hooks';
import { Message } from '../../types';
import {
  actionItems,
  MessageActionItem,
  useMessageActions,
} from '../message-actions';
import {
  EMOJI_LANG_SUPPORT,
  MessageEmojiPicker,
} from '../message-emoji-picker';

const MAX_TIME_CAN_EDIT = 15 * 60 * 1000; // 5 minutes

export interface MessageItemWrapperProps {
  isMe: boolean;
  message: Message;
  setActive: (active: boolean) => void;
  discussionDisabled?: boolean;
  reactionDisabled?: boolean;
  actionsDisabled?: boolean;
  showTime?: boolean;
  showDetail?: boolean;
  hideDetail?: () => void;
  toggleDetail?: () => void;
  setIsMenuOpen?: (isOpen: boolean) => void;
  isMenuOpen?: boolean;
}

const MessageDetail = ({
  isMe,
  message,
  translatedFrom,
  showTime,
  showDetail,
}: {
  isMe: boolean;
  translatedFrom: string;
  showTime?: boolean;
  message: Message;
  showDetail?: boolean;
}) => {
  return (
    <AnimatePresence>
      {showDetail && (
        <motion.div
          layout
          initial={{
            opacity: 0,
            height: 0,
          }}
          animate={{
            opacity: 1,
            height: 'auto',
          }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.1 }}
          className={cn(
            'my-1 flex items-center gap-1 text-xs text-neutral-500',
            isMe ? 'justify-end' : 'justify-start',
          )}
        >
          {translatedFrom && (
            <span className="font-light">{translatedFrom}</span>
          )}
          {!showTime && translatedFrom && <span> • </span>}
          {!showTime && (
            <>
              <span className={cn(' flex items-center gap-1 font-light ')}>
                {formatTimeDisplay(message.createdAt!)}
              </span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MessageItemWrapper = ({
  actionsDisabled,
  reactionDisabled,
  showDetail,
  hideDetail,
  toggleDetail,
  ...props
}: MessageItemWrapperProps & PropsWithChildren) => {
  const isMobile = useAppStore((state) => state.isMobile);
  const isMobilePlatform = usePlatformStore(
    (state) => state.platform === 'mobile',
  );
  const { isOnBusinessChat, isOnHelpDeskChat } = useBusinessNavigationData();
  const { user } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMe, message, setActive, discussionDisabled, showTime } = props;
  const ref = useRef<HTMLDivElement | null>(null);

  const translatedFrom = useTranslatedFromText({
    languageCode: message.language,
  });

  useOnClickOutside(
    ref,
    (() => {
      if (isMenuOpen) return;
      hideDetail?.();
    }) || (() => {}),
  );

  const { onAction, message: activeMessage, action } = useMessageActions();
  const isActive = activeMessage?._id === message._id;

  const items = useMemo(() => {
    const isViewOriginal = action === 'view-original';
    return actionItems
      .filter((item) => {
        switch (item.action) {
          case 'copy':
            return message.type === 'text';
          case 'view-original':
          case 'copy-original':
            return message.type === 'text' && !isViewOriginal && !isMe;
          case 'view-translated':
          case 'copy-translated':
            return message.type === 'text' && isViewOriginal && isActive;
          case 'forward':
            return (
              message.type !== 'call' && !isOnBusinessChat && !isOnHelpDeskChat
            );
          case 'pin':
            if (isOnBusinessChat || isOnHelpDeskChat) return false;
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
            return message.isPinned && !isOnBusinessChat && !isOnHelpDeskChat;
          case 'reply':
            return (
              !discussionDisabled && !isOnBusinessChat && !isOnHelpDeskChat
            );
          case 'download':
            if (
              isMobilePlatform &&
              message.type === 'media' &&
              message?.media?.[0].type === 'document'
            )
              return false;
            return message.type === 'media';
          case 'browser':
            if (
              isMobilePlatform &&
              message.type === 'media' &&
              message?.media?.[0].type === 'document'
            )
              return true;
            return false;
          case 'edit':
            const timeDiff = moment().diff(message.createdAt);
            return (
              message.type === 'text' && timeDiff < MAX_TIME_CAN_EDIT && isMe
            );

          case 'remove': {
            if (isOnBusinessChat && message.sender._id !== user?._id)
              return false;
            if (isOnHelpDeskChat && message.senderType !== 'anonymous')
              return false;
            return true;
          }
          default:
            return true;
        }
      })
      .map((item) => ({
        ...item,
        onAction: () =>
          onAction({
            action:
              item.action === 'copy' && isViewOriginal
                ? 'copy-original'
                : item.action,
            message,
            isMe,
          }),
      }));
  }, [
    action,
    discussionDisabled,
    isMe,
    isMobilePlatform,
    isOnBusinessChat,
    isOnHelpDeskChat,
    message,
    onAction,
    user?._id,
    isActive,
  ]);

  const Wrapper = useMemo(() => {
    // console.log('isMobileDevice', );
    if (message.status === 'removed') return RemovedWrapper;

    if (isOnHelpDeskChat) {
      return isMobileDevice ? MobileWrapper : DesktopWrapper;
    }
    if (isMobile) return MobileWrapper;
    return DesktopWrapper;
  }, [isMobile, message.status, isOnHelpDeskChat]);

  useEffect(() => {
    if (showDetail) {
      setTimeout(() => {
        if (!ref?.current) return;
        ref?.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }, 200);
    }
  }, [showDetail]);

  if (actionsDisabled) {
    return (
      <div
        className="relative h-fit cursor-pointer transition-all duration-300"
        onClick={() => {
          !isMenuOpen && toggleDetail?.();
        }}
      >
        {props.children}
        {message.status !== 'removed' && (
          <MessageDetail
            isMe={isMe}
            message={message}
            showTime={showTime}
            showDetail={showDetail}
            translatedFrom={translatedFrom}
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col', isMe ? 'items-end' : 'items-start')}>
      <div
        ref={ref}
        className="relative cursor-pointer"
        onClick={() => {
          !isMenuOpen && toggleDetail?.();
        }}
      >
        <Wrapper
          setActive={setActive}
          isMe={isMe}
          message={message}
          items={items}
          reactionDisabled={reactionDisabled}
          hideDetail={hideDetail}
          setIsMenuOpen={setIsMenuOpen}
          isMenuOpen={isMenuOpen}
        >
          {props.children}
        </Wrapper>
      </div>
      {message.status !== 'removed' && (
        <MessageDetail
          isMe={isMe}
          message={message}
          showTime={showTime}
          showDetail={showDetail}
          translatedFrom={translatedFrom}
        />
      )}
    </div>
  );
};
type Item = MessageActionItem & {
  onAction: () => void;
};
export type MessageItemMobileWrapperProps = {
  items: Item[];
} & MessageItemWrapperProps &
  PropsWithChildren;

const MobileWrapper = ({
  children,
  items,
  isMe,
  message,
  reactionDisabled,
  setActive,
  setIsMenuOpen,
}: MessageItemMobileWrapperProps) => {
  const { value, setValue, setFalse } = useBoolean(false);

  const { t } = useTranslation('common');
  const theme = useAppStore((state) => state.theme);
  const {
    setFalse: hideEmoji,
    value: showEmoji,
    setValue: changeShowEmoji,
    setTrue: openEmoji,
  } = useBoolean(false);
  const language = useAppStore((state) => state.language);
  const { value: isDisableLongPress, setValue: changeDisableLongPress } =
    useBoolean(false);

  const { mutateAsync } = useReactMessage();
  const handleEmojiClick = async (emoji: string) => {
    await mutateAsync({ id: message._id, emoji });
    hideEmoji();
  };
  // console.log('message', message);
  const translatedFrom = useTranslatedFromText({
    languageCode: message.language,
  });

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    if (message.type === 'media' && message?.media?.[0].type === 'video') {
      cleanup = listenEvent(
        CUSTOM_EVENTS.MESSAGE.CHANGE_ALLOW_LONG_PRESS +
          message?.media?.[0]?.url,
        (event: { detail: boolean }) => {
          changeDisableLongPress(event.detail);
        },
      );
    }
    return () => {
      cleanup && cleanup();
    };
  }, [changeDisableLongPress, message._id, message?.media, message.type]);

  return (
    <>
      <LongPressMenu
        isOpen={value}
        hasBackdrop={false}
        isDisabled={isDisableLongPress}
        onOpenChange={(isOpen) => {
          setValue(isOpen);
          setActive(isOpen);
          setIsMenuOpen?.(isOpen);
        }}
      >
        <LongPressMenu.Trigger>{children}</LongPressMenu.Trigger>
        <LongPressMenu.Menu
          outsideComponent={
            <div className="w-full px-3 py-2">
              {translatedFrom && (
                <span
                  className={cn(
                    'mb-1  mt-1 block text-xs text-white drop-shadow-2xl',
                    isMe ? 'text-end' : 'pl-7 text-start',
                  )}
                >
                  {translatedFrom}
                </span>
              )}
              <span
                className={cn(
                  'mb-2 flex items-center pl-8 text-xs text-white',
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
              {!reactionDisabled && (
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
              )}
            </div>
          }
        >
          {items.map((item) => (
            <LongPressMenu.Item
              key={item.action}
              startIcon={item.icon}
              color={item.color === 'error' ? 'error' : 'default'}
              onClick={item.onAction}
              className="dark:hover:bg-neutral-900"
            >
              {t(item.label)}
            </LongPressMenu.Item>
          ))}
        </LongPressMenu.Menu>
      </LongPressMenu>
      {showEmoji && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex flex-col bg-neutral-200/80 backdrop-blur-md">
          <div
            className="w-full flex-1"
            onClick={() => changeShowEmoji(false)}
          ></div>
          <motion.div
            initial={{ opacity: 0, top: 200 }}
            animate={{
              opacity: 1,
              top: 0,
              transition: {
                delay: 0,
              },
            }}
            exit={{ opacity: 0, top: 200 }}
            className="relative flex items-center justify-center overflow-hidden rounded-tl-3xl rounded-tr-3xl border-t border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900"
          >
            <EmojiPicker
              locale={EMOJI_LANG_SUPPORT.includes(language) ? language : 'en'}
              theme={theme || 'light'}
              onEmojiSelect={(emoji: any) => {
                handleEmojiClick(emoji.native);
              }}
              skinTonePosition="none"
              previewPosition="none"
            />
          </motion.div>
        </div>
      )}
    </>
  );
};

const DesktopWrapper = ({
  items,
  children,
  isMe,
  reactionDisabled,
  message,
  setIsMenuOpen,
  isMenuOpen,
}: MessageItemMobileWrapperProps) => {
  const { setFalse, value, setValue } = useBoolean(false);
  const isOnHelpDeskChat = useBusinessNavigationData().isOnHelpDeskChat;
  const { t } = useTranslation('common');
  return (
    <>
      {children}
      <div
        className={cn(
          'absolute top-1/2 hidden -translate-y-1/2 gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:flex',
          isMe
            ? '-left-2 -translate-x-full'
            : '-right-2 translate-x-full flex-row-reverse',
          isMenuOpen && 'opacity-100',
          isOnHelpDeskChat && 'visible !flex',
        )}
      >
        <DropdownMenu onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button.Icon size="ss" variant="ghost" color="default">
              <MoreVerticalIcon />
            </Button.Icon>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="dark:border-neutral-800 dark:bg-neutral-900">
            {items.map((item) => (
              <>
                <DropdownMenuItem
                  disabled={item.disabled}
                  key={item.action}
                  onClick={(e) => {
                    e.stopPropagation();
                    item.onAction();
                  }}
                  className="dark:hover:bg-neutral-800"
                >
                  {cloneElement(item.icon, {
                    size: 16,
                    className: cn('mr-2', item.color && `text-${item.color}`),
                  })}

                  <span className={cn(item.color && `text-${item.color}`)}>
                    {t(item.label)}
                  </span>
                </DropdownMenuItem>
                {item.separator && <DropdownMenuSeparator />}
              </>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {!reactionDisabled && (
          <Popover
            open={value}
            onOpenChange={(open) => {
              setValue(open);
              setIsMenuOpen?.(open);
            }}
          >
            <PopoverTrigger onClick={(e) => e.stopPropagation()} asChild>
              <Button.Icon size="ss" variant="ghost" color="default">
                <SmilePlusIcon />
              </Button.Icon>
            </PopoverTrigger>
            <PopoverContent
              align={isMe ? 'end' : 'start'}
              className={cn(
                'w-fit border-none !bg-transparent p-0 shadow-none',
              )}
            >
              <MessageEmojiPicker
                align={isMe ? 'end' : 'start'}
                onEmojiClick={() => {
                  setIsMenuOpen?.(false);
                  setFalse();
                }}
                messageId={message._id}
              />
            </PopoverContent>
          </Popover>
        )}
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
        discussionDisabled
        actionsDisabled
        className={cn(
          'relative  max-h-[250px] overflow-hidden',
          value && 'message-blur rounded-b-none',
        )}
      />
    </div>
  );
};
