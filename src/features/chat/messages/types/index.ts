import { BaseEntity, Media } from '@/types';

import { Room } from '@/features/chat/rooms/types';
import { User } from '@/features/users/types';
import { VariantProps } from 'class-variance-authority';
import { messageVariants } from '../components/message-item/variants';
import { FlowNode } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/settings/_components/extension-creation/steps/script-chat-flow/design-script-chat-flow';
import { ChatScript } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/scripts/_components/column-def/scripts-columns';

export type MessageType =
  | 'text'
  | 'media'
  | 'call'
  | 'notification'
  | 'action'
  | 'forward'
  | 'flow-actions'
  | 'flow-form';

export type ActionTypes =
  | 'none'
  | 'addUser'
  | 'removeUser'
  | 'leaveGroup'
  | 'pinMessage'
  | 'unpinMessage'
  | 'updateGroupName'
  | 'updateGroupAvatar'
  | 'removeGroupName'
  | 'createGroup'
  | 'leaveHelpDesk';

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
  startTime: string | null;
  type: 'DIRECT' | 'GROUP';
  participants: Pick<User, '_id' | 'name' | 'avatar' | 'status'>[];
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
  formId?: string;
  form?: { _id: string; name: string; isSubmitted?: boolean };
  status: MessageStatus;
  language: string;
  reactions?: Reaction[];
  forwardOf?: Message;
  call?: Call;
  hasChild?: boolean;
  isPinned?: boolean;
  mentions?: User[];
  action?: ActionTypes;
  clientTempId?: string;
  senderType?: 'bot' | 'user' | 'anonymous';
  script?: ChatScript;
  translations?: {
    [key: string]: string;
  };
  parent?: Message;
  // use for flow actions on helpdesk
  actions?: FlowNode[];
} & BaseEntity;

export type PinMessage = {
  message: Message;
  pinnedBy: User;
} & BaseEntity;
