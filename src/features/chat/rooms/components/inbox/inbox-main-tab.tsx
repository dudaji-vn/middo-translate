import { ArrowBackOutline, Options2Outline } from '@easy-eva-icons/react';
import { forwardRef, useState } from 'react';

import { Button } from '@/components/actions/button';
import { InboxItem } from '../inbox-item';
import InboxList from './inbox-list';
import Link from 'next/link';
import { Room } from '../../types';
import { SearchInput } from '@/components/data-entry';
import { Typography } from '@/components/data-display';
import { User } from '@/features/users/types';
import { UserItem } from '@/features/users/components';
import { searchApi } from '@/features/search/api';
import { useAuthStore } from '@/stores/auth';
import { useSearch } from '@/hooks/use-search';

export const inboxTypeMap = {
  all: 'all',
  unread: 'unread',
};

export interface InboxMainTabProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const InboxMainTab = forwardRef<HTMLDivElement, InboxMainTabProps>(
  (props, ref) => {
    const [isSearch, setIsSearch] = useState(false);

    const [type, setType] = useState<keyof typeof inboxTypeMap>('all');
    const { data, setSearchTerm } = useSearch<{
      rooms: Room[];
      users: User[];
    }>(searchApi.inboxes);
    const currentUserId = useAuthStore((state) => state.user?._id);
    const closeSearch = () => {
      setIsSearch(false);
      setSearchTerm('');
    };
    return (
      <div
        ref={ref}
        {...props}
        className="flex h-full flex-col overflow-hidden"
      >
        <div className="flex w-full gap-1 px-4 py-2">
          {isSearch && (
            <Button.Icon
              variant="ghost"
              color="default"
              onClick={() => setIsSearch(false)}
              className="-ml-2"
            >
              <ArrowBackOutline />
            </Button.Icon>
          )}
          <div className="flex-1">
            <SearchInput
              onFocus={() => setIsSearch(true)}
              btnDisabled
              placeholder="Search people or groups"
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
            />
          </div>
          {!isSearch && (
            <Button.Icon
              variant="ghost"
              color="default"
              onClick={() => setIsSearch(false)}
              className="-mr-2"
            >
              <Options2Outline />
            </Button.Icon>
          )}
        </div>
        <div className="relative flex flex-1 flex-col overflow-hidden">
          <InboxList type={type} />
          {isSearch && (
            <div className="absolute left-0 top-0 h-full w-full overflow-y-auto bg-card px-2">
              {data?.users && data.users.length > 0 && (
                <SearchSection label="People">
                  {data?.users.map((user) => (
                    <Link key={user._id} href={`/talk/${user._id}`}>
                      <UserItem user={user} />
                    </Link>
                  ))}
                </SearchSection>
              )}
              <div className="mt-5">
                {data?.rooms && data.rooms.length > 0 && (
                  <SearchSection label="Groups">
                    {data?.rooms.map((room) => (
                      <InboxItem
                        key={room._id}
                        data={room}
                        currentUserId={currentUserId!}
                        showMembersName
                        showTime={false}
                      />
                    ))}
                  </SearchSection>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
);
InboxMainTab.displayName = 'InboxMainTab';

const SearchSection = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="pb-2">
      <div className="pl-2">
        <Typography variant="h5" className="font-normal opacity-60">
          {label}
        </Typography>
      </div>
      <div>{children}</div>
    </div>
  );
};
