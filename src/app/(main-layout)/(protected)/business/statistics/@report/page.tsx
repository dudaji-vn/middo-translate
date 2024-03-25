import React from 'react'
import Report from '../_components/report/report'
import { BusinessLineChart } from '../_components/report/report-chart/business-line-chart'
import { StatisticData } from '@/types/business-statistic.type'
import { businessAPI } from '@/features/chat/help-desk/api/business.service'
import { AnalyticsOptions } from '../_components/report/report-chart/chart-filter-dropdown'


const StatiscticReport = async ({ params }: { params: AnalyticsOptions }) => {
  const statiscticData: StatisticData = await businessAPI.getAnalytics(params);
  if (!statiscticData) {
    throw new Error("NO_ANALYSTIC_DATA");
  }
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return (
    <>
      <Report data={statiscticData} />
    </>
  )
}

export default StatiscticReport