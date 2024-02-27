'use client';

import { PinIcon } from 'lucide-react';
import { forwardRef, useEffect } from 'react';
import {
  PIN_MESSAGE_KEY,
  useGetPinnedMessages,
} from '../../hooks/use-get-pinned-messages';
import { useRoomId } from '../../hooks/use-roomId';
import { ViewPinButton } from '../view-pin-button';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useQueryClient } from '@tanstack/react-query';
import { useRoomSidebarTabs } from '../room-side/room-side-tabs/room-side-tabs.hook';
export interface PinnedBarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const PinnedBar = forwardRef<HTMLDivElement, PinnedBarProps>(
  (props, ref) => {
    const roomId = useRoomId();
    const { data } = useGetPinnedMessages({ roomId });
    const queryClient = useQueryClient();
    const { toggleTab, currentSide } = useRoomSidebarTabs();
    const isShowPinned = currentSide === 'pinned';
    useEffect(() => {
      socket.on(SOCKET_CONFIG.EVENTS.MESSAGE.PIN, () => {
        console.log([PIN_MESSAGE_KEY, roomId]);
        queryClient.invalidateQueries([PIN_MESSAGE_KEY, roomId]);
      });
      return () => {
        socket.off(SOCKET_CONFIG.EVENTS.MESSAGE.PIN);
      };
    }, [queryClient, roomId]);

    if (!data?.length) return <></>;
    return (
      <div
        ref={ref}
        {...props}
        className={
          isShowPinned ? 'hidden' : 'flex items-center border-b px-3 py-1'
        }
      >
        <PinIcon className="size-4 text-neutral-600" />
        <span className="ml-2 text-sm text-neutral-600">
          {data?.length || 0} pinned
          {data?.length > 1 ? ' messages' : ' message'}
        </span>
        <ViewPinButton />
      </div>
    );
  },
);
PinnedBar.displayName = 'PinnedBar';
