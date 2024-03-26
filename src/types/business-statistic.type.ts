export type TChartKey =
  | 'client'
  | 'completedConversation'
  | 'averageRating'
  | 'responseChat';
export type StatisticData = {
  client: {
    count: number;
    rate: number;
  };
  completedConversation: {
    count: number;
    rate: number;
  };
  averageRating: number;
  responseChat: {
    averageTime: string;
    rate: number;
  };
  chart: Record<TChartKey, { label: string; value: number }[]>;
};

export const MAPPED_CHARTS_INFO_KEY: Record<
  TChartKey,
  {
    label: string;
    value: string;
  }
> = {
  client: {
    label: 'Times',
    value: 'New Clients',
  },
  completedConversation: {
    label: 'Times',
    value: 'Completed conversations',
  },
  averageRating: {
    label: 'Times',
    value: 'Customer rating',
  },
  responseChat: {
    label: 'Times',
    value: 'Response time',
  },
};

export const ROWS_PER_PAGE_OPTIONS = [5, 25, 75, 100];
export const DEFAULT_CLIENTS_PAGINATION = {
  limit: ROWS_PER_PAGE_OPTIONS[0],
  currentPage: 1,
  search: '',
}


