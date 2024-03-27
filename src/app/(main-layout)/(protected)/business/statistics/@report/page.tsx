import React from 'react'
import Report from '../_components/report/report'
import { StatisticData } from '@/types/business-statistic.type'
import { businessAPI } from '@/features/chat/help-desk/api/business.service'
import { AnalyticsOptions } from '../_components/report/report-chart/chart-filter-dropdown'


const StatiscticReport = async ({ searchParams }: {
  searchParams: { type: AnalyticsOptions['type'], fromDate: string, toDate: string, search: string }
}) => {
  const { type, fromDate, toDate } = searchParams;
  const params = type === 'custom' ? { custom: { fromDate, toDate }, type } : { type };
  const statiscticData: StatisticData = await businessAPI.getAnalytics(params as AnalyticsOptions);
  if (!statiscticData) {
    throw new Error("NO_ANALYSTIC_DATA");
  }
  return (
    <Report data={statiscticData} />
  )
}

export default StatiscticReport