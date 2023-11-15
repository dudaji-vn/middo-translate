'use client';

import { Participant, Room } from '@/types/room';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { redirect, useRouter } from 'next/navigation';

import { ROUTE_NAMES } from '@/configs/route-name';
import { getConversation } from '@/services/conversation';
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
  room: Room;
}

export const ChatProvider = ({ children, room: _room }: ChatProviderProps) => {
  const [room, setRoom] = useState<Room>(_room);
  const router = useRouter();
  const { sessionId } = useSessionStore();
  const user = room.participants.find((user) => user.socketId === sessionId)!;

  // if (!user) {
  //   setTimeout(() => {
  //     redirect(ROUTE_NAMES.ONLINE_CONVERSATION_JOIN + '/' + room.code);
  //   }, 1000);
  //   return null;
  // }

  return (
    <ChatContext.Provider
      value={{
        room,
        user,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
