import { User } from '@/features/users/types';
import { MessageGroup } from './message-box';
import { Message } from '../../types';
import moment from 'moment';
export const MAX_TIME_DIFF = 5; // 5 minutes
export const MAX_TIME_GROUP_DIFF = 30; // 1 day
export const groupMessages = (
  messages: Message[],
  specificIdsToGroup: string[] = [],
): MessageGroup[] => {
  return messages?.reduce((acc, message) => {
    if (acc.length === 0) {
      acc.push({ messages: [message], lastMessage: message });
      return acc;
    }
    const lastGroup = acc[acc.length - 1];
    const lastMessage = lastGroup.lastMessage;
    if (
      specificIdsToGroup.includes(lastMessage._id) ||
      shouldCreateNewGroup(message, lastMessage)
    ) {
      acc.push({ messages: [message], lastMessage: message });
    } else {
      lastGroup.messages.push(message);
      lastGroup.lastMessage = message;
    }
    return acc;
  }, [] as MessageGroup[]);
};

export const shouldCreateNewGroup = (
  message: Message,
  lastMessage: Message,
): boolean => {
  const isDifferentSender = lastMessage.sender._id !== message.sender._id;
  const isNotificationOrAction =
    message.type === 'action' || message.type === 'notification';
  const timeDiff = moment(lastMessage.createdAt).diff(
    moment(message.createdAt),
    'minute',
  );

  const isHaveExtension = !!message?.reactions?.length || !!message?.hasChild;

  return (
    isNotificationOrAction ||
    lastMessage.type === 'notification' ||
    lastMessage.type === 'action' ||
    isDifferentSender ||
    timeDiff > MAX_TIME_DIFF ||
    isHaveExtension
  );
};

export const generateUsersReadMessageMap = (
  messagesGroup: MessageGroup[],
  participants: User[],
  currentUserId: string,
) => {
  let alreadyShow: string[] = [];
  const usersReadMessageMap: { [key: string]: User[] } = {};

  messagesGroup.forEach((group, index) => {
    group.messages.forEach((message, messageIndex) => {
      if (index === 0 && messageIndex === 0) {
        alreadyShow = message.readBy ?? [];
        usersReadMessageMap[message._id] = getReadByUsers(
          message,
          participants,
          currentUserId,
        );
      } else {
        message.readBy?.forEach((userId) => {
          if (!alreadyShow.includes(userId)) {
            const user = participants.find(
              (u) => u._id === userId && u._id !== currentUserId,
            );
            if (user) {
              alreadyShow.push(userId);
              usersReadMessageMap[message._id] = [
                ...(usersReadMessageMap[message._id] ?? []),
                user,
              ];
            }
          }
        });
      }
    });
  });

  return usersReadMessageMap;
};

export const getReadByUsers = (
  message: Message,
  participants: User[],
  currentUserId: string,
): User[] => {
  return (message.readBy ?? [])
    .map((userId) => {
      const user = participants.find(
        (u) => u._id === userId && u._id !== currentUserId,
      );
      return user ? user : null;
    })
    .filter((user): user is User => !!user);
};
