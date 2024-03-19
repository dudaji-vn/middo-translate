import { forwardRef, memo, useEffect, useMemo } from 'react';

import { InboxType } from './inbox';
import { InfiniteScroll } from '@/components/infinity-scroll';
import { Room } from '../../types';
import { RoomItem } from '../room-item';
import { SOCKET_CONFIG } from '@/configs/socket';
import { Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';
import { roomApi } from '@/features/chat/rooms/api';
import socket from '@/lib/socket-io';
import { useAuthStore } from '@/stores/auth.store';
import { useCursorPaginationQuery } from '@/hooks/use-cursor-pagination-query';
import { useParams } from 'next/navigation';
import { useScrollDistanceFromTop } from '@/hooks/use-scroll-distance-from-top';
import useStore from '@/stores/use-store';
import { PinnedRoom } from '../pinned-room';
import { useQueryClient } from '@tanstack/react-query';
import { isEmpty } from 'lodash';
import {
  USE_GET_PINNED_ROOMS_KEY,
  useGetPinnedRooms,
} from '@/features/chat/rooms/hooks/use-pin-room';
import { useChatStore } from '@/features/chat/store';
import { useInboxRouter } from './use-inbox-router';
import { useBusinessExtensionStore } from '@/stores/extension.store';

interface InboxListProps {
  type: InboxType;
}

const InboxList = forwardRef<HTMLDivElement, InboxListProps>(
  ({ type }: InboxListProps, ref) => {
    const currentUser = useStore(useAuthStore, (s) => s.user);
    const params = useParams();
    const { businessData } = useBusinessExtensionStore();
    const currentRoomId = params?.id;
    const { isScrolled, ref: scrollRef } = useScrollDistanceFromTop(1);

    const key = useMemo(() => ['rooms', type], [type]);
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
        roomApi.getRooms({ cursor: pageParam, limit: 10, type }),
    });
    useInboxRouter({ rooms });

    const { rooms: pinnedRooms } = useGetPinnedRooms();

    const queryClient = useQueryClient();

    const updateRoom = (room: Partial<Room> & { _id: string }) => {
      refetch();
      // updateItem(room);
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
      socket.on(SOCKET_CONFIG.EVENTS.ROOM.NEW, addItem);
      socket.on(
        SOCKET_CONFIG.EVENTS.ROOM.UPDATE,
        (payload: { roomId: string; data: Partial<Room> }) => {
          updateRoom({ _id: payload.roomId, ...payload.data });
        },
      );
      socket.on(SOCKET_CONFIG.EVENTS.ROOM.DELETE, deleteRoom);
      socket.on(SOCKET_CONFIG.EVENTS.ROOM.LEAVE, leaveRoom);
      return () => {
        socket.off(SOCKET_CONFIG.EVENTS.ROOM.UPDATE);
        socket.off(SOCKET_CONFIG.EVENTS.ROOM.DELETE);
        socket.off(SOCKET_CONFIG.EVENTS.ROOM.LEAVE);
        socket.off(SOCKET_CONFIG.EVENTS.ROOM.NEW);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!currentUser) return null;
    if (!rooms.length && !isLoading && !pinnedRooms?.length) {
      return (
        <div className="mt-10 bg-card px-4 text-center">
          <Typography variant="h3">Welcome to Middo conversation!</Typography>
          <Typography variant="muted" className="mt-3 block opacity-60">
            Press button belows to start a conversation
          </Typography>
        </div>
      );
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
