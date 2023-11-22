'use client';

import { Message, Room } from '@/types/room';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import socket from '@/lib/socket-io';
import { socketConfig } from '@/configs/socket';

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
    socket.on(socketConfig.events.message.new, (message: Message) => {
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      socket.off(socketConfig.events.message.new);
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
