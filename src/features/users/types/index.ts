import { BaseEntity } from '@/types';

export type User = {
  username: string;
  avatar: string;
  email: string;
  language: string;
} & BaseEntity;
