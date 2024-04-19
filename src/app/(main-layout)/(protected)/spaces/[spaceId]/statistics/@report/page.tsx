import React from 'react'
import Report from '../_components/report/report'
import { StatisticData } from '@/types/business-statistic.type'
import { businessAPI } from '@/features/chat/help-desk/api/business.service'
import { AnalyticsOptions } from '../_components/report/report-chart/chart-filter-dropdown'

const emptyStatisticData: StatisticData = {
  client: {
    count: 0,
    rate: 0
  },
  completedConversation: {
    count: 0,
    rate: 0
  },
  responseChat: {
    averageTime: '0',
    rate: 0
  },
  averageRating: 0,
  chart: {
    client: [],
    completedConversation: [],
    responseChat: [],
    averageRating: []
  }
}

const StatiscticReport = async ({ searchParams, params: {
  spaceId
} }: {
  params: {
    spaceId: string
  },
  searchParams: { type: AnalyticsOptions['type'], fromDate: string, toDate: string, search: string }
}) => {
  const { type, fromDate, toDate } = searchParams;
  const baseParams = { type, spaceId };
  const params = {
    ...baseParams,
    ...(type === 'custom' && { custom: { fromDate, toDate } })
  }
  const statiscticData: StatisticData = await businessAPI.getAnalytics(params as AnalyticsOptions);
  return (
    <Report data={statiscticData || emptyStatisticData} />
  )
}

export default StatiscticReport