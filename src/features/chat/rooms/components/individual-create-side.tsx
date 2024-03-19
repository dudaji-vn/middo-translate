'use client';

import { Section, Typography } from '@/components/data-display';

import { Button } from '@/components/actions';
import Link from 'next/link';
import { ROUTE_NAMES } from '@/configs/route-name';
import { SearchInput } from '@/components/data-entry';
import { User } from '@/features/users/types';
import { UserItem } from '@/features/users/components';
import { Users2Icon } from 'lucide-react';
import { searchApi } from '@/features/search/api';
import { useGetUsersRecChat } from '@/features/recommendation/hooks';
import { useParams } from 'next/navigation';
import { useSearch } from '@/hooks/use-search';
import { useSidebarTabs } from '../../hooks';
import { useTranslation } from 'react-i18next';

export interface IndividualSideCreateProps {
  onBack?: () => void;
}

export const IndividualSideCreate = (props: IndividualSideCreateProps) => {
  const { data, setSearchTerm } = useSearch<User[]>(searchApi.users, 'users');
  const { data: recData } = useGetUsersRecChat();
  const { changeSide } = useSidebarTabs();
  const params = useParams();
  const {t} = useTranslation('common');
  const handleCreateGroup = () => {
    changeSide('group');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.currentTarget.value.toLocaleLowerCase());
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-card shadow-sm">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="mt-2 flex items-center gap-2 space-y-1 border-b px-5 pb-5">
          <Typography>{t('CONVERSATION.TO')}: </Typography>
          <SearchInput
            className="flex-1"
            onChange={handleSearch}
            placeholder="Search"
          />
        </div>
        <div className="p-3">
          <Button
            className="w-full"
            shape="square"
            size="md"
            onClick={handleCreateGroup}
          >
            <Users2Icon className="mr-3 h-5 w-5" /> {t('CONVERSATION.NEW_GROUP_CHAT')}
          </Button>
        </div>
        {data && (
          <div className="flex w-full flex-1 flex-col overflow-y-auto px-2">
            {data.map((user) => (
              <Link
                key={user._id}
                href={`${ROUTE_NAMES.ONLINE_CONVERSATION}/${user._id}`}
              >
                <UserItem isActive={user._id === params?.id} user={user} />
              </Link>
            ))}
          </div>
        )}
        {recData && recData.length > 0 && !data && (
          <Section label={t('COMMON.SUGGESTION')}>
            {recData?.map((user) => {
              return (
                <Link key={user?._id} href={`/talk/${user?._id}`}>
                  <UserItem user={user} />
                </Link>
              );
            })}
          </Section>
        )}
      </div>
    </div>
  );
};
