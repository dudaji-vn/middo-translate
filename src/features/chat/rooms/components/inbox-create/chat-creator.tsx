'use client';

import { Button } from '@/components/actions';
import Link from 'next/link';
import { PeopleOutline } from '@easy-eva-icons/react';
import { SearchInput } from '@/components/data-entry';
import { Typography } from '@/components/data-display';
import { User } from '@/features/users/types';
import { UserItem } from '@/features/users/components';
import { searchApi } from '@/features/search/api';
import { useParams } from 'next/navigation';
import { useSearch } from '@/hooks/use-search';
import { useSetParams } from '@/hooks/use-set-params';

export interface ChatCreatorProps {
  onBack?: () => void;
}

export const ChatCreator = (props: ChatCreatorProps) => {
  const { data, setSearchTerm } = useSearch<User[]>(searchApi.users);
  const params = useParams();
  const { setParam } = useSetParams();

  const handleCreateGroup = () => {
    setParam('mode', 'new-group');
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-card shadow-sm">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="mt-2 flex items-center gap-2 space-y-1 px-5 pb-5 shadow-1">
          <Typography>To: </Typography>
          <SearchInput
            className="flex-1"
            onChange={(e) =>
              setSearchTerm(e.currentTarget.value.toLocaleLowerCase())
            }
            placeholder="Search"
          />
        </div>
        <div className="p-5">
          <Button
            className="w-full"
            variant="outline"
            size="lg"
            onClick={handleCreateGroup}
          >
            <PeopleOutline className="mr-3 h-5 w-5" /> Create group
          </Button>
        </div>
        <div className="flex w-full flex-1 flex-col overflow-y-auto px-2">
          {data?.map((user) => (
            <Link key={user._id} href={`/talk/${user._id}`}>
              <UserItem isActive={user._id === params?.id} user={user} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
