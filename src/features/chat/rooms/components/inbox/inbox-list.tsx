import { forwardRef, memo, useEffect, useMemo } from 'react';

import { Button } from '@/components/actions';
import { InboxItem } from '../inbox-item';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Room } from '../../types';
import { SOCKET_CONFIG } from '@/configs/socket';
import { Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';
import { inboxTypeMap } from './inbox-main-tab';
import { roomApi } from '@/features/chat/rooms/api';
import socket from '@/lib/socket-io';
import useAuthStore from '@/features/auth/stores/use-auth-store';
import { useCursorPaginationQuery } from '@/hooks/use-cursor-pagination-query';
import { useParams } from 'next/navigation';
import { useScrollDistanceFromTop } from '@/hooks/use-scroll-distance-from-top';
import useStore from '@/stores/use-store';

interface InboxListProps {
  type: keyof typeof inboxTypeMap;
}

const InboxList = forwardRef<HTMLDivElement, InboxListProps>(
  ({ type }: InboxListProps, ref) => {
    const currentUserId = useStore(useAuthStore, (s) => s.user?._id);
    const params = useParams();
    const currentRoomId = params?.id;
    const { isScrolled, ref: scrollRef } = useScrollDistanceFromTop(1);
    const key = useMemo(() => ['rooms', type], [type]);

    const {
      items: rooms,
      refetch,
      fetchNextPage,
      hasNextPage,
      isLoading,
    } = useCursorPaginationQuery<Room>({
      queryKey: key,
      queryFn: ({ pageParam }) =>
        roomApi.getRooms({ cursor: pageParam, limit: 10, type }),
    });

    const updateRoom = (room: Partial<Room>) => {
      // will be updated in the future, not refetch but update the data

      refetch();
    };

    const deleteRoom = (roomId: string) => {
      // will be updated in the future, not refetch but update the data
      refetch();
    };

    const leaveRoom = (roomId: string) => {
      // will be updated in the future, not refetch but update the data
      refetch();
    };

    useEffect(() => {
      socket.on(
        SOCKET_CONFIG.EVENTS.ROOM.UPDATE,
        (payload: { roomId: string; data: Partial<Room> }) => {
          updateRoom(payload.data);
        },
      );
      socket.on(SOCKET_CONFIG.EVENTS.ROOM.DELETE, (roomId: string) => {
        deleteRoom(roomId);
      });
      socket.on(SOCKET_CONFIG.EVENTS.ROOM.LEAVE, (roomId: string) => {
        leaveRoom(roomId);
      });
      return () => {
        socket.off(SOCKET_CONFIG.EVENTS.ROOM.UPDATE);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (rooms.length === 0 && !isLoading) {
      return (
        <div className="bg-card px-4">
          <Typography variant="h3">Welcome to your inbox!</Typography>
          <Typography variant="muted" className="text-lg">
            Create a new conversation to get started.
          </Typography>

          <Button className="mt-2">New conversation</Button>
        </div>
      );
    }

    return (
      <div ref={ref} className="relative h-full w-full overflow-hidden ">
        {isScrolled && (
          <div className="absolute left-0 right-0 top-0 z-10 h-0.5 w-full shadow-1"></div>
        )}
        <div
          id="scrollableDiv"
          ref={scrollRef}
          className={cn('h-full gap-2 overflow-y-auto')}
        >
          <InfiniteScroll
            scrollableTarget="scrollableDiv"
            dataLength={rooms.length}
            next={fetchNextPage}
            hasMore={hasNextPage || false}
            loader={<h4>Loading...</h4>}
            refreshFunction={refetch}
            pullDownToRefresh
            pullDownToRefreshThreshold={50}
            className="flex flex-col"
            pullDownToRefreshContent={
              <h3 style={{ textAlign: 'center' }}>
                &#8595; Pull down to refresh
              </h3>
            }
            releaseToRefreshContent={
              <h3 style={{ textAlign: 'center' }}>
                &#8593; Release to refresh
              </h3>
            }
          >
            {rooms.map((room) => (
              <InboxItem
                key={room._id}
                data={room}
                isActive={currentRoomId === room._id}
                currentUserId={currentUserId!}
                currentRoomId={currentRoomId as string}
              />
            ))}
          </InfiniteScroll>
        </div>
      </div>
    );
  },
);

InboxList.displayName = 'InboxList';

export default memo(InboxList);
