export type TChartKey =
  | 'newVisitor'
  | 'openedConversation'
  | 'languageRank'
  | 'trafficTrack'
  | 'dropRate'
  | 'responseTime'
  | 'customerRating'
  | 'responsedMessage';
export enum ESpaceChart {
  NEW_VISITOR = 'newVisitor',
  OPENED_CONVERSATION = 'openedConversation',
  LANGUAGE_RANK = 'languageRank',
  TRAFFIC_TRACK = 'trafficTrack',
  DROP_RATE = 'dropRate',
  RESPONSE_TIME = 'responseTime',
  CUSTOMER_RATING = 'customerRating',
  RESPONSE_MESSAGE = 'responsedMessage',
}

export const CHART_TOOLTIP_CONTENT: Record<ESpaceChart, string> = {
  newVisitor: 'The number of new visitors to your website',
  openedConversation: 'The number of opened conversations',
  dropRate: 'The rate of dropped conversations',
  responseTime: 'The average response time',
  customerRating: 'The average customer rating',
  responsedMessage: 'The average response message',
  languageRank: 'The rank of languages',
  trafficTrack: 'The traffic track of conversations',
};
export type AnalysisData = Record<
  ESpaceChart,
  {
    value: number;
    total?: number;
    growth: number;
  }
>;
export type ChartData = Record<string, Array<{ label: string; value: number }>>;
export type TLanguageRank = Array<{
  language: string;
  count: number;
  total: number;
}>;
export type TTraficTrack = Array<{
  x: number;
  y: number;
  density: number;
  openedConversation: Array<{
    count: number;
    language: string;
  }>;
}>;

export const ROWS_PER_PAGE_OPTIONS = [5, 25, 75, 100];
export const DEFAULT_CLIENTS_PAGINATION = {
  limit: ROWS_PER_PAGE_OPTIONS[1],
  currentPage: 1,
  search: '',
};
