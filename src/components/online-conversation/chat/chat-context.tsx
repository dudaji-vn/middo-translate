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
import { SOCKET_CONFIG } from '@/configs/socket';
import { getRoomSetting } from '@/utils/local-storage';
import socket from '@/lib/socket-io';
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
  isShowFull: boolean;
  setIsShowFull: (isShowFull: boolean) => void;
  isQuickSend: boolean;
  setIsQuickSend: (isQuickSend: boolean) => void;
};

export const ChatContext = createContext<ChatContext>({
  room: {} as Room,
  user: {} as Participant,
  showSideChat: true,
  openSideChat: () => {},
  closeSideChat: () => {},
  isTranslatePopupOpen: false,
  setIsTranslatePopupOpen: () => {},
  isShowFull: false,
  setIsShowFull: () => {},
  isQuickSend: false,
  setIsQuickSend: () => {},
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

  const [isShowFull, setIsShowFull] = useState(false);

  const [isQuickSend, setIsQuickSend] = useState(false);

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

    socket.emit(SOCKET_CONFIG.EVENTS.ROOM.JOIN, joinPayload);
    socket.on(SOCKET_CONFIG.EVENTS.ROOM.JOIN, (room: Room) => {
      setRoom(room);
    });

    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.ROOM.JOIN);
      socket.emit(SOCKET_CONFIG.EVENTS.ROOM.LEAVE, roomCode);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info, roomCode]);

  useEffect(() => {
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01;
      const element = document.getElementsByClassName('chatScreenWrapper')[0];
      if (!element) return;
      element.setAttribute('style', `height: calc(${vh}px * 100)`);
    });
    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

  useEffect(() => {
    const { isShowFull, isQuickSend } = getRoomSetting();
    setIsShowFull(isShowFull || false);
    setIsQuickSend(isQuickSend || false);
  }, []);

  if (!room || !user) {
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
        isTranslatePopupOpen,
        setIsTranslatePopupOpen,
        isShowFull,
        setIsShowFull,
        isQuickSend,
        setIsQuickSend,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
