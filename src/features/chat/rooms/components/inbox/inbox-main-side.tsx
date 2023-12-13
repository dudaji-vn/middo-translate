import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Typography,
} from '@/components/data-display';
import { SearchInput, SearchInputRef, Switch } from '@/components/data-entry';
import { forwardRef, useRef, useState } from 'react';

import { ArrowBackOutline } from '@easy-eva-icons/react';
import { Button } from '@/components/actions/button';
import { InboxItem } from '../inbox-item';
import InboxList from './inbox-list';
import Link from 'next/link';
import { Room } from '../../types';
import { Settings } from 'lucide-react';
import { User } from '@/features/users/types';
import { UserItem } from '@/features/users/components';
import { cn } from '@/utils/cn';
import { searchApi } from '@/features/search/api';
import { stopPropagation } from '@/utils/stop-propagation';
import { useAuthStore } from '@/stores/auth';
import { useChatStore } from '@/features/chat/store';
import { useSearch } from '@/hooks/use-search';

export const inboxTypeMap = {
  all: 'all',
  unread: 'unread',
};

export interface InboxMainSideProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const InboxMainSide = forwardRef<HTMLDivElement, InboxMainSideProps>(
  (props, ref) => {
    const [isSearch, setIsSearch] = useState(false);
    const [isOpenDropdown, setOpenDropdown] = useState(false);

    const searchInputRef = useRef<SearchInputRef>(null);

    const [type, setType] = useState<keyof typeof inboxTypeMap>('all');
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
        <div className="flex w-full gap-1 p-5 pt-0">
          {isSearch && (
            <Button.Icon
              variant="ghost"
              color="default"
              onClick={closeSearch}
              className="-ml-2"
            >
              <ArrowBackOutline />
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
          <InboxList type={type} />
          {isSearch && (
            <div className="absolute left-0 top-0 h-full w-full overflow-y-auto bg-card px-2">
              {data && (
                <>
                  {data?.users && data.users.length > 0 && (
                    <SearchSection label="People">
                      {data?.users.map((user) => (
                        <Link key={user._id} href={`/talk/${user._id}`}>
                          <UserItem onClick={closeSearch} user={user} />
                        </Link>
                      ))}
                    </SearchSection>
                  )}
                </>
              )}
              <div className="mt-5">
                {data?.rooms && data.rooms.length > 0 && (
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
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
);
InboxMainSide.displayName = 'InboxMainSide';

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
