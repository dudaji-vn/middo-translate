import { BaseEntity } from '@/types';
import { Room } from '@/features/chat/rooms/types';
import { User } from '@/features/users/types';
import { VariantProps } from 'class-variance-authority';
// import { messageVariants } from '../components/message/message-item';

export type MessageType = 'text' | 'media' | 'call';
// export type MessageStatus = Pick<
//   VariantProps<typeof messageVariants>,
//   'status'
// >['status'];

export type MediaType = 'image' | 'video' | 'audio' | 'document';
export type Media = {
  url: string;
  type: MediaType;
  file?: File;
  size?: number;
  name?: string;
};
export type Message = {
  content: string;
  room?: Room;
  sender: User;
  readBy?: User['_id'][];
  deliveredTo?: User['_id'][];
  media?: Media[];
  type: MessageType;
  // status: MessageStatus;
} & BaseEntity;
