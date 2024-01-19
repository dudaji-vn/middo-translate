'use client';

import { Bell, PinOff } from 'lucide-react';

import { Item } from '@/components/data-display';
import { Room } from '@/features/chat/rooms/types';
import { Switch } from '@/components/data-entry';
import { useIsMutedRoom } from '../../hooks/use-is-muted-room';
import { useRoomActions } from '../room-actions';

export interface RoomSettingProps {
  room: Room;
}

export const RoomSetting = ({ room: _room }: RoomSettingProps) => {
  const { isMuted } = useIsMutedRoom(_room._id);
  const { onAction } = useRoomActions();
  return (
    <div className="mt-12 flex flex-col items-center gap-2">
      <Item
        className="rounded-b-[4px]"
        leftIcon={<Bell />}
        right={
          <Switch
            checked={!isMuted}
            onCheckedChange={(checked) => {
              if (checked) {
                onAction('notify', _room._id);
              } else {
                onAction('unnotify', _room._id);
              }
            }}
          />
        }
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
