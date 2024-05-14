'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { clientsColumns as columns } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/clients/clients-table/clients-columns';
import moment from 'moment';
import { User } from '@/features/users/types';
import {
  getClientsTablePerpage,
  setClientsTablePerpage,
} from '@/utils/local-storage';
import {
  DEFAULT_CLIENTS_PAGINATION,
  ROWS_PER_PAGE_OPTIONS,
} from '@/types/business-statistic.type';
import { useTranslation } from 'react-i18next';
import DownloadButton from './clients-table/download-button';
import { SearchInput } from '@/components/data-entry';
import ClientsPagination, {
  ClientPagination,
} from './clients-table/pagination/clients-pagination';
import { useGetClients } from '@/features/statistics/hooks/use-get-clients';

export type Client = Pick<User, '_id' | 'email' | 'name' | 'phoneNumber'> & {
  firstConnectDate: string;
  lastConnectDate: string;
};

const formatClientData = (data: Client[]) => {
  return (
    data?.map((client) => ({
      ...client,
      firstConnectDate: moment(client.firstConnectDate).format('DD/MM/YYYY'),
      lastConnectDate: moment(client.lastConnectDate).format('DD/MM/YYYY'),
    })) || []
  );
};

const Page = ({
  params: { spaceId },
}: {
  params: {
    spaceId: string;
  };
}) => {
  const [currentPage, setCurrentPage] = useState(
    DEFAULT_CLIENTS_PAGINATION.currentPage,
  );
  const [limit, setLimit] = useState(getClientsTablePerpage());
  const [search, setSearch] = useState('');
  const { data, isLoading, isError } = useGetClients({
    ...DEFAULT_CLIENTS_PAGINATION,
    currentPage,
    search,
    limit,
    spaceId,
  });
  const items = formatClientData(data?.items || []);
  const totalPage = data?.totalPage || 0;

  const pagination: ClientPagination = {
    limit: limit,
    currentPage,
    totalPage: totalPage || 0,
    nextPage: currentPage < totalPage ? currentPage + 1 : null,
    previousPage: currentPage > 1 ? currentPage - 1 : null,
    canNextPage: totalPage > 1 && currentPage < totalPage,
    canPreviousPage: totalPage > 1 && currentPage > 1,
  };

  const onLimitChange = (limit: number) => {
    setLimit(limit);
    setClientsTablePerpage(limit);
    setCurrentPage(1);
  };
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
  const onSearchChange = (search: string) => {
    setSearch(search);
  };

  const { t } = useTranslation('common');
  const exportData = items.map((item) => ({
    Name: item.name,
    Email: item.email,
    'Phone Number': item.phoneNumber,
    'First Connect Date': item.firstConnectDate,
    'Last Connect Date': item.lastConnectDate,
  }));
  return (
    <section className="relative w-full">
      <div className="flex  flex-col justify-center gap-4  px-4 py-3 font-medium md:flex-row md:items-center md:px-10">
        <span>Clients List</span>
        <em className="max-md:hidden md:w-1/6 xl:w-1/5" />
        <div className="flex grow gap-4">
          <div className="h-12 grow">
            <SearchInput
              className="w-full"
              onChange={(e) => onSearchChange(e.target.value)}
              onClear={() => onSearchChange('')}
              placeholder={t('BUSINESS.SCRIPT.SEARCH')}
            />
          </div>
          <div className="h-fit w-fit flex-none ">
            <DownloadButton
              data={exportData}
              colInfo={[
                { name: 'Name', width: 20 },
                { name: 'Email', width: 30 },
                { name: 'Phone Number', width: 15 },
                { name: 'First Connect Date', width: 20 },
                { name: 'Last Connect Date', width: 20 },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-md px-10 py-3">
        <DataTable
          dividerRow
          columns={columns}
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
        <ClientsPagination
          pagination={pagination}
          limitOptions={ROWS_PER_PAGE_OPTIONS}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      </div>
    </section>
  );
};

export default Page;
