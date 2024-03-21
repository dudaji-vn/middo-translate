import { BaseEntity } from '@/types';
type UserStatus =
  | 'pending'
  | 'active'
  | 'banned'
  | 'unset'
  | 'inactive'
  | 'anonymous';
export type User = {
  _id: string;
  name: string;
  avatar: string;
  email: string;
  language: string;
  status: UserStatus;
  phoneNumber?: string;
} & BaseEntity;
