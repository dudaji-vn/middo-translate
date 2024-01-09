import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import React, {
  Fragment,
  PropsWithChildren,
  cloneElement,
  useMemo,
} from 'react';
import { actionItems, useMessageActions } from '../message.actions';

import { Button } from '@/components/actions';
import { LongPressMenu } from '@/components/actions/long-press-menu';
import { MoreVerticalIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/stores/app.store';
import { useMessageItem } from '.';

export interface MessageItemWrapperProps {}

export const MessageItemWrapper = (
  props: MessageItemWrapperProps & PropsWithChildren,
) => {
  const isMobile = useAppStore((state) => state.isMobile);

  const { isMe, message } = useMessageItem();

  const { onAction } = useMessageActions();

  const items = useMemo(() => {
    const itemFiltered: any[] = [];
    actionItems.forEach((item) => {
      if (item.action === 'copy' && message.type !== 'text') return;
      itemFiltered.push({
        ...item,
        onAction: () =>
          onAction({
            action: item.action,
            message,
            isMe,
          }),
      });
    });
    return itemFiltered;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMe, message]);

  const Wrapper = useMemo(() => {
    if (message.status === 'removed') return Fragment;
    if (isMobile) return MobileWrapper;
    return DesktopWrapper;
  }, [isMobile, message.status]);

  return (
    <div className="relative">
      <Wrapper items={items}>{props.children}</Wrapper>
    </div>
  );
};

export interface MessageItemMobileWrapperProps {
  items: any[];
}

const MobileWrapper = ({
  children,
  items,
}: MessageItemMobileWrapperProps & PropsWithChildren) => {
  return (
    <LongPressMenu>
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
    </LongPressMenu>
  );
};

const DesktopWrapper = ({
  items,
  children,
}: PropsWithChildren & {
  items: any[];
}) => {
  const { isMe } = useMessageItem();

  return (
    <>
      {children}
      <div
        className={cn(
          'absolute top-1/2 hidden -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:block',
          isMe ? '-left-4 -translate-x-full' : '-right-4 translate-x-full',
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
      </div>
    </>
  );
};
