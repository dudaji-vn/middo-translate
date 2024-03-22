import React from 'react'
import { DataTable } from '@/components/ui/data-table'
import {  clientsColumns as columns } from '@/app/(main-layout)/(protected)/business/statistics/_components/clients-table/clients-columns'
import moment from 'moment'
import { businessAPI } from '@/features/chat/business/business.service'
import { User } from '@/features/users/types'

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

export const DEFAULT_CLIENTS_PAGINATION = {
  limit: 50,
  currentPage: 1
}
const page = async ({ searchParams }: any) => {
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
  })

  return (

      <div className="rounded-md p-0 w-full overflow-x-auto">
        <DataTable columns={columns} data={clientsData.items} />
      </div>
  )
}

export default page