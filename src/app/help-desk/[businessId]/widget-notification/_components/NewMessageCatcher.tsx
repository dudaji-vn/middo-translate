'use client';

import Ping from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces/ping/ping';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useGetRoomData } from '@/features/business-spaces/hooks/use-get-chat-room';
import { Message } from '@/features/chat/messages/types';
import { Room } from '@/features/chat/rooms/types';
import { usePlatformStore } from '@/features/platform/stores';
import socket from '@/lib/socket-io';
import { useAppStore } from '@/stores/app.store';
import { useNetworkStatus } from '@/utils/use-network-status';
import { User } from '@sentry/nextjs';
import React, { useEffect } from 'react';

const NewMessageCatcher = ({
  room,
  anonymousUser,
  onRoomEnd,
}: {
  room: Room;
  anonymousUser?: User;
  onRoomEnd: () => void;
}) => {
  const [isClient, setIsClient] = React.useState(false);
  const [showPing, setShowPing] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const notifyToken = usePlatformStore((state) => state.notifyToken);
  const currentUserId = anonymousUser?._id;
  const { isOnline } = useNetworkStatus();
  const { socketConnected } = useAppStore();

  // socket events

  useEffect(() => {
    if (socketConnected) {
      socket.emit(SOCKET_CONFIG.EVENTS.CHAT.JOIN, {
        roomId: room._id,
        notifyToken,
      });
    }

    return () => {
      socket.emit(SOCKET_CONFIG.EVENTS.CHAT.LEAVE, {
        roomId: room._id,
        notifyToken,
      });
    };
  }, [notifyToken, room._id, isOnline, socketConnected]);

  useEffect(() => {
    socket.on(
      SOCKET_CONFIG.EVENTS.MESSAGE.UPDATE,
      (message: { readBy: string[]; _id: string }) => {
        console.log('Ping The update message', message);
        const { readBy } = message || { readBy: [] };
        if (readBy?.includes(currentUserId)) {
          setShowPing(false);
        }
      },
    );
    socket.on(
      SOCKET_CONFIG.EVENTS.MESSAGE.NEW,
      ({
        clientTempId,
        message,
      }: {
        message: Message;
        clientTempId: string;
      }) => {
        if (message.action === 'leaveHelpDesk') {
          setShowPing(false);
          onRoomEnd();
        }
        if (message.senderType !== 'anonymous') setShowPing(true);
      },
    );
    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.MESSAGE.NEW);
      socket.off(SOCKET_CONFIG.EVENTS.MESSAGE.UPDATE);
    };
  }, [room._id]);

  useEffect(() => {
    if (showPing) window.parent.postMessage('ping', '*');
    else window.parent.postMessage('no-ping', '*');
  }, [showPing]);
  return null;
};

export default NewMessageCatcher;
