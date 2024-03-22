import { Typography } from '@/components/data-display'
import React from 'react'
import ChartFilterDropdown from '../_components/report-chart/chart-filter-dropdown'
import ReportCards from '../_components/report-cards/report-cards'
import { BusinessLineChart } from '../_components/report-chart/business-line-chart'
import { StatisticData } from '@/types/business-statistic.type'
import { AnalyticsOptions, businessAPI } from '@/features/chat/business/business.service'
import { EStatisticErrors } from '../error'

const page = async ({ searchParams , params}: any) => {
  const statiscticData: StatisticData = await businessAPI.getAnalytics(params as AnalyticsOptions);
  if (!statiscticData) {
    throw new Error(EStatisticErrors.NO_ANALYSTIC_DATA);
  }
  return (
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
  )
}

export default page