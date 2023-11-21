'use client';

import { Message, Message as MessageType } from '@/types/room';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';

import { GroupMessage } from './message';
import socket from '@/lib/socket-io';
import { socketConfig } from '@/configs/socket';
import { useChat } from './chat-context';

export interface BoxChatProps extends React.HTMLAttributes<HTMLDivElement> {}

type GroupMessage = {
  messages: MessageType[];
  isMe?: boolean;
  useTranslate?: boolean;
};

export const BoxChat = forwardRef<HTMLDivElement, BoxChatProps>(
  (props, ref) => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const { room, user, isTranslatePopupOpen } = useChat();

    const refScroll = useRef<HTMLDivElement>(null);
    const groupMessages = useMemo(() => {
      if (messages.length === 0) return [];
      const groupMessages: GroupMessage[] = [];
      let currentGroupMessage: GroupMessage = {
        messages: [],
      };
      messages.forEach((message) => {
        if (currentGroupMessage.messages.length === 0) {
          currentGroupMessage.messages.push(message);
          currentGroupMessage.isMe = message.sender.socketId === socket.id;
          currentGroupMessage.useTranslate =
            message.sender.language !== user.language;
          return;
        }

        if (
          currentGroupMessage.messages[0].sender.socketId ===
          message.sender.socketId
        ) {
          currentGroupMessage.messages.push(message);
          return;
        }
        groupMessages.push(currentGroupMessage);
        currentGroupMessage = {
          messages: [message],
          isMe: message.sender.socketId === socket.id,
          useTranslate: message.sender.language !== user.language,
        };
      });

      groupMessages.push(currentGroupMessage);

      return groupMessages;
    }, [messages, user.language]);

    useEffect(() => {
      socket.on(socketConfig.events.message.new, (message: Message) => {
        console.log(message);
        setMessages((messages) => [...messages, message]);
      });

      return () => {
        socket.off(socketConfig.events.message.new);
      };
    }, []);

    useEffect(() => {
      if (refScroll?.current) {
        refScroll.current.scrollTo({
          top: refScroll.current.scrollHeight,
          behavior: 'instant',
        });
      }
    }, [groupMessages, ref, isTranslatePopupOpen]);

    return (
      <div ref={refScroll} className="chatFrame flex-1 gap-5 overflow-y-auto">
        {groupMessages.map((groupMessage, index) => (
          <GroupMessage key={index} {...groupMessage} />
        ))}
      </div>
    );
  },
);
BoxChat.displayName = 'BoxChat';
