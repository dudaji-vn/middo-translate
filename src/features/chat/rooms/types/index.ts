import { BaseEntity } from '@/types';
import { Message } from '@/features/chat/messages/types';
import { User } from '@/features/users/types';

export type InboxSides = 'default' | 'settings' | 'new-message' | 'new-group';

export type RoomStatus = 'active' | 'temporary' | 'deleted' | 'cannot_message';
export type Room = {
  name?: string;
  avatar?: string;
  participants: User[];
  lastMessage?: Message;
  isGroup: boolean;
  newMessageAt?: string;
  link?: string;
  status: RoomStatus;
  admin: User;
  isSetName: boolean;
  isPinned?: boolean;
} & BaseEntity;
