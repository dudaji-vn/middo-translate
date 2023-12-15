import { forwardRef, memo, useEffect, useMemo } from 'react';

import { Button } from '@/components/actions';
import { InboxItem } from '../inbox-item';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MessagePlusIcon } from '@/components/icons';
import { Room } from '../../types';
import { SOCKET_CONFIG } from '@/configs/socket';
import { Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';
import { inboxTypeMap } from './inbox-main-side';
import { roomApi } from '@/features/chat/rooms/api';
import socket from '@/lib/socket-io';
import { useAuthStore } from '@/stores/auth';
import { useChangeInboxSide } from '../../hooks/use-change-inbox-side';
import { useCursorPaginationQuery } from '@/hooks/use-cursor-pagination-query';
import { useParams } from 'next/navigation';
import { useScrollDistanceFromTop } from '@/hooks/use-scroll-distance-from-top';
import useStore from '@/stores/use-store';

interface InboxListProps {
  type: keyof typeof inboxTypeMap;
}

const InboxList = forwardRef<HTMLDivElement, InboxListProps>(
  ({ type }: InboxListProps, ref) => {
    const currentUser = useStore(useAuthStore, (s) => s.user);
    const params = useParams();
    const currentRoomId = params?.id;
    const { isScrolled, ref: scrollRef } = useScrollDistanceFromTop(1);
    const { changeSide } = useChangeInboxSide();
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
          console.log('update room', payload);
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

    if (!currentUser) return null;

    if (rooms.length === 0 && !isLoading) {
      return (
        <>
          <div className="mt-10 bg-card px-4 text-center">
            <Typography variant="h3">Welcome to Middo conversation!</Typography>
            <Typography variant="muted" className="mt-3 block opacity-60">
              Press button belows to start a conversation
            </Typography>
          </div>
          <div className="absolute bottom-14 right-5">
            {
              <div className="absolute left-0 top-0 h-full w-full animate-ping-cs rounded-full border border-secondary"></div>
            }
            <Button.Icon
              size="lg"
              onClick={() => changeSide('new-message')}
              className="relative shadow-3"
            >
              <MessagePlusIcon />
            </Button.Icon>
          </div>
        </>
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
            className="flex flex-col"
          >
            {rooms.map((room) => (
              <InboxItem
                key={room._id}
                data={room}
                isActive={currentRoomId === room._id}
                currentUser={currentUser!}
                currentRoomId={currentRoomId as string}
              />
            ))}
          </InfiniteScroll>
        </div>
        <div className="absolute bottom-14 right-5">
          <Button.Icon
            size="lg"
            onClick={() => changeSide('new-message')}
            className="relative shadow-3"
          >
            <MessagePlusIcon />
          </Button.Icon>
        </div>
      </div>
    );
  },
);

InboxList.displayName = 'InboxList';

export default memo(InboxList);
