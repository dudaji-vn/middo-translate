import { Typography } from '@/components/data-display'
import React from 'react'
import { BusinessLineChart } from './_components/report-chart/business-line-chart'
import ReportCards from './_components/report-cards/report-cards'
import { businessAPI, AnalyticsOptions } from '@/features/chat/business/business.service'
import { StatisticData } from '@/types/business-statistic.type'
import ChartFilterDropdown from './_components/report-chart/chart-filter-dropdown'
import TableSearch from './_components/clients-table/table-search'
import { Client, clientsColumns as columns } from './_components/clients-table/clients-columns'
import { DataTable } from '@/components/ui/data-table'
import DownloadButton from './_components/clients-table/download-button'
import moment from 'moment'
import { notFound } from 'next/navigation'
import { EStatisticErrors } from './error'


const formatClientData = (data: Client[]) => {
  return data?.map((client) => {
    return {
      ...client,
      firstConnectDate: moment(client.firstConnectDate).format('DD/MM/YYYY'),
      lastConnectDate: moment(client.lastConnectDate).format('DD/MM/YYYY')
    };
  }) || [];
}


const StatisticPage = async ({
  searchParams
}: {
  searchParams: {
    type: string
    fromDate: string
    toDate: string

    search: string
  }
}) => {
  const {
    type,
    fromDate,
    toDate,
    search
  } = searchParams;
  const params = type === 'custom' ? {
    type,
    custom: {
      fromDate,
      toDate
    },
    search
  } : {
    type,
    search
  }
  const businessData = await businessAPI.getMyBusiness();
  if (!businessData) {
    notFound();
  }
  const statiscticData: StatisticData = await businessAPI.getAnalytics(params as AnalyticsOptions);
  if (!statiscticData) {
    throw new Error(EStatisticErrors.NO_ANALYSTIC_DATA);
  }

  const clientsData = await businessAPI.getMyClients({ search }).then(formatClientData);


  return (
    <main className='flex flex-col gap-4 w-full p-4'>
      <section className='space-y-4'>
        <Typography className=" flex flex-row items-center justify-between space-y-0  text-primary-500-main font-medium">
          <span className="text-base font-normal">
            Report
          </span>
          <ChartFilterDropdown searchParams={searchParams} />
        </Typography>
        <ReportCards data={statiscticData} />
        <BusinessLineChart data={statiscticData.chart} />
      </section>
      <section className='space-y-4 w-full'>
        <div className="md:grid-cols-[10%_70%_20%] grid-cols-6 grid items-center gap-4  font-medium w-full ">
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
        <DataTable columns={columns} data={clientsData} />
      </section>
    </main>
  )
}

export default StatisticPage