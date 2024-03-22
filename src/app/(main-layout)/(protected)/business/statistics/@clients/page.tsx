import React from 'react'
import { DataTable } from '@/components/ui/data-table'
import { clientsColumns as columns } from '@/app/(main-layout)/(protected)/business/statistics/_components/clients-table/clients-columns'
import moment from 'moment'
import { businessAPI } from '@/features/chat/business/business.service'
import { User } from '@/features/users/types'
import ClientsPagination from '../_components/pagination/clients-pagination'
import { redirect } from 'next/navigation'

export type Client = Pick<User, "_id" | "email" | "name" | "phoneNumber"> & {
  firstConnectDate: string
  lastConnectDate: string
}

const formatClientData = (data: Client[]) => {
  return data?.map((client) => {
    return {
      ...client,
      firstConnectDate: moment(client.firstConnectDate).format('DD/MM/YYYY'),
      lastConnectDate: moment(client.lastConnectDate).format('DD/MM/YYYY')
    };
  }) || [];
}
const limitOptions = [5, 50, 75, 100];
export const DEFAULT_CLIENTS_PAGINATION = {
  limit: limitOptions[0],
  currentPage: 1
}
const page = async ({ searchParams }: {
  searchParams: Record<string, string>
}) => {
  const {
    limit,
    currentPage,
    search
  } = searchParams;
  const newSearchParams = new URLSearchParams(searchParams);



  if (limit && !limitOptions.includes(Number(limit)) || searchParams && Number(searchParams.currentPage) <= 0) {
    newSearchParams.set('limit', String(DEFAULT_CLIENTS_PAGINATION.limit));
    newSearchParams.set('curerentPage', String(DEFAULT_CLIENTS_PAGINATION.currentPage))
    redirect(`/business/statistics?${newSearchParams.toString()}`);
  }
  const paginationParams = {
    limit: Number(limit) || DEFAULT_CLIENTS_PAGINATION.limit,
    currentPage: Number(currentPage) || DEFAULT_CLIENTS_PAGINATION.currentPage
  }
  const { items, totalPage } = await businessAPI.getMyClients({ search, ...paginationParams }).then((res) => {
    return {
      ...res,
      items: formatClientData(res.items)
    }
  })
  if (paginationParams.currentPage > totalPage) {
    newSearchParams.set('currentPage', String(Math.max(totalPage, 1)));
    redirect(`/business/statistics?${newSearchParams.toString()}`);
  }
  const pagination = {
    ...paginationParams,
    totalPage,
    nextPage: Math.min(paginationParams.currentPage + 1, totalPage),
    previousPage: Math.max(paginationParams.currentPage - 1, 1),
    canNextPage: paginationParams.currentPage < totalPage,
    canPreviousPage: paginationParams.currentPage > 1
  }
  return (
    <div className="rounded-md p-0 w-full overflow-x-auto">
      <DataTable columns={columns} data={items}
        cellProps={{
          className: 'max-w-[200px] h-auto break-words'
        }} />
      <ClientsPagination pagination={pagination} limitOptions={limitOptions}/>
    </div>
  )
}

export default page