import React from 'react'
import ReportCards from '../_components/report-cards/report-cards'
import { BusinessLineChart } from '../_components/report-chart/business-line-chart'
import { StatisticData } from '@/types/business-statistic.type'
import { businessAPI } from '@/features/chat/help-desk/api/business.service'
import { AnalyticsOptions } from '../_components/report-chart/chart-filter-dropdown'


const StatiscticReport = async ({ params }: { params: AnalyticsOptions }) => {
  const statiscticData: StatisticData = await businessAPI.getAnalytics(params);
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

export default StatiscticReport