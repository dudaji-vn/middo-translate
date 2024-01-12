import Link from 'next/link';
import { Room } from '../../rooms/types';
import { RoomItem } from '../../rooms/components/room-item';
import { SPK_SEARCH } from '../../configs';
import { Section } from '@/components/data-display/section';
import { User } from '@/features/users/types';
import { UserItem } from '@/features/users/components';
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { searchApi } from '@/features/search/api';
import { useAuthStore } from '@/stores/auth.store';
import { useGetUsersRecChat } from '@/features/recommendation/hooks';
import { useQuerySearch } from '@/hooks/use-query-search';
import { useSearchParams } from 'next/navigation';

export interface SearchTabProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SearchTab = forwardRef<HTMLDivElement, SearchTabProps>(
  (props, ref) => {
    const searchParams = useSearchParams();
    const value = searchParams?.get(SPK_SEARCH);
    const { data: recData } = useGetUsersRecChat();
    const { data } = useQuerySearch<{
      rooms: Room[];
      users: User[];
    }>(searchApi.inboxes, 'chat-search', value || '');
    const currentUser = useAuthStore((state) => state.user);
    return (
      <div className="absolute left-0 top-[106px] h-[calc(100%_-_106px)] w-full overflow-y-auto bg-white pt-3">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          ref={ref}
          className="w-full bg-neutral-white"
        >
          {data?.users && data.users.length > 0 && (
            <Section label="People">
              {data?.users?.map((user) => (
                <Link key={user?._id} href={`/talk/${user?._id}`}>
                  <UserItem user={user} />
                </Link>
              ))}
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
                    currentUser={currentUser!}
                    showMembersName
                    showTime={false}
                  />
                ))}
              </Section>
            </div>
          )}
          {recData && recData.length > 0 && !data && (
            <Section label="Suggestion">
              {recData?.map((user) => {
                return (
                  <Link key={user?._id} href={`/talk/${user?._id}`}>
                    <UserItem user={user} />
                  </Link>
                );
              })}
            </Section>
          )}
        </motion.div>
      </div>
    );
  },
);
SearchTab.displayName = 'SearchTab';
