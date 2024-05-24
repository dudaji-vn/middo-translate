import { TChartKey } from '@/types/business-statistic.type';

export const MAPPED_CHART_UNIT: Record<TChartKey, string> = {
  newVisitor: 'people',
  openedConversation: 'conversation',
  dropRate: 'conversation',
  responseTime: 'millisecond',
  customerRating: 'star',
  responsedMessage: 'message',
  languageRank: 'language',
  trafficTrack: 'opened conversation',
};
export const getProposedTimeUnit = (data: { value: number }[] = []) => {
  const average =
    data.length > 0
      ? data.reduce((acc, item) => acc + item.value, 0) / data.length
      : 0;
  if (average >= 60 * 60 * 24 * 1000) {
    return {
      unit: 'day',
      ratio: 60 * 60 * 24 * 1000,
    };
  }
  if (average >= 60 * 60 * 1000) {
    return {
      unit: 'hour',
      ratio: 60 * 60 * 1000,
    };
  }
  if (average >= 60 * 1000) {
    return {
      unit: 'minute',
      ratio: 60 * 1000,
    };
  }
  if (average >= 1000) {
    return {
      unit: 'second',
      ratio: 1000,
    };
  }
  return { unit: 'millisecond', ratio: 1 };
};
