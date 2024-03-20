import { Typography } from '@/components/data-display'
import React from 'react'
import { BusinessLineChart } from './_components/report-chart/business-line-chart'
import ReportCards from './_components/report-cards/report-cards'
import { businessAPI, type AnalyticsType, AnalyticsOptions } from '@/features/chat/business/business.service'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { StatisticData } from '@/types/business-statistic.type'
import ChartFilterDropdown from './_components/report-chart/chart-filter-dropdown'

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
  const statiscticData: StatisticData = await businessAPI.getAnalytics(params as AnalyticsOptions);
  if (!statiscticData) {
    return <div className='m-auto py-10'>
      OPPS! Some thing went wrong!
      <Link href="/business/statistics" className='underline text-primary-500-main'>
        Go back
      </Link>
    </div>
  }
  return (
    <main className='flex flex-col gap-4 w-full'>
      <section className='p-4 space-y-4'>
        <Typography className=" flex flex-row items-center justify-between space-y-0  text-primary-500-main font-medium">
          <span className="text-base font-normal">
            Report
          </span>
          <ChartFilterDropdown searchParams={searchParams} />
        </Typography>
        <ReportCards data={statiscticData} />
        <BusinessLineChart data={statiscticData.chart} />
      </section>

    </main>
  )
}

export default StatisticPage