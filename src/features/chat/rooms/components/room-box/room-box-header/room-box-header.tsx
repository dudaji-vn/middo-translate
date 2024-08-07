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
import { useStationNavigationData } from '@/hooks';

export const ChatBoxHeader = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { room } = useChatBox();
  const currentUser = useAuthStore((s) => s.user)!;
  const onlineList = useChatStore((state) => state.onlineList);
  const { t } = useTranslation('common');
  const { isBusiness, spaceId, businessConversationType } =
    useBusinessNavigationData();
  const { isOnStation, stationId } = useStationNavigationData();
  const { toggleTab } = useRoomSidebarTabs();

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

  const backHref = useMemo(() => {
    if (isBusiness) {
      return `${ROUTE_NAMES.SPACES}/${spaceId}/${businessConversationType}`;
    }
    if (isOnStation) {
      return `${ROUTE_NAMES.STATIONS}/${stationId}/conversations`;
    }
    return ROUTE_NAMES.ONLINE_CONVERSATION;
  }, [isBusiness, spaceId, businessConversationType, isOnStation, stationId]);

  return (
    <div
      {...props}
      className={cn(
        'flex w-full items-center border-b  px-1 py-1 dark:border-neutral-800 md:px-3',
        props.className,
      )}
    >
      <RoomBoxHeaderNavigation href={backHref} />
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
            <p className="line-clamp-1 text-sm font-light">
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
        {room.status === 'active' && <VideoCall />}
        {room.isGroup && room.status === 'active' && (
          <Tooltip
            title={t('TOOL_TIP.ADD_MEMBER')}
            triggerItem={<RoomAddMember />}
          />
        )}
        {room.status !== 'waiting' && <SearchButton />}
        {!(room.status === 'waiting' && room.isGroup) && <InfoButton />}
      </div>
    </div>
  );
};
const InfoButton = () => {
  const { t } = useTranslation('common');
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
    <Tooltip
      title={t('TOOL_TIP.INFO')}
      triggerItem={
        <Button.Icon
          onClick={handleToggleInfo}
          size="xs"
          color={isShowInfo ? 'secondary' : 'primary'}
          variant={isShowInfo ? 'default' : 'ghost'}
        >
          <AlertCircleIcon />
        </Button.Icon>
      }
    />
  );
};

const SearchButton = () => {
  const { toggleIsShowSearch, isShowSearch } = useRoomSearchStore();
  useKeyboardShortcut([SHORTCUTS.SEARCH_IN_ROOM], toggleIsShowSearch);
  return (
    <Button.Icon
      onClick={toggleIsShowSearch}
      size="xs"
      color={isShowSearch ? 'secondary' : 'primary'}
      variant={isShowSearch ? 'default' : 'ghost'}
    >
      <SearchIcon />
    </Button.Icon>
  );
};
const VideoCall = () => {
  const { room: roomChatBox } = useChatBox();
  const { isBusiness } = useBusinessNavigationData();
  const isHaveMeeting = useCheckHaveMeeting(roomChatBox?._id, isBusiness);
  const { user } = useAuthStore();
  const currentUserId = user?._id || '';
  const { t } = useTranslation('common');
  const isSelfChat =
    currentUserId &&
    roomChatBox?.participants?.every((p) => p._id === currentUserId);
  const startVideoCall = useJoinCall();
  if (isSelfChat) return null;

  if (isBusiness && !isHaveMeeting) return null;

  return (
    <div>
      <Tooltip
        title={t('TOOL_TIP.START_CALL')}
        triggerItem={
          <Button.Icon
            onClick={() => startVideoCall({ roomId: roomChatBox?._id })}
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
        onClick={() => startVideoCall({ roomId: roomChatBox?._id })}
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
