'use client';

import { Button } from '@/components/actions';
import { useAuthStore } from '@/stores/auth.store';
import {
  AlertCircleIcon,
  Phone,
  PhoneCallIcon,
  SearchIcon,
} from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useChatBox } from '../../../contexts';
import { useCheckHaveMeeting } from '../../../hooks/use-check-have-meeting';
import { useJoinCall } from '../../../hooks/use-join-call';
import { RoomAvatar } from '../../room-avatar';
import { useRoomSidebarTabs } from '../../room-side/room-side-tabs/room-side-tabs.hook';
import { RoomBoxHeaderNavigation } from './room-box-header-navigation';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import { useChatStore } from '@/features/chat/stores';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { RoomAddMember } from '../../room-side/room-add-member';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useRoomSearchStore } from '@/features/chat/stores/room-search.store';

export const ChatBoxHeader = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { room } = useChatBox();
  const currentUser = useAuthStore((s) => s.user)!;
  const onlineList = useChatStore((state) => state.onlineList);
  const { t } = useTranslation('common');
  const { isBusiness, spaceId, businessConversationType } =
    useBusinessNavigationData();
  const { toggleTab } = useRoomSidebarTabs();
  const allowCall = !isBusiness;

  const participants = room.participants.filter(
    (user) => user._id !== currentUser._id,
  );
  const handleToggleInfo = useCallback(() => {
    toggleTab('info');
  }, [toggleTab]);

  if (participants.length === 0) participants.push(currentUser); // if no participants, is a self chat
  const isOnline = useMemo(() => {
    if (isBusiness) {
      const visitor = participants.find((user) => user.status === 'anonymous');
      return visitor && onlineList.includes(visitor._id);
    }
    return participants.some((user) => onlineList.includes(user._id));
  }, [isBusiness, onlineList, participants]);

  return (
    <div
      {...props}
      className={cn(
        'flex w-full items-center border-b  px-1 py-1 md:px-3',
        props.className,
      )}
    >
      <RoomBoxHeaderNavigation
        href={
          isBusiness
            ? `${ROUTE_NAMES.SPACES}/${spaceId}/${businessConversationType}`
            : ROUTE_NAMES.ONLINE_CONVERSATION
        }
      />
      <div className="flex flex-1 items-center gap-2">
        <div
          className="flex items-center gap-2 active:opacity-30 md:cursor-pointer"
          onClick={handleToggleInfo}
        >
          <RoomAvatar
            showStatus={room.status === 'active'}
            isOnline={isOnline}
            room={room}
            size={36}
          />
          <div>
            <p className="break-word-mt line-clamp-1 font-medium">
              {room.name}
            </p>
            <p className="text-sm font-light">
              {room.isHelpDesk
                ? isOnline
                  ? t('COMMON.ONLINE')
                  : t('COMMON.OFFLINE')
                : room.subtitle == 'Group'
                  ? t('COMMON.GROUP')
                  : room.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="ml-auto mr-1 flex items-center gap-1">
        {allowCall && room.status === 'active' && <VideoCall />}
        {room.isGroup && room.status === 'active' && (
          <Tooltip
            title={t('TOOL_TIP.ADD_MEMBER')}
            triggerItem={<RoomAddMember />}
          />
        )}
        {(room.status === 'active' ||
          (room.status === 'waiting' && !room.isGroup)) && (
          <Tooltip title={t('TOOL_TIP.INFO')} triggerItem={<ActionBar />} />
        )}
      </div>
    </div>
  );
};
const ActionBar = () => {
  const { toggleTab, currentSide } = useRoomSidebarTabs();
  const { isShowSearch, toggleIsShowSearch } = useRoomSearchStore();

  const isShowInfo = currentSide === 'info';

  const handleToggleInfo = useCallback(() => {
    toggleTab('info');
  }, [toggleTab]);

  useKeyboardShortcut(
    [SHORTCUTS.VIEW_CONVERSATION_INFORMATION],
    handleToggleInfo,
  );

  useKeyboardShortcut([SHORTCUTS.SEARCH_IN_ROOM], toggleIsShowSearch);

  return (
    <div className="flex gap-1">
      <Button.Icon
        onClick={toggleIsShowSearch}
        size="xs"
        color={isShowSearch ? 'secondary' : 'primary'}
        variant={isShowSearch ? 'default' : 'ghost'}
      >
        <SearchIcon />
      </Button.Icon>
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
  const { t } = useTranslation('common');
  const isSelfChat =
    currentUserId &&
    roomChatBox?.participants?.every((p) => p._id === currentUserId);
  const startVideoCall = useJoinCall();
  if (isSelfChat) return null;
  return (
    <div>
      <Tooltip
        title={t('TOOL_TIP.START_CALL')}
        triggerItem={
          <Button.Icon
            onClick={() => startVideoCall(roomChatBox?._id)}
            size="xs"
            color={isHaveMeeting ? 'secondary' : 'primary'}
            variant={isHaveMeeting ? 'default' : 'ghost'}
            className={`${isHaveMeeting ? 'hidden' : ''}`}
          >
            <Phone />
            {isHaveMeeting && t('CONVERSATION.JOIN')}
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
        {t('CONVERSATION.JOIN')}
      </Button>
    </div>
  );
};
