import { BaseEntity, Media } from '@/types';

import { Room } from '@/features/chat/rooms/types';
import { User } from '@/features/users/types';
import { VariantProps } from 'class-variance-authority';
import { messageVariants } from '../components/message-item/variants';

export type MessageType = 'text' | 'media' | 'call' | 'notification' | 'action';
export type MessageStatus = Pick<
  VariantProps<typeof messageVariants>,
  'status'
>['status'];

export type Message = {
  content: string;
  contentEnglish?: string;
  room?: Room;
  sender: User;
  readBy?: User['_id'][];
  deliveredTo?: User['_id'][];
  targetUsers?: User[];
  media?: Media[];
  type: MessageType;
  status: MessageStatus;
} & BaseEntity;
