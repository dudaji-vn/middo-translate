'use client';

import { Section, Typography } from '@/components/data-display';

import { Button } from '@/components/actions';
import Link from 'next/link';
import { ROUTE_NAMES } from '@/configs/route-name';
import { SearchInput } from '@/components/data-entry';
import { User } from '@/features/users/types';
import { UserItem } from '@/features/users/components';
import { LinkIcon, Users2Icon } from 'lucide-react';
import { searchApi } from '@/features/search/api';
import { useGetUsersRecChat } from '@/features/recommendation/hooks';
import { useParams } from 'next/navigation';
import { useSearch } from '@/hooks/use-search';
import { useTranslation } from 'react-i18next';
import { useSideChatStore } from '../../stores/side-chat.store';
import { useCursorPaginationQuery } from '@/hooks';
import { Room } from '../types';
import { useMemo } from 'react';
import { roomApi } from '../api';
import { RoomItem } from './room-item';
import { InfiniteScroll } from '@/components/infinity-scroll';
import CreateInstantCall from './call/create-instant-call';

export interface IndividualSideCreateProps {
  onBack?: () => void;
}

export const NewCallSide = (props: IndividualSideCreateProps) => {
  const { data, setSearchTerm } = useSearch<User[]>(searchApi.users, 'users');
  const { data: recData } = useGetUsersRecChat();
  const { setCurrentSide } = useSideChatStore();
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
        type: 'all',
        spaceId,
      }),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.currentTarget.value.toLocaleLowerCase());
  };


  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-card shadow-sm">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="mt-2 flex items-center gap-2 space-y-1 border-b px-5 pb-5">
          <SearchInput
            className="flex-1"
            onChange={handleSearch}
            placeholder={t('CONVERSATION.SEARCH')}
          />
        </div>
        {recData && recData.length > 0 && !data && (
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
                {rooms.map((room, index) => {
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
