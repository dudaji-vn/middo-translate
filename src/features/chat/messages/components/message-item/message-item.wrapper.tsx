import React, { PropsWithChildren } from 'react';

import { MessageItemMobileWrapper } from './message-item.wrapper.mobile';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/stores/app.store';
import { useMessageItem } from '.';

export interface MessageItemWrapperProps {}

export const MessageItemWrapper = (
  props: MessageItemWrapperProps & PropsWithChildren,
) => {
  const isMobile = useAppStore((state) => state.isMobile);

  const { isMe, isPending, message } = useMessageItem();

  const Wrapper =
    isMobile && message.status !== 'removed'
      ? MessageItemMobileWrapper
      : React.Fragment;

  return (
    <Wrapper>
      <div
        className={cn(
          'group relative flex',
          isMe ? 'justify-end pl-11 md:pl-20' : 'pr-11 md:pr-20',
          isPending && 'opacity-50',
        )}
      >
        {props.children}
      </div>
    </Wrapper>
  );
};
