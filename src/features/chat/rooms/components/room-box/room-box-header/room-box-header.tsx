'use client';

import { Button } from '@/components/actions';
import { useAuthStore } from '@/stores/auth.store';
import { AlertCircleIcon, Phone } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useChatBox } from '../../../contexts';
import { useCheckHaveMeeting } from '../../../hooks/use-check-have-meeting';
import { useJoinCall } from '../../../hooks/use-join-call';
import { generateRoomDisplay } from '../../../utils';
import { RoomAvatar } from '../../room-avatar';
import { useRoomSidebarTabs } from '../../room-side/room-side-tabs/room-side-tabs.hook';
import { RoomBoxHeaderNavigation } from './room-box-header-navigation';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';

export const ChatBoxHeader = () => {
  const { room: _room } = useChatBox();
  const currentUserId = useAuthStore((s) => s.user?._id) || '';
  const room = useMemo(
    () => generateRoomDisplay(_room, currentUserId, true),
    [_room, currentUserId],
  );
  return (
    <div className="flex w-full items-center border-b  px-1 py-1 md:px-3">
      <RoomBoxHeaderNavigation />
      <div className="flex flex-1 items-center gap-2">
        <RoomAvatar isOnline room={room} size={36} />
        <div>
          <p className="line-clamp-1 font-medium">{room.name}</p>
          <p className="text-sm font-light">Online</p>
        </div>
      </div>
      <div className="ml-auto mr-3 flex items-center gap-1">
        <VideoCall />
        <Tooltip title="Info" triggerItem={<ActionBar />} />
      </div>
    </div>
  );
};
const SHORTCUT_TOGGLE_INFO = ['shift', 'i'];
const ActionBar = () => {
  const { toggleTab, currentSide } = useRoomSidebarTabs();
  const isShowInfo = currentSide === 'info';

  const handleToggleInfo = useCallback(() => {
    toggleTab('info');
  }, [toggleTab]);
  
  useKeyboardShortcut(SHORTCUT_TOGGLE_INFO, handleToggleInfo);

  return (
    <div>
      <Button.Icon
        onClick={handleToggleInfo}
        size="xs"
        color={isShowInfo ? 'secondary' : 'primary'}
        variant={isShowInfo ? 'default' : 'ghost'}
      >
        <AlertCircleIcon />
      </Button.Icon>
    </div>
  );
};
const VideoCall = () => {
  const { room: roomChatBox } = useChatBox();
  const isHaveMeeting = useCheckHaveMeeting(roomChatBox?._id);
  const startVideoCall = useJoinCall();
  return (
    <div>
      <Tooltip
        title="Start Middo Call"
        triggerItem={
          <Button.Icon
            onClick={() => startVideoCall(roomChatBox?._id)}
            size="xs"
            color={isHaveMeeting ? 'secondary' : 'primary'}
            variant={isHaveMeeting ? 'default' : 'ghost'}
            className={`${isHaveMeeting ? 'hidden' : ''}`}
          >
            <Phone />
            {isHaveMeeting && 'Join call'}
          </Button.Icon>
        }
      />
      <Button
        onClick={() => startVideoCall(roomChatBox?._id)}
        size="xs"
        color={isHaveMeeting ? 'secondary' : 'primary'}
        variant={isHaveMeeting ? 'default' : 'ghost'}
        className={`${isHaveMeeting ? '' : 'hidden'}`}
        startIcon={<Phone />}
      >
        Join call
      </Button>
    </div>
  );
};
