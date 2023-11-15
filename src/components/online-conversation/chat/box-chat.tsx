'use client';

import { forwardRef, useMemo } from 'react';

import { GroupMessage } from './message';
import { Message as MessageType } from '@/types/room';

export interface BoxChatProps extends React.HTMLAttributes<HTMLDivElement> {}

const messages: MessageType[] = [
  {
    sender: {
      username: 'system',
      socketId: '',
      language: '',
    },
    content: 'Jay joined the room',
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    sender: {
      username: 'Jay',
      socketId: '123',
      language: 'vi',
    },
    content: 'Xin chào!!!!!!!',
    translatedContent: '안녕하세요!!!!!!!', // ko
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    sender: {
      username: 'system',
      socketId: '',
      language: '',
    },
    content: 'Sun joined the room',
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    sender: {
      username: 'Sun',
      socketId: '132',
      language: 'ko',
    },
    content: '안녕하세요!!!!!!!',
    translatedContent: 'Xin chào!!!!!!!', // vi
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const myId = '132';

type GroupMessage = {
  messages: MessageType[];
  isMe?: boolean;
};

export const BoxChat = forwardRef<HTMLDivElement, BoxChatProps>(
  (props, ref) => {
    const groupMessages = useMemo(() => {
      const groupMessages: GroupMessage[] = [];
      let currentGroupMessage: GroupMessage = {
        messages: [],
      };
      messages.forEach((message) => {
        if (currentGroupMessage.messages.length === 0) {
          currentGroupMessage.messages.push(message);
          currentGroupMessage.isMe = message.sender.socketId === myId;
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
          isMe: message.sender.socketId === myId,
        };
      });

      groupMessages.push(currentGroupMessage);

      return groupMessages;
    }, []);

    return (
      <div className="chatFrame flex-1 overflow-y-scroll">
        {groupMessages.map((groupMessage, index) => (
          <GroupMessage key={index} {...groupMessage} />
        ))}
      </div>
    );
  },
);
BoxChat.displayName = 'BoxChat';
