import {
  Fragment,
  forwardRef,
  memo,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react';

import { InfiniteScroll } from '@/components/infinity-scroll';
import { SOCKET_CONFIG } from '@/configs/socket';
import { roomApi } from '@/features/chat/rooms/api';
import {
  USE_GET_PINNED_ROOMS_KEY,
  useGetPinnedRooms,
} from '@/features/chat/rooms/hooks/use-pin-room';
import { useChatStore } from '@/features/chat/stores';
import { User } from '@/features/users/types';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { useCursorPaginationQuery } from '@/hooks/use-cursor-pagination-query';
import { useScrollDistanceFromTop } from '@/hooks/use-scroll-distance-from-top';
import socket from '@/lib/socket-io';
import { useAuthStore } from '@/stores/auth.store';
import { useBusinessExtensionStore } from '@/stores/extension.store';
import { useSpaceInboxFilterStore } from '@/stores/space-inbox-filter.store';
import useStore from '@/stores/use-store';
import { cn } from '@/utils/cn';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Room } from '../../types';
import { PinnedRoom } from '../pinned-room';
import { RoomItem } from '../room-item';
import { EmptyInbox } from './empty-inbox';
import { InboxType } from './inbox';
import ViewSpaceInboxFilter from './view-space-inbox-filter';
import { isEmpty } from 'lodash';
import {
  ALPHABET_LIST,
  ALPHABET_SELECTOR,
  OTHER_CHARACTER,
} from '../../configs/alphabet-list';
import { useTranslation } from 'react-i18next';
import { useSideChatStore } from '@/features/chat/stores/side-chat.store';

