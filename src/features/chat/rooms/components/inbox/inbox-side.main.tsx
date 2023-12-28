import { ArrowLeftIcon, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Typography,
} from '@/components/data-display';
import { SearchInput, SearchInputRef, Switch } from '@/components/data-entry';
import { Tabs, TabsList, TabsTrigger } from '@/components/navigation';
import { forwardRef, useRef, useState } from 'react';

import { Button } from '@/components/actions/button';
import { InboxItem } from '../inbox-item';
import InboxList from './inbox-list';
import Link from 'next/link';
import { Room } from '../../types';
import { User } from '@/features/users/types';
import { UserItem } from '@/features/users/components';
import { cn } from '@/utils/cn';
import { searchApi } from '@/features/search/api';
import { stopPropagation } from '@/utils/stop-propagation';
import { useAuthStore } from '@/stores/auth';
import { useChatStore } from '@/features/chat/store';
import { useGetUsersRecChat } from '@/features/recommendation/hooks';
import { useSearch } from '@/hooks/use-search';

export type InboxType = 'all' | 'group';
export const inboxTabMap: Record<
  InboxType,
  {
    label: string;
    value: InboxType;
  }
> = {
  all: {
    label: 'All',
    value: 'all',
  },
  group: {
    label: 'Group',
    value: 'group',
  },
};
export interface InboxSideMainProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const InboxSideMain = forwardRef<HTMLDivElement, InboxSideMainProps>(
  (props, ref) => {
    const [isSearch, setIsSearch] = useState(false);
    const [isOpenDropdown, setOpenDropdown] = useState(false);
    const { data: recData } = useGetUsersRecChat();
    const searchInputRef = useRef<SearchInputRef>(null);
    const [type, setType] = useState<InboxType>('all');
    const { data, setSearchTerm } = useSearch<{
      rooms: Room[];
      users: User[];
    }>(searchApi.inboxes, 'inboxes');
    const currentUser = useAuthStore((state) => state.user);
    const closeSearch = () => {
      setIsSearch(false);
      setSearchTerm('');
      searchInputRef.current?.reset?.();
      searchInputRef.current?.blur?.();
    };

    const {
      showTranslateOnType,
      toggleShowTranslateOnType,
      showMiddleTranslation,
      toggleShowMiddleTranslation,
    } = useChatStore();
    return (
      <div
        ref={ref}
        {...props}
        className="flex h-full flex-col overflow-hidden"
      >
        <div className="flex w-full gap-1 px-3">
          {isSearch && (
            <Button.Icon
              variant="ghost"
              color="default"
              onClick={closeSearch}
              className="-ml-2"
            >
              <ArrowLeftIcon />
            </Button.Icon>
          )}
          <div className="flex-1">
            <SearchInput
              ref={searchInputRef}
              onFocus={() => setIsSearch(true)}
              btnDisabled
              placeholder="Search people or groups"
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
            />
          </div>
          {!isSearch && (
            <DropdownMenu open={isOpenDropdown} onOpenChange={setOpenDropdown}>
              <DropdownMenuTrigger asChild>
                <Button.Icon
                  variant="ghost"
                  color="default"
                  onClick={() => setIsSearch(false)}
                  className="-mr-2"
                >
                  <Settings />
                </Button.Icon>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="overflow-hidden rounded-2xl border bg-background p-0 shadow-3"
                onClick={() => setOpenDropdown(false)}
              >
                <div
                  className={cn(
                    'flex items-center justify-between gap-5 bg-background p-5',
                  )}
                >
                  <span>Translate tool</span>
                  <Switch
                    onClick={stopPropagation}
                    checked={showTranslateOnType}
                    onCheckedChange={toggleShowTranslateOnType}
                  />
                </div>
                <div
                  className={cn(
                    'flex items-center justify-between gap-5 bg-background p-5',
                  )}
                >
                  <span>Message translate</span>
                  <Switch
                    onClick={stopPropagation}
                    checked={showMiddleTranslation}
                    onCheckedChange={toggleShowMiddleTranslation}
                  />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="relative flex flex-1 flex-col overflow-hidden">
          <Tabs defaultValue="all" className="w-full px-3">
            <TabsList>
              {Object.values(inboxTabMap).map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  onClick={() => setType(tab.value)}
                  className="!rounded-none"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <InboxList type={type} />
          {isSearch && (
            <div className="absolute left-0 top-0 h-full w-full overflow-y-auto bg-card">
              {data && (
                <>
                  {data?.users && data.users.length > 0 && (
                    <SearchSection label="People">
                      {data?.users?.map((user) => (
                        <Link key={user?._id} href={`/talk/${user?._id}`}>
                          <UserItem onClick={closeSearch} user={user} />
                        </Link>
                      ))}
                    </SearchSection>
                  )}
                </>
              )}
              {data?.rooms && data.rooms.length > 0 && (
                <div className="mt-5">
                  <SearchSection label="Groups">
                    {data?.rooms.map((room) => (
                      <InboxItem
                        key={room._id}
                        data={room}
                        currentUser={currentUser!}
                        showMembersName
                        showTime={false}
                      />
                    ))}
                  </SearchSection>
                </div>
              )}
              {recData && recData.length > 0 && !data && (
                <SearchSection label="Suggestion">
                  {recData?.map((user) => {
                    return (
                      <Link key={user?._id} href={`/talk/${user?._id}`}>
                        <UserItem user={user} />
                      </Link>
                    );
                  })}
                </SearchSection>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);
InboxSideMain.displayName = 'InboxSideMain';

const SearchSection = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="mt-3">
      <div className="pb-2 pl-3">
        <Typography variant="h5" className="font-normal opacity-60">
          {label}
        </Typography>
      </div>
      <div>{children}</div>
    </div>
  );
};
