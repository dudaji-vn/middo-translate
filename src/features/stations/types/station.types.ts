import { TStation } from '@/app/(main-layout)/(protected)/stations/_components/type';
import { BaseEntity } from '@/types';

export type Station = TStation;
export type InvitationLink = {
  link: string;
} & BaseEntity;
