import { forwardRef, memo, useEffect, useMemo } from 'react';

import { InfiniteScroll } from '@/components/infinity-scroll';
import { SOCKET_CONFIG } from '@/configs/socket';
import { roomApi } from '@/features/chat/rooms/api';
import {
  USE_GET_PINNED_ROOMS_KEY,
  useGetPinnedRooms,
} from '@/features/chat/rooms/hooks/use-pin-room';
import { useChatStore } from '@/features/chat/store';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { useCursorPaginationQuery } from '@/hooks/use-cursor-pagination-query';
import { useScrollDistanceFromTop } from '@/hooks/use-scroll-distance-from-top';
import socket from '@/lib/socket-io';
import { useAuthStore } from '@/stores/auth.store';
import { useBusinessExtensionStore } from '@/stores/extension.store';
import useStore from '@/stores/use-store';
import { cn } from '@/utils/cn';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Room } from '../../types';
import { PinnedRoom } from '../pinned-room';
import { RoomItem } from '../room-item';
import { EmptyInbox } from './empty-inbox';
import { InboxType } from './inbox';
import { useInboxRouter } from './use-inbox-router';

interface InboxListProps {
  type: InboxType;
}

const InboxList = forwardRef<HTMLDivElement, InboxListProps>(
  ({ type }: InboxListProps, ref) => {
    const currentUser = useStore(useAuthStore, (s) => s.user);
    const params = useParams();
    const { inboxStatus: status, businessRoomId } = useBusinessNavigationData();
    const { businessData } = useBusinessExtensionStore();
    const currentRoomId = params?.id || businessRoomId;
    const { isScrolled, ref: scrollRef } = useScrollDistanceFromTop(1);

    const key = useMemo(() => ['rooms', type, status], [type, status]);
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
    } = useCursorPaginationQuery<Room>({
      queryKey: key,
      queryFn: ({ pageParam }) =>
        roomApi.getRooms({ cursor: pageParam, limit: 10, type, status }),
    });

    useInboxRouter({ rooms });

    const { rooms: pinnedRooms, refetch: refetchPinned } = useGetPinnedRooms();

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

    if (!currentUser) return null;

    if (!rooms.length && !isLoading && !pinnedRooms?.length) {
      return <EmptyInbox type={type} />;
    }

    return (
      <div ref={ref} className="relative h-full w-full flex-1 overflow-hidden ">
        {isScrolled && (
          <div className="absolute left-0 right-0 top-0 z-10 h-0.5 w-full shadow-1"></div>
        )}
        <div
          id="scrollableDiv"
          ref={scrollRef}
          className={cn('h-full gap-2 overflow-y-auto')}
        >
          <InfiniteScroll
            onLoadMore={fetchNextPage}
            hasMore={hasNextPage || false}
            isFetching={isLoading}
            className="flex flex-col"
          >
            <PinnedRoom
              type={type}
              rooms={pinnedRooms}
              currentRoomId={currentRoomId as string}
            />
            {rooms.map((room) => {
              const participants = room.participants.filter(
                (user) => user._id !== currentUser._id,
              );
              const isOnline = participants.some((user) =>
                onlineList.includes(user._id),
              );
              return (
                <RoomItem
                  isOnline={isOnline}
                  key={room._id}
                  data={room}
                  isActive={currentRoomId === room._id}
                  currentRoomId={currentRoomId as string}
                  businessId={businessData?._id}
                />
              );
            })}
          </InfiniteScroll>
        </div>
      </div>
    );
  },
);

InboxList.displayName = 'InboxList';

export default memo(InboxList);
