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
  return {
    _id: self.crypto.randomUUID(),
    sender: sender!,
    content,
    contentEnglish,
    status: 'pending',
    type: 'text',
    media,
    createdAt: new Date().toISOString(),
    language,
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
