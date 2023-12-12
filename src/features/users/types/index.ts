import { BaseEntity } from '@/types';
type UserStatus = 'pending' | 'active' | 'banned' | 'unset' | 'inactive';
export type User = {
  name: string;
  avatar: string;
  email: string;
  language: string;
  status: UserStatus;
} & BaseEntity;