interface InboxListProps {
  type: InboxType;
}
const TAB_SORT_BY_NAME = ['contact'];
const InboxList = forwardRef<HTMLDivElement, InboxListProps>(
  ({ type }: InboxListProps, ref) => {
    const currentUser = useStore(useAuthStore, (s) => s.user);
    const params = useParams();
    const {
      inboxStatus: status,
      businessRoomId,
      isBusiness,
    } = useBusinessNavigationData();
    const { t } = useTranslation('common');
    const charactersScrollBarRef = useRef<HTMLDivElement>(null);
    const { businessExtension } = useBusinessExtensionStore();
    const { appliedFilters } = useSpaceInboxFilterStore();
    const filters = useSideChatStore((state) => state.filters);
    const spaceId = params?.spaceId ? String(params?.spaceId) : undefined;
    const currentRoomId = params?.id || businessRoomId;
    const { isScrolled, ref: scrollRef } = useScrollDistanceFromTop(1);
    const isSortByName = TAB_SORT_BY_NAME.includes(type);

    const helpDeskEmptyType = useMemo(() => {
      if (!isBusiness) return undefined;
      if (!isEmpty(Object.keys(appliedFilters || {})))
        return 'help-desk-filtered';
      return type;
    }, [appliedFilters, isBusiness]);
    const key = useMemo(() => {
      if (spaceId) {
        return ['rooms', type, spaceId, status, appliedFilters];
      }
      return ['rooms', type, status, filters];
    }, [spaceId, type, status, filters, appliedFilters]);
    const onlineList = useChatStore((state) => state.onlineList);

    const {
      items: rooms,
      fetchNextPage,
      hasNextPage,
      isLoading,
      removeItem,
      updateItem,
      addItem,
      refetch,
      isRefetching,
    } = useCursorPaginationQuery<Room>({
      queryKey: key,
      queryFn: ({ pageParam }) =>
        roomApi.getRooms({
          cursor: pageParam,
          limit: 10,
          type,
          status,
          spaceId,
          filterOptions: spaceId ? appliedFilters : undefined,
          isGroup: filters.includes('group') ? true : undefined,
          isUnread: filters.includes('unread') ? true : undefined,
        }),
    });

    const sortedRooms = useMemo(() => {
      if (!isSortByName) return rooms;
      let roomsClone = [...rooms];
      // Sorted by a-z , if not in ALPHABET_LIST, move to last
      roomsClone.sort((a: Room, b: Room) => {
        const aParticipantName =
          a.participants
            .find((p) => p._id !== currentUser?._id)
            ?.name?.toLowerCase() || '';
        const bParticipantName =
          b.participants
            .find((p) => p._id !== currentUser?._id)
            ?.name?.toLowerCase() || '';
        if (ALPHABET_LIST.includes(aParticipantName.charAt(0))) {
          if (ALPHABET_LIST.includes(bParticipantName.charAt(0))) {
            return aParticipantName.localeCompare(bParticipantName);
          }
          return -1;
        }
        if (ALPHABET_LIST.includes(bParticipantName.charAt(0))) {
          return 1;
        }
        return aParticipantName.localeCompare(bParticipantName);
      });
      return roomsClone.map((r) => {
        if (r.name) return r;
        const anotherUser = r.participants.find(
          (p) => p._id !== currentUser?._id,
        );
        return { ...r, name: anotherUser?.name };
      });
    }, [currentUser?._id, isSortByName, rooms]);
    const scrollToCharacter = (id: string) => {
      const element = document.getElementById(ALPHABET_SELECTOR + id);
      if (element) {
        element.scrollIntoView();
      }
    };
    useEffect(() => {
      const ref = charactersScrollBarRef.current;
      if (!ref) return;
      const handle = (e: TouchEvent) => {
        const currentElement = document.elementFromPoint(
          e.touches[0].clientX,
          e.touches[0].clientY,
        );
        if (!currentElement) return;
        if (!currentElement.closest('#characters')) return;
        let char = currentElement?.innerHTML?.toString()?.toLowerCase();
        if ([...ALPHABET_LIST, OTHER_CHARACTER].includes(char)) {
          scrollToCharacter(char);
        }
      };
      document.addEventListener('touchmove', handle);
      return () => {
        document.removeEventListener('touchmove', handle);
      };
    }, [type]);

    const { rooms: pinnedRooms, refetch: refetchPinned } =
      useGetPinnedRooms(spaceId);

    const queryClient = useQueryClient();

    const updateRoom = (room: Partial<Room> & { _id: string }) => {
      refetch();
      queryClient.invalidateQueries(USE_GET_PINNED_ROOMS_KEY);
    };

    const deleteRoom = (roomId: string) => {
      queryClient.invalidateQueries(USE_GET_PINNED_ROOMS_KEY);
      removeItem(roomId);
    };

    const leaveRoom = (roomId: string) => {
      queryClient.invalidateQueries(USE_GET_PINNED_ROOMS_KEY);
      removeItem(roomId);
    };

    useEffect(() => {
      socket.on(SOCKET_CONFIG.EVENTS.INBOX.NEW, addItem);
      socket.on(
        SOCKET_CONFIG.EVENTS.INBOX.UPDATE,
        (payload: { roomId: string; data: Partial<Room> }) => {
          updateRoom({ _id: payload.roomId, ...payload.data });
        },
      );
      socket.on(SOCKET_CONFIG.EVENTS.INBOX.DELETE, deleteRoom);
      return () => {
        socket.off(SOCKET_CONFIG.EVENTS.INBOX.UPDATE);
        socket.off(SOCKET_CONFIG.EVENTS.INBOX.DELETE);
        socket.off(SOCKET_CONFIG.EVENTS.INBOX.NEW);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showEmptyInbox = useMemo(() => {
      if (rooms.length || isLoading) return false;
      if (type === 'all' || type === 'group') {
        if (pinnedRooms?.length) return false;
      }
      return true;
    }, [rooms, isLoading, type, pinnedRooms]);

    if (!currentUser) return null;

    if (showEmptyInbox) {
      return <EmptyInbox type={helpDeskEmptyType || type} />;
    }

    const showFilter =
      Object.values(appliedFilters || {}).flat().length > 0 && isBusiness;

    return (
      <div
        ref={ref}
        className={cn(
          'relative h-full w-full flex-1 overflow-hidden ',
          isSortByName && 'relative pr-3 md:pr-0',
        )}
      >
        {isScrolled && (
          <div className="absolute left-0 right-0 top-0 z-10 h-0.5 w-full shadow-1"></div>
        )}

        <div
          id="scrollableDiv"
          ref={scrollRef}
          className={cn('no-scrollbar h-full gap-2 overflow-y-auto')}
        >
          <InfiniteScroll
            isRefreshing={isRefetching}
            pullToRefresh={!isSortByName}
            onRefresh={refetch}
            onLoadMore={fetchNextPage}
            hasMore={hasNextPage || false}
            isFetching={isLoading}
            className="flex flex-col"
          >
            <ViewSpaceInboxFilter
              className={cn('z-[60] w-full', {
                hidden: !showFilter,
              })}
            />
            <PinnedRoom
              type={filters.includes('group') ? 'group' : 'all'}
              rooms={pinnedRooms}
              currentRoomId={currentRoomId as string}
            />
            {sortedRooms.map((room, index) => {
              const isOnline = isRoomOnline({
                currentUser,
                room,
                onlineList,
                isBusiness,
              });

              let char: string | undefined;
              if (isSortByName) {
                const prevRoom: Room | null =
                  index > 0 ? sortedRooms[index - 1] : null;

                let prevFirstChar = prevRoom?.name?.charAt(0).toLowerCase();
                let currentFirstChar = room.name?.charAt(0).toLowerCase();
                if (!currentFirstChar) char = undefined;
                // CASE: First item
                else if (!prevFirstChar)
                  char = ALPHABET_LIST.includes(currentFirstChar)
                    ? currentFirstChar
                    : OTHER_CHARACTER;
                // CASE: Previous item is not in alphabet => Already add Other character
                else if (
                  prevFirstChar &&
                  !ALPHABET_LIST.includes(prevFirstChar)
                )
                  char = undefined;
                // CASE: Previous item is in alphabet, and current item different with previous item
                else if (
                  prevFirstChar &&
                  ALPHABET_LIST.includes(prevFirstChar) &&
                  currentFirstChar !== prevFirstChar
                ) {
                  char = ALPHABET_LIST.includes(currentFirstChar)
                    ? currentFirstChar
                    : OTHER_CHARACTER;
                }
                // CASE: Previous item is in alphabet, and current item same with previous item
                else if (
                  prevFirstChar &&
                  ALPHABET_LIST.includes(prevFirstChar) &&
                  currentFirstChar === prevFirstChar
                )
                  char = undefined;
              }

              return (
                <Fragment key={room._id}>
                  {isSortByName && char && (
                    <span
                      className="mx-3 my-2 block border-b border-neutral-50 px-3 py-1 text-xs text-neutral-500 dark:border-neutral-800"
                      id={ALPHABET_SELECTOR + char}
                    >
                      {char.toUpperCase()}
                    </span>
                  )}
                  <RoomItem
                    showTime={type !== 'contact'}
                    type={type}
                    isOnline={isOnline}
                    data={room}
                    isActive={currentRoomId === room._id}
                    currentRoomId={currentRoomId as string}
                    businessId={businessExtension?._id}
                  />
                </Fragment>
              );
            })}
          </InfiniteScroll>
          {isSortByName && (
            <p className="mx-3 my-2 block border-t border-neutral-50 px-3 py-1 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-800">
              {sortedRooms.length} {t('COMMON.CONTACTS')}
            </p>
          )}
        </div>
        {isSortByName && (
          <div
            className="absolute bottom-0 right-0 top-0 flex flex-col justify-center pr-1 md:hidden"
            ref={charactersScrollBarRef}
            id="characters"
          >
            {[...ALPHABET_LIST, OTHER_CHARACTER].map((char, _) => {
              return (
                <span
                  key={char}
                  className="pl-5 text-center text-xs text-neutral-500 transition-all"
                  onClick={() => scrollToCharacter(char)}
                >
                  {char.toLocaleUpperCase()}
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);

InboxList.displayName = 'InboxList';

export default memo(InboxList);

export const isRoomOnline = ({
  room,
  onlineList,
  currentUser,
  isBusiness,
}: {
  room: Room;
  onlineList: string[];
  currentUser: User;
  isBusiness?: boolean;
}) => {
  if (isBusiness) {
    const visitor = room.participants.find(
      (user) => user.status === 'anonymous',
    );
    return visitor && onlineList.includes(visitor._id);
  }
  const participants = room.participants.filter(
    (user) => user._id !== currentUser._id,
  );
  return participants.some((user) => onlineList.includes(user._id));
};
