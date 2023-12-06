import { Media, Message } from '../types';

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
