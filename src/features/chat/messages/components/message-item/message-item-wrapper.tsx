import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { MoreVerticalIcon, SmilePlusIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/data-display/popover';
import React, { PropsWithChildren, cloneElement, useMemo } from 'react';
import { actionItems, useMessageActions } from '../message-actions';

import { Button } from '@/components/actions';
import { LongPressMenu } from '@/components/actions/long-press-menu';
import { MessageEmojiPicker } from '../message-emoji-picker';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/stores/app.store';
import { useBoolean } from 'usehooks-ts';
import { Message } from '../../types';

export interface MessageItemWrapperProps {
  isMe: boolean;
  message: Message;
  setActive: (active: boolean) => void;
}

export const MessageItemWrapper = (
  props: MessageItemWrapperProps & PropsWithChildren,
) => {
  const isMobile = useAppStore((state) => state.isMobile);

  const { isMe, message, setActive } = props;

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
  return (
    <LongPressMenu
      isOpen={value}
      hasBackdrop={false}
      onOpenChange={(isOpen) => {
        setValue(isOpen);
        setActive(isOpen);
      }}
    >
      <LongPressMenu.Trigger>{children}</LongPressMenu.Trigger>
      <LongPressMenu.Menu>
        {items.map((item) => (
          <LongPressMenu.Item
            key={item.action}
            title={item.label}
            color={item.color === 'error' ? 'error' : 'default'}
            onClick={item.onAction}
          >
            {item.icon}
          </LongPressMenu.Item>
        ))}
      </LongPressMenu.Menu>

      {value && (
        <>
          <LongPressMenu.CloseTrigger className="fixed left-0 top-0 z-[99] h-screen w-screen" />
          <Popover open>
            <PopoverTrigger asChild>
              <div
                className={cn(
                  'absolute top-0 h-[1px] w-full -translate-y-[calc(100%_+_8px)]',
                )}
              ></div>
            </PopoverTrigger>
            <PopoverContent
              align={isMe ? 'end' : 'start'}
              className="w-fit -translate-y-full border-none bg-transparent p-0 shadow-none"
            >
              <MessageEmojiPicker
                onEmojiClick={() => {
                  setFalse();
                  setActive(false);
                }}
                messageId={message._id}
              />
            </PopoverContent>
          </Popover>
        </>
      )}
    </LongPressMenu>
  );
};

const DesktopWrapper = ({
  items,
  children,
  isMe,
  message,
}: MessageItemMobileWrapperProps) => {
  const { setFalse, value, setValue } = useBoolean(false);

  return (
    <>
      {children}
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
            <Button.Icon size="xs" variant="ghost" color="default">
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
                  {item.label}
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
            <Button.Icon size="xs" variant="ghost" color="default">
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
