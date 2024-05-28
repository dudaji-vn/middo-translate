import { BaseEntity } from '@/types';
export type UserRelationshipStatus = 'none' | 'blocking' | 'blocked';
type UserStatus =
  | 'pending'
  | 'active'
  | 'banned'
  | 'unset'
  | 'inactive'
  | 'anonymous'
  | 'deleted';
export type User = {
  _id: string;
  name: string;
  avatar: string;
  email: string;
  language: string;
  status: UserStatus;
  phoneNumber?: string;
  username: string;
  allowUnknown: boolean;
} & BaseEntity;
