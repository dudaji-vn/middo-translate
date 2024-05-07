import { createContext, forwardRef, memo, useContext, useMemo } from 'react';
import {
  RoomItemActionWrapper,
  RoomItemActionWrapperDisabled,
} from './room-item-action-wrapper';

import { Avatar, Typography } from '@/components/data-display';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { ROUTE_NAMES } from '@/configs/route-name';
import { Room } from '@/features/chat/rooms/types';
import { generateRoomDisplay } from '@/features/chat/rooms/utils';
import { User } from '@/features/users/types';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/utils/cn';
import { Globe, PinIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useIsMutedRoom } from '../../hooks/use-is-muted-room';
import { ItemAvatar } from './room-item-avatar';
import { RoomItemComingCall } from './room-item-coming-call';
import { RoomItemHead } from './room-item-head';
import { ItemSub } from './room-item-sub';
import { RoomItemWrapper } from './room-item-wrapper';
import { convert } from 'html-to-text';
import { useDraftStore } from '@/features/chat/stores/draft.store';
import { CircleFlag } from 'react-circle-flags';
import { getCountryCode } from '@/utils/language-fn';

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
  const { room, visitorCountry } = useMemo(() => {
    const businessRedirectPath = conversationType
      ? `${ROUTE_NAMES.SPACES}/${params?.spaceId}/${conversationType}/${_data._id}`
      : `${ROUTE_NAMES.SPACES}/${params?.spaceId}/${conversationType}/`;
    const visitor = _data.participants.find(
      (user) => user.status === 'anonymous',
    );
    return {
      room: generateRoomDisplay(
        _data,
        currentUserId,
        !disabledRedirect,
        Boolean(conversationType) ? businessRedirectPath : null,
      ),
      visitorCountry: getCountryCode(visitor?.language || 'en'),
    };
  }, [
    _data,
    currentUserId,
    disabledRedirect,
    conversationType,
    params?.spaceId,
  ]);
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
        'group flex',
        isActive ? 'bg-primary-200' : 'bg-white hover:bg-primary-100',
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
              <div className="relative">
                <Avatar src={'/anonymous_avt.png'} alt="anonymous-avt" />
                <CircleFlag
                  className="absolute bottom-0 right-0 size-4 rounded-full border-2 border-white"
                  countryCode={visitorCountry?.toLowerCase() || 'gb'}
                />
              </div>
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
              <RenderItemSub />
              <Typography
                className={cn(
                  'flex flex-row items-center gap-1 text-sm font-light text-primary-500-main',
                  {
                    hidden: !room.fromDomain,
                  },
                )}
              >
                <Globe size={11} />
                {room.fromDomain}
              </Typography>
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

const RenderItemSub = () => {
  const { data, showMembersName, currentUser, isActive } = useRoomItem();
  const draft = useDraftStore((s) => s.draft[data._id]);
  const isRead = data.lastMessage?.readBy?.includes(currentUser._id) || false;
  if (showMembersName) return null;
  if (draft && isRead && !isActive) {
    return <ItemSubDraft htmlContent={draft} />;
  }
  if (!data.lastMessage) return null;
  return (
    <ItemSub
      currentUser={currentUser}
      isGroup={data.isGroup}
      message={data.lastMessage}
      participants={data.participants}
    />
  );
};

const ItemSubDraft = ({ htmlContent }: { htmlContent: string }) => {
  const { t } = useTranslation('common');

  const content = useMemo(() => {
    return convert(htmlContent, {
      selectors: [{ selector: 'a', options: { ignoreHref: true } }],
    });
  }, [htmlContent]);
  return (
    <div className="line-clamp-1">
      <span className="text-primary">{t('COMMON.DRAFT')}:&nbsp;</span>
      <span className="line-clamp-1 inline break-all text-text opacity-80">
        {content}
      </span>
    </div>
  );
};
