'use client';

import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Room } from '@/features/chat/rooms/types';
import { SOCKET_CONFIG } from '@/configs/socket';
import socket from '@/lib/socket-io';
import { useRouter } from 'next/navigation';
import { usePlatformStore } from '@/features/platform/stores';
import { useNetworkStatus } from '@/utils/use-network-status';
import { useAppStore } from '@/stores/app.store';
import { generateRoomDisplay } from '../utils';
import { useAuthStore } from '@/stores/auth.store';
import { useQueryClient } from '@tanstack/react-query';
import { inboxTabMap } from '../components/inbox/inbox';

interface ChatBoxContextProps {
  room: Room;
  updateRoom: (room: Partial<Room>) => void;
}

export const ChatBoxContext = createContext<ChatBoxContextProps>(
  {} as ChatBoxContextProps,
);

export const ChatBoxProvider = ({
  children,
  room: _room,
}: PropsWithChildren<{ room: Room }>) => {
  const notifyToken = usePlatformStore((state) => state.notifyToken);
  const currentUserId = useAuthStore((state) => state.user?._id);
  const { isOnline } = useNetworkStatus();
  const { socketConnected } = useAppStore();
  const queryClient = useQueryClient();
  const [room, setRoom] = useState<Room>(_room);
  const roomDisplay = useMemo(
    () =>
      generateRoomDisplay({
        room,
        currentUserId: currentUserId || '',
      }),
    [currentUserId, room],
  );
  const updateRoom = useCallback((room: Partial<Room>) => {
    setRoom((old) => ({ ...old, ...room }));
  }, []);
  const router = useRouter();
  // socket events
  const handleForceLeaveRoom = useCallback(
    (roomId: string) => {
      if (roomId !== room._id) return;
      router.replace('/talk');
    },
    [room._id, router],
  );
  const handleDeleteContact = useCallback(
    (_room: Partial<Room>) => {
      Object.keys(inboxTabMap).forEach((tab) => {
        queryClient.invalidateQueries(['rooms', tab]);
      });
      if (room._id !== _room._id) return;
      setRoom((old) => ({ ...old, ..._room }));
    },
    [queryClient, room._id],
  );

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
    socket.on(SOCKET_CONFIG.EVENTS.ROOM.UPDATE, updateRoom);
    socket.on(SOCKET_CONFIG.EVENTS.ROOM.DELETE, handleForceLeaveRoom);
    socket.on(SOCKET_CONFIG.EVENTS.ROOM.LEAVE, handleForceLeaveRoom);
    socket.on(SOCKET_CONFIG.EVENTS.ROOM.DELETE_CONTACT, handleDeleteContact);
    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.ROOM.UPDATE, updateRoom);
      socket.off(SOCKET_CONFIG.EVENTS.ROOM.DELETE);
      socket.off(SOCKET_CONFIG.EVENTS.ROOM.LEAVE);
      socket.off(SOCKET_CONFIG.EVENTS.ROOM.DELETE_CONTACT);
    };
  }, [handleDeleteContact, handleForceLeaveRoom, room._id, updateRoom]);

  return (
    <ChatBoxContext.Provider
      value={{
        room: roomDisplay,
        updateRoom,
      }}
    >
      {children}
    </ChatBoxContext.Provider>
  );
};

export const useChatBox = () => {
  const context = useContext(ChatBoxContext);
  if (!context) {
    throw new Error('useChatBox must be used within ChatBoxProvider');
  }
  return context;
};
