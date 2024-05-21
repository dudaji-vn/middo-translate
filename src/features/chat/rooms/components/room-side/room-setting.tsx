'use client';

import { Bell, PinIcon } from 'lucide-react';

import { Item } from '@/components/data-display';
import { Room } from '@/features/chat/rooms/types';
import { Switch } from '@/components/data-entry';
import { useIsMutedRoom } from '../../hooks/use-is-muted-room';
import { useRoomActions } from '../room-actions';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface RoomSettingProps {
  room: Room;
}

export const RoomSetting = ({ room: _room }: RoomSettingProps) => {
  const { isMuted } = useIsMutedRoom(_room._id);
  const { onAction } = useRoomActions();
  const [isPinned, setIsPinned] = useState(_room.isPinned);
  const { t } = useTranslation('common');
  return (
    <div className="mt-0 flex flex-col items-center divide-y-[1px] divide-neutral-50 bg-white">
      <Item
        className="truncate"
        leftIcon={<Bell />}
        right={
          <Switch
            checked={!isMuted}
            onCheckedChange={(checked) => {
              if (checked) {
                onAction({
                  action: 'notify',
                  room: _room,
                });
              } else {
                onAction({
                  action: 'unnotify',
                  room: _room,
                });
              }
            }}
          />
        }
      >
        <span> {t('CONVERSATION.NOTIFICATION')}</span>
      </Item>
      <Item
        className="truncate"
        leftIcon={<PinIcon />}
        right={
          <Switch
            checked={isPinned}
            onCheckedChange={(checked) => {
              onAction({
                action: checked ? 'pin' : 'unpin',
                room: _room,
              });
              setIsPinned(checked);
            }}
          />
        }
      >
        {t('CONVERSATION.PIN_CONVERSATION')}
      </Item>
    </div>
  );
};
