import { roomActionItems, useRoomActions } from '../room.actions';

import { LongPressMenu } from '@/components/actions/long-press-menu';
import { PropsWithChildren } from 'react';
import { useInboxItem } from './inbox-item';

export interface InboxItemMobileWrapperProps {}

export const InboxItemMobileWrapper = ({
  children,
}: InboxItemMobileWrapperProps & PropsWithChildren) => {
  const { data } = useInboxItem();
  const { onAction } = useRoomActions();

  return (
    <>
      <LongPressMenu>
        <LongPressMenu.Trigger className="w-full">
          {children}
        </LongPressMenu.Trigger>
        <LongPressMenu.Menu>
          {roomActionItems.map((item) => (
            <LongPressMenu.Item
              key={item.action}
              title={item.label}
              color={item.color === 'error' ? 'error' : 'default'}
              onClick={() => onAction(item.action, data._id)}
            >
              {item.icon}
            </LongPressMenu.Item>
          ))}
        </LongPressMenu.Menu>
      </LongPressMenu>
    </>
  );
};
