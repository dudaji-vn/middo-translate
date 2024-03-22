
import { businessAPI } from '@/features/chat/business/business.service'

import { notFound } from 'next/navigation'
export enum EStatisticErrors {
  NO_ANALYSTIC_DATA = "NO_ANALYSTIC_DATA",
  NEXT_NOT_FOUND = "NEXT_NOT_FOUND"
}

const StatisticPage = async () => {
  const businessData = await businessAPI.getMyBusiness();
  if (!businessData) {
    notFound();
  }
  return <></>
}

export default StatisticPage