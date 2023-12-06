import { BaseEntity } from '@/types';

export type User = {
  name: string;
  avatar: string;
  email: string;
  language: string;
} & BaseEntity;
