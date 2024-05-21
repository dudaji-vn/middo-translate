export type TChartKey =
  | 'newVisitor'
  | 'openedConversation'
  | 'dropRate'
  | 'responseTime'
  | 'customerRating'
  | 'responseMessage';
export type StatisticData = Record<
  TChartKey,
  {
    value: number;
    total?: number;
    growth: number;
  }
>;

export const MAPPED_CHARTS_INFO: Record<TChartKey, string> = {
  newVisitor: 'New Visitors',
  openedConversation: 'Opened conversations',
  dropRate: 'Response time',
  responseTime: 'Customer rating',
  customerRating: 'Customer rating',
  responseMessage: 'Response time',
};

export const ROWS_PER_PAGE_OPTIONS = [5, 25, 75, 100];
export const DEFAULT_CLIENTS_PAGINATION = {
  limit: ROWS_PER_PAGE_OPTIONS[1],
  currentPage: 1,
  search: '',
};
