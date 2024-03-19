'use client';

import { Button } from '@/components/actions';
import { useAuthStore } from '@/stores/auth.store';
import { AlertCircleIcon, Phone, PhoneCallIcon } from 'lucide-react';
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
import { SHORTCUTS } from '@/types/shortcuts';
import { useChatStore } from '@/features/chat/store';
import { cn } from '@/utils/cn';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';

export const ChatBoxHeader = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { room: _room } = useChatBox();
  const currentUser = useAuthStore((s) => s.user)!;
  const onlineList = useChatStore((state) => state.onlineList);
  const { isBusiness } = useBusinessNavigationData();
  const allowCall = !isBusiness;
  const room = useMemo(
    () => generateRoomDisplay(_room, currentUser._id, true),
    [_room, currentUser],
  );

  const participants = room.participants.filter(
    (user) => user._id !== currentUser._id,
  );
  if (participants.length === 0) participants.push(currentUser); // if no participants, is a self chat
  const isOnline = participants.some((user) => onlineList.includes(user._id));

  return (
    <div {...props} className={cn("flex w-full items-center border-b  px-1 py-1 md:px-3", props.className)}>
      <RoomBoxHeaderNavigation />
      <div className="flex flex-1 items-center gap-2">
        <RoomAvatar showStatus isOnline={isOnline} room={room} size={36} />
        <div>
          <p className="break-word-mt line-clamp-1 font-medium">{room.name}</p>
          <p className="text-sm font-light">{room.subtitle}</p>
        </div>
      </div>
      <div className="ml-auto mr-1 flex items-center gap-1">
        {allowCall && <VideoCall />}
        <Tooltip title="Info" triggerItem={<ActionBar />} />
      </div>
    </div>
  );
};
const ActionBar = () => {
  const { toggleTab, currentSide } = useRoomSidebarTabs();
  const isShowInfo = currentSide === 'info';

  const handleToggleInfo = useCallback(() => {
    toggleTab('info');
  }, [toggleTab]);

  useKeyboardShortcut(
    [SHORTCUTS.VIEW_CONVERSATION_INFORMATION],
    handleToggleInfo,
  );

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
  const { user } = useAuthStore();
  const currentUserId = user?._id || '';
  const isSelfChat =
    currentUserId &&
    roomChatBox?.participants?.every((p) => p._id === currentUserId);
  const startVideoCall = useJoinCall();
  if (isSelfChat) return null;
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
        shape={'square'}
        color={isHaveMeeting ? 'primary' : 'secondary'}
        variant={isHaveMeeting ? 'default' : 'ghost'}
        className={`${isHaveMeeting ? '' : 'hidden'}`}
        startIcon={isHaveMeeting ? <PhoneCallIcon /> : <Phone />}
      >
        Join
      </Button>
    </div>
  );
};
