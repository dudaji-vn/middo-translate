'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';

import { DEFAULT_CLIENTS_PAGINATION } from '@/types/business-statistic.type';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/actions';
import { scriptsColumns } from './_components/column-def/scripts-columns';
import { Plus } from 'lucide-react';
import { useGetConversationScripts } from '@/features/conversation-scripts/hooks/use-get-cnversation-scripts';
import { SearchInput } from '@/components/data-entry';

const Page = ({
  params: { spaceId },
}: {
  params: {
    spaceId: string;
  };
}) => {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useGetConversationScripts({
    search,
    spaceId,
  });
  const items = data?.items || [];

  const onSearchChange = (search: string) => {
    setSearch(search);
  };

  const { t } = useTranslation('common');

  return (
    <section className="relative w-full space-y-4">
      <div className="flex  flex-col justify-center gap-4  px-4 py-3 font-medium md:flex-row md:items-center md:px-10">
        <span>Scripts Management</span>
        <em className="max-md:hidden md:w-1/6 xl:w-1/5" />
        <div className="flex grow gap-4">
          <div className="h-12 grow">
            <SearchInput
              className="w-full"
              onChange={(e) => onSearchChange(e.target.value)}
              onClear={() => onSearchChange('')}
              placeholder={t('SEARCH')}
            />
          </div>
          <div className="h-fit w-fit flex-none ">
            <Button
              className="min-w-fit"
              shape={'square'}
              size="md"
              startIcon={<Plus />}
            >
              Add <span className="max-md:hidden">New Script </span>
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-md px-10 py-3">
        <DataTable
          dividerRow
          columns={scriptsColumns}
          data={items}
          tableHeadProps={{
            className: 'bg-white  border-none',
          }}
          cellProps={{
            className:
              'max-w-[200px] break-words bg-transparent first:rounded-s-xl last:rounded-e-xl py-1',
          }}
          rowProps={{
            className:
              'bg-white even:bg-primary-100 bg-primary-100 h-12 hover:bg-neutral-50',
          }}
          loading={isLoading}
          skeletonsRows={DEFAULT_CLIENTS_PAGINATION.limit}
        />
      </div>
    </section>
  );
};

export default Page;
