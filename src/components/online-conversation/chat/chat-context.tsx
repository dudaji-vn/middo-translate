'use client';

import { Participant, Room } from '@/types/room';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { JoinRoomPayload } from '@/types/socket';
import { ROUTE_NAMES } from '@/configs/route-name';
import socket from '@/lib/socket-io';
import { socketConfig } from '@/configs/socket';
import { useConversationStore } from '@/stores/conversation';
import { useRouter } from 'next/navigation';

type ChatContext = {
  room: Room;
  user: Participant;
  showSideChat: boolean;
  openSideChat: () => void;
  closeSideChat: () => void;
  isTranslatePopupOpen: boolean;
  setIsTranslatePopupOpen: (isOpen: boolean) => void;
};

export const ChatContext = createContext<ChatContext>({
  room: {} as Room,
  user: {} as Participant,
  showSideChat: true,
  openSideChat: () => {},
  closeSideChat: () => {},
  isTranslatePopupOpen: false,
  setIsTranslatePopupOpen: () => {},
});

export const useChat = () => {
  return useContext(ChatContext);
};
interface ChatProviderProps extends PropsWithChildren {
  room: Room;
}

export const ChatProvider = ({ children, room: _room }: ChatProviderProps) => {
  const roomCode = _room.code;
  const [room, setRoom] = useState<Room>(_room);
  const user = room.participants.find((user) => user.socketId === socket.id);

  const { info } = useConversationStore();
  const [showSideChat, setShowSideChat] = useState(true);
  const [isTranslatePopupOpen, setIsTranslatePopupOpen] = useState(false);

  const openSideChat = () => {
    setShowSideChat(true);
  };

  const closeSideChat = () => {
    setShowSideChat(false);
  };

  const router = useRouter();

  useEffect(() => {
    if (!info) {
      router.push(ROUTE_NAMES.ONLINE_CONVERSATION_JOIN + '/' + roomCode);
      return;
    }

    const joinPayload: JoinRoomPayload = {
      roomCode,
      info,
    };

    socket.emit(socketConfig.events.room.join, joinPayload);
    socket.on(socketConfig.events.room.join, (room: Room) => {
      console.log('room', room);
      setRoom(room);
    });

    return () => {
      socket.off(socketConfig.events.room.join);
      socket.emit(socketConfig.events.room.leave, roomCode);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info, roomCode]);

  useEffect(() => {
    window.addEventListener('resize', () => {
      // We execute the same script as before
      let vh = window.innerHeight * 0.01;
      const element = document.getElementsByClassName('chatScreenWrapper')[0];
      if (!element) return;
      element.setAttribute('style', `height: calc(${vh}px * 100)`);
    });
    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

  if (!room || !user) {
    return <div>hello</div>;
  }

  return (
    <ChatContext.Provider
      value={{
        user,
        room,
        showSideChat,
        openSideChat,
        closeSideChat,
        isTranslatePopupOpen,
        setIsTranslatePopupOpen,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
