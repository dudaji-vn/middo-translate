'use client';

import { Bell, ChevronRight, ChevronRightIcon, ImagePlayIcon, PinIcon } from 'lucide-react';

import { Item } from '@/components/data-display';
import { Room } from '@/features/chat/rooms/types';
import { Switch } from '@/components/data-entry';
import { useIsMutedRoom } from '../../hooks/use-is-muted-room';
import { useRoomActions } from '../room-actions';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRoomSidebarTabs } from './room-side-tabs/room-side-tabs.hook';

export interface RoomSettingProps {
  room: Room;
}

export const RoomSetting = ({ room: _room }: RoomSettingProps) => {
  const { isMuted } = useIsMutedRoom(_room._id);
  const { toggleTab } = useRoomSidebarTabs();
  const { onAction } = useRoomActions();
  const [isPinned, setIsPinned] = useState(_room.isPinned);
  const { t } = useTranslation('common');
  return (
    <div className="mt-0 flex flex-col items-center divide-y-[1px] divide-neutral-50 dark:divide-neutral-800 bg-white dark:bg-background">
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
      <Item
        className="truncate"
        onClick={() => toggleTab('files')}
        leftIcon={<ImagePlayIcon />}
        right={<ChevronRightIcon />}
      >
        {t('CONVERSATION.FILE_MEDIA_AND_LINK')}
      </Item>
    </div>
  );
};
