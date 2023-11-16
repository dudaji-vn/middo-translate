'use client';

import { Participant, Room } from '@/types/room';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  getConversationWithUserSocketId,
  leaveConversation,
} from '@/services/conversation';

import { ROUTE_NAMES } from '@/configs/route-name';
import { Router } from 'next/router';
import { pusherClient } from '@/lib/pusher';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/stores/session';

type ChatContext = {
  room: Room;
  user: Participant;
};

export const ChatContext = createContext<ChatContext>({
  room: {} as Room,
  user: {} as Participant,
});

export const useChat = () => {
  return useContext(ChatContext);
};
interface ChatProviderProps extends PropsWithChildren {
  roomCode: string;
}

export const ChatProvider = ({ children, roomCode }: ChatProviderProps) => {
  const [room, setRoom] = useState<Room | null>(null);

  const router = useRouter();
  const { sessionId } = useSessionStore();
  useEffect(() => {
    getConversationWithUserSocketId(roomCode, sessionId).then((room) => {
      if (!room) {
        router.push(ROUTE_NAMES.ONLINE_CONVERSATION_JOIN + '/' + roomCode);
        return;
      }
      setRoom((prev) => ({ ...prev, ...room }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode, sessionId]);

  const user = room?.participants.find((user) => user.socketId === sessionId)!;

  useEffect(() => {
    if (!room?.code) return;
    const channel = pusherClient.subscribe(room.code);
    return () => {
      channel.unsubscribe();
    };
  }, [room?.code]);

  useEffect(() => {
    if (!room?.code || !user?.socketId) return;

    return () => {
      leaveConversation(room.code, user);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.code, user?.socketId]);

  if (!room) {
    return null;
  }
  return (
    <ChatContext.Provider
      value={{
        user,
        room,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
