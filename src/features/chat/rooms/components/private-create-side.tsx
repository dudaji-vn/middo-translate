'use client';

import { Button } from '@/components/actions';
import Link from 'next/link';
import { SearchInput } from '@/components/data-entry';
import { Typography } from '@/components/data-display';
import { User } from '@/features/users/types';
import { UserItem } from '@/features/users/components';
import { Users2Icon } from 'lucide-react';
import { searchApi } from '@/features/search/api';
import { useChangeInboxSide } from '../hooks/use-change-inbox-side';
import { useGetUsersRecChat } from '@/features/recommendation/hooks/use-get-users-rec-chat';
import { useParams } from 'next/navigation';
import { useSearch } from '@/hooks/use-search';

export interface PrivateCreateSideProps {
  onBack?: () => void;
}

export const PrivateCreateSide = (props: PrivateCreateSideProps) => {
  const { data, setSearchTerm } = useSearch<User[]>(searchApi.users, 'users');
  const { data: recData } = useGetUsersRecChat();
  const { changeSide } = useChangeInboxSide();
  const params = useParams();

  const handleCreateGroup = () => {
    changeSide('new-group');
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-card shadow-sm">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="mt-2 flex items-center gap-2 space-y-1 border-b px-5 pb-5">
          <Typography>To: </Typography>
          <SearchInput
            className="flex-1"
            onChange={(e) =>
              setSearchTerm(e.currentTarget.value.toLocaleLowerCase())
            }
            placeholder="Search"
          />
        </div>
        <div className="p-3">
          <Button
            className="w-full"
            variant="outline"
            size="lg"
            onClick={handleCreateGroup}
          >
            <Users2Icon className="mr-3 h-5 w-5" /> Create group
          </Button>
        </div>
        {data && (
          <div className="flex w-full flex-1 flex-col overflow-y-auto px-2">
            {data.map((user) => (
              <Link key={user._id} href={`/talk/${user._id}`}>
                <UserItem isActive={user._id === params?.id} user={user} />
              </Link>
            ))}
          </div>
        )}
        {recData && recData.length > 0 && !data && (
          <div className="flex w-full flex-1 flex-col overflow-y-auto">
            <Typography
              variant="h5"
              className="pb-2 pl-3 font-normal opacity-60"
            >
              Suggestion
            </Typography>
            {recData?.map((user) => {
              return (
                <Link key={user._id} href={`/talk/${user._id}`}>
                  <UserItem isActive={user._id === params?.id} user={user} />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
