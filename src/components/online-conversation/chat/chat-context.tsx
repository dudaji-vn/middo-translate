'use client';

import { Participant, Room } from '@/types/room';
import { PropsWithChildren, createContext, useContext } from 'react';

import { ROUTE_NAMES } from '@/configs/route-name';
import { useRouter } from 'next/navigation';

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
const socketId = '132';
export const ChatProvider = ({ children, room }: ChatProviderProps) => {
  const router = useRouter();
  console.log(room);
  const user = room.participants.find((user) => user.socketId === socketId);
  if (!user) {
    setTimeout(() => {
      router.push(ROUTE_NAMES.ONLINE_CONVERSATION_JOIN + '/' + room.code);
    }, 1000);
    return <div></div>;
  }
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
