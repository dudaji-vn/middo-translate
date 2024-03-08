'use client';

import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Room } from '@/features/chat/rooms/types';
import { SOCKET_CONFIG } from '@/configs/socket';
import socket from '@/lib/socket-io';
import { useRouter } from 'next/navigation';
import { usePlatformStore } from '@/features/platform/stores';
import { useNetworkStatus } from '@/utils/use-network-status';

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
  const { isOnline } = useNetworkStatus();

  const [room, setRoom] = useState<Room>(_room);
  const updateRoom = useCallback((room: Partial<Room>) => {
    setRoom((old) => ({ ...old, ...room }));
  }, []);
  const router = useRouter();

  // socket events

  const handleForceLeaveRoom = useCallback(
    (roomId: string) => {
      if (roomId === room._id) {
        router.push('/talk');
      }
    },
    [room._id, router],
  );
  useEffect(() => {
    if (isOnline) {
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
  }, [notifyToken, room._id, isOnline]);

  useEffect(() => {
    socket.on(SOCKET_CONFIG.EVENTS.ROOM.UPDATE, updateRoom);
    socket.on(SOCKET_CONFIG.EVENTS.ROOM.DELETE, handleForceLeaveRoom);
    socket.on(SOCKET_CONFIG.EVENTS.ROOM.LEAVE, handleForceLeaveRoom);
    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.ROOM.UPDATE, updateRoom);
      socket.off(SOCKET_CONFIG.EVENTS.ROOM.DELETE);
      socket.off(SOCKET_CONFIG.EVENTS.ROOM.LEAVE);
    };
  }, [handleForceLeaveRoom, room._id, updateRoom]);

  return (
    <ChatBoxContext.Provider value={{ room, updateRoom }}>
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
