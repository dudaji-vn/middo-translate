import { Media } from '@/types';
import { Message } from '../types';
import { User } from '@/features/users/types';

export const createLocalMessage = ({
  sender,
  content = '',
  media = [],
}: {
  sender: User;
  content?: string;
  media?: Media[];
}): Message => {
  return {
    _id: self.crypto.randomUUID(),
    sender: sender!,
    content,
    status: 'pending',
    type: 'text',
    media,
    createdAt: new Date().toISOString(),
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
