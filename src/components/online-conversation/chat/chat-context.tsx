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
import { pusherClient } from '@/lib/pusher-client';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/stores/session';

type ChatContext = {
  room: Room;
  user: Participant;
  showSideChat: boolean;
  openSideChat: () => void;
  closeSideChat: () => void;
};

export const ChatContext = createContext<ChatContext>({
  room: {} as Room,
  user: {} as Participant,
  showSideChat: true,
  openSideChat: () => {},
  closeSideChat: () => {},
});

export const useChat = () => {
  return useContext(ChatContext);
};
interface ChatProviderProps extends PropsWithChildren {
  roomCode: string;
}

export const ChatProvider = ({ children, roomCode }: ChatProviderProps) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [showSideChat, setShowSideChat] = useState(true);

  const openSideChat = () => {
    setShowSideChat(true);
  };

  const closeSideChat = () => {
    setShowSideChat(false);
  };

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

  useEffect(() => {
    window.addEventListener('resize', () => {
      // We execute the same script as before
      let vh = window.innerHeight * 0.01;
      const element = document.getElementsByClassName('chatScreenWrapper')[0];
      if (!element) return;
      element.setAttribute('style', `height: calc(${vh}px * 100)`);
      // document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

  if (!room) {
    return null;
  }

  return (
    <ChatContext.Provider
      value={{
        user,
        room,
        showSideChat,
        openSideChat,
        closeSideChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
