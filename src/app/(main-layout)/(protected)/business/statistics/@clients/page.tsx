import React from 'react'
import TableSearch from '../_components/clients-table/table-search'
import DownloadButton from '../_components/clients-table/download-button'
import { DataTable } from '@/components/ui/data-table'
import { Client, clientsColumns as columns } from '@/app/(main-layout)/(protected)/business/statistics/_components/clients-table/clients-columns'
import moment from 'moment'
import { businessAPI } from '@/features/chat/business/business.service'

const formatClientData = (data: Client[]) => {
  return data?.map((client) => {
    return {
      ...client,
      firstConnectDate: moment(client.firstConnectDate).format('DD/MM/YYYY'),
      lastConnectDate: moment(client.lastConnectDate).format('DD/MM/YYYY')
    };
  }) || [];
}

export const DEFAULT_CLIENTS_PAGINATION = {
  limit: 50,
  currentPage: 1
}
const page = async ({ searchParams}: any) => {
  const {
    limit,
    currentPage,
    search
  } = searchParams;  
  const pagination = {
    limit: limit || DEFAULT_CLIENTS_PAGINATION.limit,
    currentPage: currentPage || DEFAULT_CLIENTS_PAGINATION.currentPage
  }
  const clientsData = await businessAPI.getMyClients({ search, ...pagination }).then((res) => {
    return {
      ...res,
      items: formatClientData(res.items)
    }
  });

  return (
    <section className='space-y-4 w-full'>
      <div className="md:grid-cols-[20%_50%_30%] xl:grid-cols-[10%_70%_20%] grid-cols-6 grid items-center gap-4  font-medium w-full ">
        <span className="text-base font-normal max-md:col-span-6 text-primary-500-main">
          Clients List
        </span>
        <div className='max-md:col-span-5'>
          <TableSearch className='py-2 w-full' searchParams={searchParams} />
        </div>
        <div className='max-md:col-span-1'>
          <DownloadButton />
        </div>
      </div>
      <div className="rounded-md p-0 w-full overflow-x-auto">
        <DataTable columns={columns} data={clientsData.items} />
      </div>
    </section>
  )
}

export default page