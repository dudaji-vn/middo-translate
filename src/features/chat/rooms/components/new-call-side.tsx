'use client';

import { Section } from '@/components/data-display';

import { useGetUsersRecChat } from '@/features/recommendation/hooks';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useCursorPaginationQuery } from '@/hooks';
import { Room } from '../types';
import { useMemo } from 'react';
import { roomApi } from '../api';
import { RoomItem } from './room-item';
import { InfiniteScroll } from '@/components/infinity-scroll';
import CreateInstantCall from './call/create-instant-call';
import { useGetPinnedRooms } from '../hooks/use-pin-room';

export interface IndividualSideCreateProps {
  onBack?: () => void;
}

export const NewCallSide = (props: IndividualSideCreateProps) => {
  const { data: recData } = useGetUsersRecChat();
  const params = useParams();
  const { t } = useTranslation('common');
  const spaceId = params?.spaceId ? String(params?.spaceId) : undefined;
  const currentRoomId = params?.id;
  const key = useMemo(() => {
    if (spaceId) {
      return ['rooms', "all", spaceId];
    }
    return ['rooms', "all",];
  }, [spaceId]);
  const { rooms: pinnedRooms } = useGetPinnedRooms();
  const {
    items: rooms,
    fetchNextPage,
    hasNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useCursorPaginationQuery<Room>({
    queryKey: key,
    queryFn: ({ pageParam }) =>
      roomApi.getRooms({
        cursor: pageParam,
        limit: 10,
        type: 'all',
        spaceId,
      }),
  });


  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-card shadow-sm">
      <div className="flex flex-1 flex-col overflow-hidden">
        {recData && recData.length > 0 && (
          <div className="flex w-full flex-1 flex-col overflow-y-auto px-2 pt-2">
            <Section label={t('COMMON.SUGGESTION')}>
              <InfiniteScroll
                isRefreshing={isRefetching}
                pullToRefresh
                onRefresh={refetch}
                onLoadMore={fetchNextPage}
                hasMore={hasNextPage || false}
                isFetching={isLoading}
                className="flex flex-col"
              >
                {[...pinnedRooms || [], ...rooms].map((room, index) => {
                  return (
                    <RoomItem
                      key={room._id}
                      showTime={false}
                      isShowStatus={false}
                      type={'all'}
                      isForgeShowCallButton={true}
                      isOnline={false}
                      showMembersName={true}
                      data={room}
                      isActive={currentRoomId === room._id}
                      currentRoomId={currentRoomId as string}
                      disabledAction={true}
                    />
                  );
                })}
              </InfiniteScroll>
            </Section>
          </div>
        )}
        <div className='p-3 mt-auto border-t border-neutral-50'>
          <CreateInstantCall />
        </div>

      </div>
    </div>
  );
};
