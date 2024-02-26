import { BaseEntity } from '@/types';
type UserStatus = 'pending' | 'active' | 'banned' | 'unset' | 'inactive';
export type User = {
  _id: string;
  name: string;
  avatar: string;
  email: string;
  language: string;
  status: UserStatus;
} & BaseEntity;
