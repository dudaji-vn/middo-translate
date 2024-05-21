import { BaseEntity } from '@/types';
import { Message } from '@/features/chat/messages/types';
import { User } from '@/features/users/types';
import { TSpace } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces';

export type InboxSides = 'default' | 'settings' | 'new-message' | 'new-group';

export type RoomStatus =
  | 'active'
  | 'temporary'
  | 'deleted'
  | 'cannot_message'
  | 'archived'
  | 'blocked'
  | 'blocked_by_you';
export type Room = {
  name?: string;
  subtitle?: string;
  avatar?: string;
  participants: User[];
  lastMessage?: Message;
  isGroup: boolean;
  newMessageAt?: string;
  link?: string;
  status: RoomStatus;
  admin: User;
  isHelpDesk?: boolean;
  isSetName: boolean;
  isPinned?: boolean;
  tag?: {
    name: string;
    color: string;
    _id: string;
  };
  expiredAt?: string;
  space?: TSpace;
  fromDomain?: string;
} & BaseEntity;
