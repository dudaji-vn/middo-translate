import { TChartKey } from '@/types/business-statistic.type';

export const MAPPED_CHART_UNIT: Record<TChartKey, string> = {
  newVisitor: 'people',
  openedConversation: 'conversation',
  dropRate: '%',
  responseTime: 'ms',
  customerRating: 'star',
  responseMessage: 'message',
};
export const getMaxUnit = (data: { value: number }[] = []) => {
  const min = Math.min(
    ...data.filter((item) => item?.value > 0).map((item) => item?.value),
  );
  if (min > 60 * 60 * 1000) {
    return {
      unit: 'hour',
      ratio: 60 * 60 * 1000,
    };
  }
  if (min > 60 * 1000) {
    return {
      unit: 'minute',
      ratio: 60 * 1000,
    };
  }
  if (min > 1000) {
    return {
      unit: 'second',
      ratio: 1000,
    };
  }
  return { unit: 'millisecond', ratio: 1 };
};
