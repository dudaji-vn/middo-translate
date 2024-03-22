import React from 'react'
import ReportCards from '../_components/report-cards/report-cards'
import { BusinessLineChart } from '../_components/report-chart/business-line-chart'
import { StatisticData } from '@/types/business-statistic.type'
import { AnalyticsOptions, businessAPI } from '@/features/chat/business/business.service'


const page = async ({  params}: any) => {
  const statiscticData: StatisticData = await businessAPI.getAnalytics(params as AnalyticsOptions);
  if (!statiscticData) {
    throw new Error("NO_ANALYSTIC_DATA");
  }
  return (
    <>
      <ReportCards data={statiscticData} />
      <BusinessLineChart data={statiscticData.chart} />
    </>
  )
}

export default page