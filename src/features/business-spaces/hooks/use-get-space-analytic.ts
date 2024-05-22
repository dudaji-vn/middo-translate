'use client';

import { axios } from '@/lib/axios';
import {
  AnalysisData,
  ChartData,
  TLanguageRank,
} from '@/types/business-statistic.type';
import { useQuery } from '@tanstack/react-query';

export const GET_SPACE_ANALYST_KEY = 'get-space-analytic';

export type AnalyticsFilterDate = {
  fromDate: string;
  toDate: string;
};
export type AnalyticsType = 'last-week' | 'last-month' | 'last-year' | 'custom';
export const analyticsType = ['last-week', 'last-month', 'last-year', 'custom'];
type TData = {
  analysis: AnalysisData;
  chart: ChartData;
  conversationLanguage: TLanguageRank;
};
export type AnalyticsOptions = {
  type: AnalyticsType;
  spaceId: string;

  memberId?: string;
  domain?: string;
} & (
  | {
      type: 'custom';
      custom: AnalyticsFilterDate;
    }
  | {
      type: Exclude<'last-week' | 'last-month' | 'last-year', 'custom'>;
      custom?: never;
    }
);
export const useGetSpaceAnalytic = ({
  type = 'last-week',
  custom,
  spaceId,
  domain,
  memberId,
}: AnalyticsOptions) => {
  return useQuery<unknown, unknown, TData>({
    queryKey: [
      GET_SPACE_ANALYST_KEY,
      { spaceId, type, custom, domain, memberId },
    ],
    queryFn: async () => {
      try {
        if (!analyticsType.includes(type)) {
          throw new Error('Invalid analytics type');
        }
        if (type === 'custom' && !custom) {
          throw new Error('Invalid from date and to date');
        }
        const query = new URLSearchParams({
          type,
          spaceId,
          ...(custom && {
            fromDate: custom.fromDate,
            toDate: custom.toDate,
          }),
          ...(domain && { domain }),
          ...(memberId && { memberId }),
        }).toString();
        const path = `/help-desk/spaces/${spaceId}/analytics?${query}`;
        const response = await axios.get(path);
        return response.data as TData;
      } catch (error) {
        console.error(
          `Error fetching space ${spaceId}: ${(error as Error).message}`,
        );
        return {
          analysis: {},
          chart: {},
          conversationLanguage: [],
        };
      }
    },
    enabled: true,
  });
};
