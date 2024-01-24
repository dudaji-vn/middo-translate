import { BaseEntity, Media } from '@/types';

import { Room } from '@/features/chat/rooms/types';
import { User } from '@/features/users/types';
import { VariantProps } from 'class-variance-authority';
import { messageVariants } from '../components/message-item/variants';

export type MessageType =
  | 'text'
  | 'media'
  | 'call'
  | 'notification'
  | 'action'
  | 'forward';

export type Reaction = {
  emoji: string;
  user: User;
};
export type MessageStatus = Pick<
  VariantProps<typeof messageVariants>,
  'status'
>['status'];
type Call = {
  endTime: string | null;
  type: 'DIRECT' | 'GROUP';
} & BaseEntity;
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
  language: string;
  reactions?: Reaction[];
  forwardOf?: Message;
  call?: Call;
  hasChild?: boolean;
  isPinned?: boolean;
} & BaseEntity;

export type PinMessage = {
  message: Message;
  pinnedBy: User;
} & BaseEntity;
