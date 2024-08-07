import { createContext, forwardRef, memo, useContext, useMemo } from 'react';
import {
  RoomItemActionWrapper,
  RoomItemActionWrapperDisabled,
} from './room-item-action-wrapper';

import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { ROUTE_NAMES } from '@/configs/route-name';
import { Room } from '@/features/chat/rooms/types';
import { generateRoomDisplay } from '@/features/chat/rooms/utils';
import { User } from '@/features/users/types';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/utils/cn';
import { BellOffIcon, Globe, PinIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ItemAvatar } from './room-item-avatar';
import { RoomItemHead } from './room-item-head';
import { ItemSub } from './room-item-sub';
import { RoomItemWrapper } from './room-item-wrapper';
import { convert } from 'html-to-text';
import { useDraftStore } from '@/features/chat/stores/draft.store';
import { getCountryCode } from '@/utils/language-fn';
import RoomItemVisitorAvatar from './room-item-visitor-avatar';
import { CircleFlag } from 'react-circle-flags';
import { SUPPORTED_LANGUAGES } from '@/configs/default-language';
import { InboxType } from '../inbox/inbox';
import { useSideChatStore } from '@/features/chat/stores/side-chat.store';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { useStationNavigationData } from '@/hooks/use-station-navigation-data';
import usePlatformNavigation from '@/hooks/use-platform-navigation';
import { RoomItemCall } from './room-item-call';

export interface RoomItemProps {
  data: Room;
  isActive?: boolean;
  currentRoomId?: Room['_id'];
  showMembersName?: boolean;
  showTime?: boolean;
  isShowStatus?: boolean;
  isForgeShowCallButton?: boolean;
  onClick?: () => void;
  isMuted?: boolean;
  disabledAction?: boolean;
  rightElement?: JSX.Element;
  disabledRedirect?: boolean;
  className?: string;
  businessId?: string;
  isOnline?: boolean;
  type?: InboxType;
  isForceShow?: boolean;
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
    isShowStatus = true,
    isForgeShowCallButton,
    onClick,
    disabledAction,
    rightElement,
    disabledRedirect,
    className,
    isOnline,
    type,
    isForceShow,
  } = props;
  const currentUser = useAuthStore((s) => s.user)!;
  const currentUserId = currentUser?._id;
  const params = useParams();
  const { businessConversationType } = useBusinessNavigationData();
  const { toPlatformLink } = usePlatformNavigation();
  const { isOnStation, stationId } = useStationNavigationData();
  const { t } = useTranslation('common');
  const { room, visitorCountry } = useMemo(() => {
    const businessRedirectPath = businessConversationType
      ? `${ROUTE_NAMES.SPACES}/${params?.spaceId}/${businessConversationType}/${_data._id}`
      : `${ROUTE_NAMES.SPACES}/${params?.spaceId}/conversations/${_data._id}`;
    const stationRedirectPath = `${ROUTE_NAMES.STATIONS}/${stationId}/conversations/${_data._id}`;
    let overridePath;
    if (isOnStation) {
      overridePath = stationRedirectPath;
    }
    if (businessConversationType) {
      overridePath = toPlatformLink(businessRedirectPath);
    }
    const visitor = _data.participants.find(
      (user) => user.status === 'anonymous',
    );
    const countryCode = getCountryCode(visitor?.language || 'en');

    return {
      room: generateRoomDisplay({
        room: _data,
        currentUserId,
        inCludeLink: !disabledRedirect,
        overridePath,
      }),
      visitorCountry: {
        ...SUPPORTED_LANGUAGES.find((sl) => sl.code === visitor?.language),
        code: countryCode,
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    businessConversationType,
    params?.spaceId,
    _data,
    stationId,
    isOnStation,
    currentUserId,
    disabledRedirect,
  ]);
  const isHideRead = useSideChatStore(
    (state) => state.filters.includes('unread') && !isForceShow,
  );
  const isMuted = room?.isMuted || false;
  const isRead = room?.lastMessage?.readBy?.includes(currentUserId) || false;
  const isActive =
    room.link === `/${ROUTE_NAMES.ONLINE_CONVERSATION}/${currentRoomId}` ||
    room.link ===
      `/${ROUTE_NAMES.SPACES}/${params?.spaceId}/${businessConversationType}/${currentRoomId}` ||
    _isActive;

  const Wrapper = disabledAction
    ? RoomItemActionWrapperDisabled
    : RoomItemActionWrapper;

  if (isHideRead && isRead) return null;
  return (
    <div
      className={cn(
        'group flex',
        isActive
          ? 'bg-primary-200 dark:bg-primary-800'
          : 'bg-white hover:bg-primary-100 dark:bg-neutral-950 dark:hover:bg-primary-900',
        className,
      )}
    >
      <Wrapper room={room} isMuted={isMuted} type={type}>
        <RoomItemContext.Provider
          value={{
            type: type,
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
            {!businessConversationType ? (
              <ItemAvatar isOnline={isOnline} room={room} isMuted={isMuted} />
            ) : (
              <RoomItemVisitorAvatar isOnline={isOnline} isMuted={isMuted} />
            )}
            <div className="w-full flex-1 overflow-hidden">
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
                        {'@' +
                          room.participants.filter(
                            (user) => user._id !== currentUserId,
                          )[0]?.username || 'you'}
                      </>
                    )}
                  </span>
                </div>
              )}
              {type == 'contact' ? <RenderItemUserName /> : <RenderItemSub />}
              {room.isHelpDesk && (
                <div className="flex flex-row items-center gap-1 text-sm font-light">
                  <CircleFlag
                    className={cn('size-4 rounded-full', {
                      hidden: !visitorCountry?.code || !visitorCountry?.name,
                    })}
                    countryCode={visitorCountry?.code?.toLowerCase() || 'gb'}
                  />
                  <span className={'uppercase text-neutral-600'}>
                    {visitorCountry?.code}
                  </span>
                  <Globe
                    size={11}
                    className={cn('ml-2 text-primary-500-main', {
                      hidden: !room.fromDomain,
                    })}
                  />
                  <span className={'text-primary-500-main'}>
                    {room.fromDomain}
                  </span>
                </div>
              )}
            </div>

            {rightElement}
            {isShowStatus && isMuted && type != 'contact' && (
              <div className="flex items-center">
                <BellOffIcon className="size-4 fill-error stroke-error text-neutral-600" />
              </div>
            )}
            {isShowStatus && room?.isPinned && type != 'contact' && (
              <div className="flex items-center">
                <PinIcon className="size-4 rotate-45 fill-primary stroke-primary text-neutral-600" />
              </div>
            )}
          </RoomItemWrapper>
        </RoomItemContext.Provider>
      </Wrapper>
      <RoomItemCall roomChatBox={room} isForgeShow={isForgeShowCallButton} />
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
      expiredAt={data.expiredAt}
      currentUser={currentUser}
      isGroup={data.isGroup}
      message={data.lastMessage}
      participants={data.participants}
    />
  );
};

const RenderItemUserName = () => {
  const { data, currentUser } = useRoomItem();

  const user = data.participants.filter((p) => p._id !== currentUser._id)[0];

  if (!user) return null;

  return (
    <p className="line-clamp-1 text-sm font-light text-neutral-800 dark:text-neutral-50">
      {'@' + user?.username}
    </p>
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
