import { createContext, forwardRef, memo, useContext, useMemo } from 'react';
import {
  RoomItemActionWrapper,
  RoomItemActionWrapperDisabled,
} from './room-item-action-wrapper';

import { Avatar } from '@/components/data-display';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { ROUTE_NAMES } from '@/configs/route-name';
import { Room } from '@/features/chat/rooms/types';
import { generateRoomDisplay } from '@/features/chat/rooms/utils';
import { User } from '@/features/users/types';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/utils/cn';
import { PinIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useIsMutedRoom } from '../../hooks/use-is-muted-room';
import { ItemAvatar } from './room-item-avatar';
import { RoomItemComingCall } from './room-item-coming-call';
import { RoomItemHead } from './room-item-head';
import { ItemSub } from './room-item-sub';
import { RoomItemWrapper } from './room-item-wrapper';

export interface RoomItemProps {
  data: Room;
  isActive?: boolean;
  currentRoomId?: Room['_id'];
  showMembersName?: boolean;
  showTime?: boolean;
  onClick?: () => void;
  isMuted?: boolean;
  disabledAction?: boolean;
  rightElement?: JSX.Element;
  disabledRedirect?: boolean;
  className?: string;
  businessId?: string;
  isOnline?: boolean;
}

const RoomItemContext = createContext<
  RoomItemProps & {
    currentUser: User;
  }
>(
  {} as RoomItemProps & {
    currentUser: User;
  },
);

const RoomItem = forwardRef<HTMLDivElement, RoomItemProps>((props, ref) => {
  const {
    data: _data,
    isActive: _isActive,
    showMembersName,
    currentRoomId,
    showTime = true,
    onClick,
    disabledAction,
    rightElement,
    disabledRedirect,
    className,
    isOnline,
  } = props;
  const currentUser = useAuthStore((s) => s.user)!;
  const currentUserId = currentUser?._id;
  const params = useParams();
  const conversationType = params?.conversationType;
  const { t } = useTranslation('common');
  const room = useMemo(() => {
    const businessRedirectPath = conversationType
      ? `${ROUTE_NAMES.SPACES}/${params?.spaceId}/${conversationType}/${_data._id}`
      : `${ROUTE_NAMES.SPACES}/${params?.spaceId}/${conversationType}/`;
    return generateRoomDisplay(
      _data,
      currentUserId,
      !disabledRedirect,
      Boolean(conversationType) ? businessRedirectPath : null,
    );
  }, [_data, currentUserId, disabledRedirect, conversationType]);
  const isRead = room?.lastMessage?.readBy?.includes(currentUserId) || false;

  const isActive =
    room.link === `/${ROUTE_NAMES.ONLINE_CONVERSATION}/${currentRoomId}` ||
    room.link ===
      `/${ROUTE_NAMES.SPACES}/${params?.spaceId}/${conversationType}/${currentRoomId}` ||
    _isActive;

  const { isMuted } = useIsMutedRoom(room._id);

  const Wrapper = disabledAction
    ? RoomItemActionWrapperDisabled
    : RoomItemActionWrapper;

  return (
    <div
      className={cn(
        'flex',
        isActive ? 'bg-background-darker' : 'bg-white hover:bg-[#fafafa]',
        className,
      )}
    >
      <Wrapper room={room} isMuted={isMuted}>
        <RoomItemContext.Provider
          value={{
            data: room,
            isActive,
            currentUser,
            showMembersName,
            showTime,
            onClick,
            isMuted,
            disabledRedirect,
            disabledAction,
          }}
        >
          <RoomItemWrapper>
            {!!conversationType ? (
              <Avatar src={'/anonymous.png'} alt="anonymous-avt" />
            ) : (
              <ItemAvatar isOnline={isOnline} room={room} isMuted={isMuted} />
            )}
            <div className="w-full">
              <RoomItemHead
                isRead={isRead}
                showTime={showTime}
                time={room.lastMessage?.createdAt || room.newMessageAt}
                name={room.name}
              />
              {showMembersName && (
                <div className="flex items-center">
                  <span className="line-clamp-1 break-all text-sm text-text/50">
                    {room.isGroup ? (
                      <>
                        {room.participants.map((user) => user.name).join(', ')}
                      </>
                    ) : (
                      <>
                        {room.participants.filter(
                          (user) => user._id !== currentUserId,
                        )[0]?.email || 'you'}
                      </>
                    )}
                  </span>
                </div>
              )}

              {room.lastMessage && !showMembersName && (
                <ItemSub
                  currentUser={currentUser}
                  isGroup={room.isGroup}
                  message={room.lastMessage}
                  participants={room.participants}
                />
              )}
            </div>
            {rightElement}
          </RoomItemWrapper>
        </RoomItemContext.Provider>
      </Wrapper>
      {room?.isPinned && (
        <div className="flex items-center pr-3">
          <PinIcon className="size-4 rotate-45 fill-primary stroke-primary text-neutral-600" />
        </div>
      )}
      <Tooltip
        title={t('CONVERSATION.JOIN')}
        triggerItem={<RoomItemComingCall roomChatBox={room} />}
      />
    </div>
  );
});

RoomItem.displayName = 'RoomItem';

export const MemoizedRoomItem = memo(RoomItem);

export const useRoomItem = () => {
  const context = useContext(RoomItemContext);
  if (!context) {
    throw new Error('useRoomItem must be used within RoomItemContext');
  }
  return context;
};
