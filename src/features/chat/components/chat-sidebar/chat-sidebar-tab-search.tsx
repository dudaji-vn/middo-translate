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
import { useBusinessExtensionStore } from '@/stores/extension.store';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useTranslation } from 'react-i18next';
export interface SearchTabProps extends React.HTMLAttributes<HTMLDivElement> { }



export const SearchTab = forwardRef<HTMLDivElement, SearchTabProps>(
  (props, ref) => {
    const searchValue = useSearchStore((state) => state.searchValue);
    const { isBusiness } = useBusinessNavigationData();
    const { data: recData } = useGetRoomsRecChat(isBusiness ? 'help-desk' : undefined);
    const { businessData } = useBusinessExtensionStore()
    const searchType = isBusiness ? 'help-desk' : undefined;
    const {t} = useTranslation('common');
    const { data } = useQuerySearch<{
      rooms: Room[];
      users: User[];
    }>(searchApi.inboxes, 'chat-search', searchValue || '', searchType);

    return (
      <div className="absolute left-0 top-[114px] h-[calc(100%_-_106px)] w-full overflow-y-auto bg-white pt-3 md:top-[106px]">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          ref={ref}
          className="w-full bg-neutral-white"
        >
          {data?.users && data.users.length > 0 && (
            <Section label={t('CONVERSATION.PEOPLE')}>
              {data?.users?.map((user) => {
                return (
                  <Link key={user?._id} href={ROUTE_NAMES.ONLINE_CONVERSATION + '/' + user?._id}>
                    <UserItem user={user} />
                  </Link>
                )
              })}
            </Section>
          )}
          {data?.rooms && data.rooms.length > 0 && (
            <div className="mt-5">
              <Section label={isBusiness ? "Guests" : "Groups"}>
                {data?.rooms.map((room) => (
                  <RoomItem
                    businessId={businessData?._id}
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
            <Section label={t('COMMON.SUGGESTION')}>
              {recData?.map((room) => {
                return (
                  <RoomItem
                    businessId={businessData?._id}
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
