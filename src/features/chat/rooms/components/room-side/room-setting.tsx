'use client';

import { Bell, PinOff } from 'lucide-react';

import { Item } from '@/components/data-display';
import { Room } from '@/features/chat/rooms/types';
import { Switch } from '@/components/data-entry';

export interface RoomSettingProps {
  room: Room;
}

export const RoomSetting = ({ room: _room }: RoomSettingProps) => {
  return (
    <div className="mt-12 flex flex-col items-center gap-2">
      <Item
        className="rounded-b-[4px]"
        leftIcon={<Bell />}
        right={<Switch checked />}
      >
        <span> Notification</span>
      </Item>
      <Item
        className="rounded-t-[4px]"
        leftIcon={<PinOff />}
        right={<Switch />}
      >
        Pin on top
      </Item>
    </div>
  );
};
