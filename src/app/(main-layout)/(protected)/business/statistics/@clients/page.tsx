'use client'

import React, { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { clientsColumns as columns } from '@/app/(main-layout)/(protected)/business/statistics/_components/clients-table/clients-columns';
import moment from 'moment';
import { User } from '@/features/users/types';
import ClientsPagination, { ClientPagination } from '../_components/clients-table/pagination/clients-pagination';
import { useGetClients } from '@/features/statistics/hooks/use-get-clients';
import TableSearch from '../_components/clients-table/table-search';
import DownloadButton from '../_components/clients-table/download-button';
import { getClientsTablePerpage, setClientsTablePerpage } from '@/utils/local-storage';
import { DEFAULT_CLIENTS_PAGINATION, ROWS_PER_PAGE_OPTIONS } from '@/types/business-statistic.type';

export type Client = Pick<User, "_id" | "email" | "name" | "phoneNumber"> & {
  firstConnectDate: string;
  lastConnectDate: string;
};

const formatClientData = (data: Client[]) => {
  return data?.map((client) => ({
    ...client,
    firstConnectDate: moment(client.firstConnectDate).format('DD/MM/YYYY'),
    lastConnectDate: moment(client.lastConnectDate).format('DD/MM/YYYY'),
  })) || [];
};

const Page = () => {
  const [currentPage, setCurrentPage] = useState(DEFAULT_CLIENTS_PAGINATION.currentPage);
  const [limit, setLimit] = useState(getClientsTablePerpage());
  const [search, setSearch] = useState('')
  const { data, isLoading, isError } = useGetClients({
    ...DEFAULT_CLIENTS_PAGINATION,
    currentPage,
    search,
    limit
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
  }
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  }
  const onSearchChange = (search: string) => {
    setSearch(search)
  }
  if (isError) {
    throw new Error('Error fetching clients');
  }

  return (
    <section className='space-y-4 w-full relative'>
      <div className="md:grid-cols-[20%_50%_30%] xl:grid-cols-[10%_70%_20%] grid-cols-6 grid items-center gap-4  font-medium w-full ">
        <span className="text-base font-normal max-md:col-span-6 text-primary-500-main">
          Clients List
        </span>
        <div className='max-md:col-span-5'>
          <TableSearch className='py-2 w-full' onSearch={onSearchChange} search={search} />
        </div>
        <div className='max-md:col-span-1'>
          <DownloadButton data={items} colInfo={[
            { name: "Name", width: 20 },
            { name: "Email", width: 30 },
            { name: "Phone Number", width: 15 },
            { name: "First Connect Date", width: 20 },
            { name: "Last Connect Date", width: 20 },
          ]} />
        </div>
      </div>
      <div className="rounded-md p-0 w-full overflow-x-auto">
        <DataTable columns={columns} data={items}
          cellProps={{
            className: 'max-w-[200px] h-auto break-words'
          }}
          loading={isLoading}
          skeletonsRows={limit}
        />
        <ClientsPagination pagination={pagination} limitOptions={ROWS_PER_PAGE_OPTIONS}
          onPageChange={onPageChange} onLimitChange={onLimitChange}
        />
      </div>
    </section>
  );
};

export default Page;
