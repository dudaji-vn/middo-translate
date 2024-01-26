'use client';

import { Bell, PinIcon } from 'lucide-react';

import { Item } from '@/components/data-display';
import { Room } from '@/features/chat/rooms/types';
import { Switch } from '@/components/data-entry';
import { useIsMutedRoom } from '../../hooks/use-is-muted-room';
import { useRoomActions } from '../room-actions';
import { useState } from 'react';

export interface RoomSettingProps {
  room: Room;
}

export const RoomSetting = ({ room: _room }: RoomSettingProps) => {
  const { isMuted } = useIsMutedRoom(_room._id);
  const { onAction } = useRoomActions();
  const [isPinned, setIsPinned] = useState(_room.isPinned);
  return (
    <div className="mt-0 flex flex-col items-center gap-1">
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
        leftIcon={<PinIcon />}
        right={
          <Switch
            checked={isPinned}
            onCheckedChange={(checked) => {
              onAction('pin', _room._id);
              setIsPinned(checked);
            }}
          />
        }
      >
        Pin conversation
      </Item>
    </div>
  );
};
