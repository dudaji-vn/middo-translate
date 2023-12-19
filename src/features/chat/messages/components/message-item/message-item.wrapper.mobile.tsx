import { Copy, Forward, Pin, Reply, TrashIcon } from 'lucide-react';

import { LongPressMenu } from '@/components/actions/long-press-menu';
import { PropsWithChildren } from 'react';

export interface MessageItemMobileWrapperProps {}

export const MessageItemMobileWrapper = ({
  children,
}: MessageItemMobileWrapperProps & PropsWithChildren) => {
  return (
    <LongPressMenu>
      <LongPressMenu.Trigger>{children}</LongPressMenu.Trigger>
      <LongPressMenu.Menu>
        <LongPressMenu.Item title="Copy">
          <Copy />
        </LongPressMenu.Item>
        <LongPressMenu.Item title="Forward">
          <Forward />
        </LongPressMenu.Item>
        <LongPressMenu.Item title="Reply">
          <Reply />
        </LongPressMenu.Item>
        <LongPressMenu.Item title="Pin">
          <Pin />
        </LongPressMenu.Item>
        <LongPressMenu.Item color="error" title="Remove">
          <TrashIcon />
        </LongPressMenu.Item>
      </LongPressMenu.Menu>
    </LongPressMenu>
  );
};
