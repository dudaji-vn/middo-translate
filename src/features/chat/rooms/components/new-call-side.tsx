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

export interface IndividualSideCreateProps {
  onBack?: () => void;
}

export const NewCallSide = (props: IndividualSideCreateProps) => {
  const { data, setSearchTerm } = useSearch<User[]>(searchApi.users, 'users');
  const { data: recData } = useGetUsersRecChat();
  const { setCurrentSide } = useSideChatStore();
  const params = useParams();
  const { t } = useTranslation('common');
  const handleCreateGroup = () => {
    setCurrentSide('group');
  };

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
          <div className="flex w-full flex-1 flex-col overflow-y-auto px-2">
            <Section label={t('COMMON.SUGGESTION')}>
              {recData?.map((user) => {
                return (
                  <Link key={user?._id} href={`/talk/${user?._id}`}>
                    <UserItem user={user} />
                  </Link>
                );
              })}
              {recData?.map((user) => {
                return (
                  <Link key={user?._id} href={`/talk/${user?._id}`}>
                    <UserItem user={user} />
                  </Link>
                );
              })}
              {recData?.map((user) => {
                return (
                  <Link key={user?._id} href={`/talk/${user?._id}`}>
                    <UserItem user={user} />
                  </Link>
                );
              })}
            </Section>
          </div>
        )}
        <div className='p-3 mt-auto border-t border-neutral-50'>
          <Button
            shape={'square'}
            color={'primary'}
            variant={'default'}
            className='w-full'
            startIcon={<LinkIcon size={20} />}
            
          >
            {t('CONVERSATION.CREATE_INSTANT_CALL')}
          </Button>
        </div>

      </div>
    </div>
  );
};
