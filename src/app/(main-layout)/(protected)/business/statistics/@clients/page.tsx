'use client'

import React, { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { clientsColumns as columns } from '@/app/(main-layout)/(protected)/business/statistics/_components/clients-table/clients-columns';
import moment from 'moment';
import { User } from '@/features/users/types';
import ClientsPagination, { ClientPagination } from '../_components/pagination/clients-pagination';
import { useGetClients } from '@/features/statistics/hooks/use-get-clients';

export type Client = Pick<User, "_id" | "email" | "name" | "phoneNumber"> & {
  firstConnectDate: string;
  lastConnectDate: string;
};

const limitOptions = [25, 50, 75, 100];

const formatClientData = (data: Client[]) => {
  return data?.map((client) => ({
    ...client,
    firstConnectDate: moment(client.firstConnectDate).format('DD/MM/YYYY'),
    lastConnectDate: moment(client.lastConnectDate).format('DD/MM/YYYY'),
  })) || [];
};
export const DEFAULT_CLIENTS_PAGINATION = {
  limit: limitOptions[0],
  currentPage: 1,
  search: '',
}
const Page = () => {
  const [currentPage, setCurrentPage] = useState(DEFAULT_CLIENTS_PAGINATION.currentPage);
  const [limit, setLimit] = useState(DEFAULT_CLIENTS_PAGINATION.limit);
  const { data, isLoading, isError } = useGetClients({
    ...DEFAULT_CLIENTS_PAGINATION,
    currentPage,
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
    setCurrentPage(1);
  }
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  }

  if (isError) {
    throw new Error('Error fetching clients');
  }

  return (
    <div className="rounded-md p-0 w-full overflow-x-auto">
      <DataTable columns={columns} data={items}
        cellProps={{
          className: 'max-w-[200px] h-auto break-words'
        }} 
        loading={isLoading}
        skeletonsRows={limit}
        />
      <ClientsPagination pagination={pagination} limitOptions={limitOptions}
        onPageChange={onPageChange} onLimitChange={onLimitChange}
      />
    </div>
  );
};

export default Page;
