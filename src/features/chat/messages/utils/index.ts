import { Media } from '@/types';
import { Message } from '../types';
import { User } from '@/features/users/types';

type CreateLocalMessageParams = {
  sender: User;
  content?: string;
  contentEnglish?: string;
  media?: Media[];
  language?: string;
};

export const createLocalMessage = ({
  sender,
  content = '',
  contentEnglish = '',
  language = 'en',
  media = [],
}: CreateLocalMessageParams): Message => {
  const clientTempId = new Date().toISOString();
  return {
    _id: clientTempId,
    sender: sender!,
    content,
    contentEnglish,
    status: 'pending',
    type: 'text',
    media,
    createdAt: new Date().toISOString(),
    language,
    clientTempId,
  };
};

export const formatFileSize = (size: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let index = 0;
  while (size >= 1024) {
    size /= 1024;
    index++;
  }
  return `${size.toFixed(2)} ${units[index]}`;
};

export const generateSystemMessageContent = ({
  action,
  content,
}: {
  action: Message['action'];
  content?: Message['content'];
}) => {
  switch (action) {
    case 'addUser':
      return ` added`;
    case 'removeUser':
      return ` removed`;
    case 'leaveGroup':
      return ` left the group`;
    case 'pinMessage':
      return ` pinned a message`;
    case 'unpinMessage':
      return ` unpinned a message`;
    case 'updateGroupName':
      return ` changed the group name to ${content}`;
    case 'updateGroupAvatar':
      return ` updated the group avatar`;
    case 'removeGroupName':
      return ` removed the group name`;
    default:
      return '';
  }
};
