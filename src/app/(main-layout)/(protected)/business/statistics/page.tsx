
import { businessAPI } from '@/features/chat/business/business.service'

import { notFound } from 'next/navigation'

const StatisticPage = async () => {

  const businessData = await businessAPI.getMyBusiness();
  if (!businessData) {
    notFound();
  }
  return null
}

export default StatisticPage