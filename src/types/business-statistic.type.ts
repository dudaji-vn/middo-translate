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
}>;

export const MAPPED_CHARTS_INFO: Record<ESpaceChart, string> = {
  newVisitor: 'New Visitors',
  openedConversation: 'Opened conversations',
  dropRate: 'Response time',
  languageRank: "Conversation's language",
  responseTime: 'Customer rating',
  customerRating: 'Customer rating',
  responsedMessage: 'Response time',
  trafficTrack: 'Traffic track',
};

export const ROWS_PER_PAGE_OPTIONS = [5, 25, 75, 100];
export const DEFAULT_CLIENTS_PAGINATION = {
  limit: ROWS_PER_PAGE_OPTIONS[1],
  currentPage: 1,
  search: '',
};
