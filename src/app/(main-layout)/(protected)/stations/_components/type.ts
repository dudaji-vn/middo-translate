'use client';

import React from 'react';
import { TabsContentProps } from '@radix-ui/react-tabs';
import { BaseEntity } from '@/types';
import { type User } from '@/features/users/types';
export type MemberStatus = 'invited' | 'joined' | 'deleted' | 'rejected';
export type Member = {
  user: User;
  role: 'admin' | 'member';
  status: MemberStatus;
};

export type StationTabType = 'all_stations' | 'my_stations' | 'joined_stations';
export type StationTabItem = {
  value: StationTabType;
  label: string;
  componentProps?: Partial<TabsContentProps>;
  icon?: React.ReactNode;
};
export type TStationTag = 'my' | 'joined' | undefined;
export type TConversationTag = {
  _id: string;
  name: string;
  isDeleted?: boolean;
  color: string;
  isReadonly?: boolean;
};
export type TStation = BaseEntity & {
  name: string;
  avatar?: string;
  backgroundImage?: string;
  description?: string;
  totalNewMessages: number;
  totalMembers: number;
  owner: User;
  members: Member[];
  isOwner: boolean;
  tag?: TStationTag;
  tags: TConversationTag[];
};

export const PK_STATION_KEY = 'stationId';
