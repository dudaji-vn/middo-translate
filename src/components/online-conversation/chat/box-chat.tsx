'use client';

import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';

import { GroupMessage } from './message';
import { Message as MessageType } from '@/types/room';
import { pusherClient } from '@/lib/pusher';
import { useChat } from './chat-context';
import { useSessionStore } from '@/stores/session';

export interface BoxChatProps extends React.HTMLAttributes<HTMLDivElement> {}

type GroupMessage = {
  messages: MessageType[];
  isMe?: boolean;
};

export const BoxChat = forwardRef<HTMLDivElement, BoxChatProps>(
  (props, ref) => {
    const { sessionId } = useSessionStore();
    const [messages, setMessages] = useState<MessageType[]>([]);

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
          currentGroupMessage.isMe = message.sender.socketId === sessionId;
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
          isMe: message.sender.socketId === sessionId,
        };
      });

      groupMessages.push(currentGroupMessage);

      return groupMessages;
    }, [messages, sessionId]);

    const { room, user } = useChat();

    useEffect(() => {
      pusherClient
        .subscribe(room.code)
        .bind('message', (message: MessageType) => {
          setMessages((messages) => [...messages, message]);
        });
      return () => {
        pusherClient.unsubscribe(room.code);
      };
    }, [room.code, user]);

    useEffect(() => {
      if (refScroll?.current) {
        refScroll.current.scrollTo({
          top: refScroll.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, [groupMessages, ref]);

    useEffect(() => {
      return () => {
        console.log('leave');
      };
    }, [room.code]);

    return (
      <div ref={refScroll} className="chatFrame flex-1 gap-5 overflow-y-scroll">
        {groupMessages.map((groupMessage, index) => (
          <GroupMessage key={index} {...groupMessage} />
        ))}
      </div>
    );
  },
);
BoxChat.displayName = 'BoxChat';
