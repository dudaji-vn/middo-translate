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
import { useTranslation } from 'react-i18next';
export interface PinnedBarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const PinnedBar = forwardRef<HTMLDivElement, PinnedBarProps>(
  (props, ref) => {
    const roomId = useRoomId();
    const { data } = useGetPinnedMessages({ roomId });
    const queryClient = useQueryClient();
    const { toggleTab, currentSide } = useRoomSidebarTabs();
    const isShowPinned = currentSide === 'pinned';
    const {t} = useTranslation('common')
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
          isShowPinned ? 'hidden' : 'flex items-center border-b px-3 py-1 dark:border-neutral-800'
        }
      >
        <PinIcon className="size-4 text-neutral-600 dark:text-neutral-50" />
        <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-50">
          {data?.length > 1 ? t('CONVERSATION.PINED_MESSAGE', {num: data?.length || 0}) : t('CONVERSATION.PINED_MESSAGES', {num: data?.length || 0})}
        </span>
        <ViewPinButton />
      </div>
    );
  },
);
PinnedBar.displayName = 'PinnedBar';
