'use client';

import { Message, Room } from '@/types/room';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { SOCKET_CONFIG } from '@/configs/socket';
import socket from '@/lib/socket-io';

type BoxChatContext = {
  messages: Message[];
};

export const BoxChatContext = createContext<BoxChatContext>({
  messages: [],
});

export const useBoxChat = () => {
  return useContext(BoxChatContext);
};
interface BoxChatProviderProps extends PropsWithChildren {}

export const BoxChatProvider = ({ children }: BoxChatProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on(SOCKET_CONFIG.EVENTS.MESSAGE.NEW, (message: Message) => {
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.MESSAGE.NEW);
    };
  }, []);

  return (
    <BoxChatContext.Provider
      value={{
        messages,
      }}
    >
      {children}
    </BoxChatContext.Provider>
  );
};
