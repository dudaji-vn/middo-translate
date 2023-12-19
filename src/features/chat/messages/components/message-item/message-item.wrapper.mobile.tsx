import { actionItems, useMessageActions } from '../message.actions';

import { LongPressMenu } from '@/components/actions/long-press-menu';
import { PropsWithChildren } from 'react';
import { useMessageItem } from '.';

export interface MessageItemMobileWrapperProps {}

export const MessageItemMobileWrapper = ({
  children,
}: MessageItemMobileWrapperProps & PropsWithChildren) => {
  const { isMe, message } = useMessageItem();
  const { onAction } = useMessageActions();
  return (
    <LongPressMenu>
      <LongPressMenu.Trigger>{children}</LongPressMenu.Trigger>
      <LongPressMenu.Menu>
        {actionItems.map((item) => (
          <LongPressMenu.Item
            key={item.action}
            title={item.label}
            color={item.color === 'error' ? 'error' : 'default'}
            onClick={() => onAction(item.action, message._id, isMe)}
          >
            {item.icon}
          </LongPressMenu.Item>
        ))}
      </LongPressMenu.Menu>
    </LongPressMenu>
  );
};
