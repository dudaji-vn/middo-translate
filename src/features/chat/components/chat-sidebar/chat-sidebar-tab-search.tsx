import Link from 'next/link';
import { Room } from '../../rooms/types';
import { RoomItem } from '../../rooms/components/room-item';
import { Section } from '@/components/data-display/section';
import { User } from '@/features/users/types';
import { UserItem } from '@/features/users/components';
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { searchApi } from '@/features/search/api';

import { useGetRoomsRecChat } from '@/features/recommendation/hooks';
import { useQuerySearch } from '@/hooks/use-query-search';
import { useSearchStore } from '@/features/search/store/search.store';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
export interface SearchTabProps extends React.HTMLAttributes<HTMLDivElement> { }



export const SearchTab = forwardRef<HTMLDivElement, SearchTabProps>(
  (props, ref) => {
    const searchValue = useSearchStore((state) => state.searchValue);
    const { data: recData } = useGetRoomsRecChat();
    const { isBusiness, businessConversationType } = useBusinessNavigationData();
    const searchType = isBusiness ? 'help-desk' : undefined;

    const { data, isLoading } = useQuerySearch<{
      rooms: Room[];
      users: User[];
    }>(searchApi.inboxes, 'chat-search', searchValue || '', searchType);
    console.log('data?.users', data?.users)
    console.log('datroooms', data?.rooms)
    console.log('datarec', recData)

    const redirectPath =  '/talk/';
    return (
      <div className="absolute left-0 top-[114px] h-[calc(100%_-_106px)] w-full overflow-y-auto bg-white pt-3 md:top-[106px]">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          ref={ref}
          className="w-full bg-neutral-white"
        >
          {data?.users && data.users.length > 0 && (
            <Section label={isBusiness ? "Guests" : "People"}>
              {data?.users?.map((user) => {
                return (
                  <Link key={user?._id} href={redirectPath + user?._id}>
                    <UserItem user={user} />
                  </Link>
                )
              })}
            </Section>
          )}
          {data?.rooms && data.rooms.length > 0 && (
            <div className="mt-5">
              <Section label="Groups">
                {data?.rooms.map((room) => (
                  <RoomItem
                    disabledAction
                    key={room._id}
                    data={room}
                    showMembersName
                    showTime={false}
                  />
                ))}
              </Section>
            </div>
          )}
          {recData && recData.length > 0 && !searchValue && !data && (
            <Section label="Suggestion">
              {recData?.map((room) => {
                return (
                  <RoomItem
                    disabledAction
                    key={room._id}
                    data={room}
                    showMembersName
                    showTime={false}
                  />
                );
              })}
            </Section>
          )}
        </motion.div>
      </div >
    );
  },
);
SearchTab.displayName = 'SearchTab';
