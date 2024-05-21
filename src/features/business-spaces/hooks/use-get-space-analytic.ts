'use client';

import { axios } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

export const GET_SPACE_ANALYST_KEY = 'get-space-analytic';

export const useGetSpaceAnalytic = ({ spaceId }: { spaceId: string }) => {
  return useQuery({
    queryKey: [GET_SPACE_ANALYST_KEY, { spaceId }],
    queryFn: async (params: any) => {
      console.log('params', params);
      //TODO: Implement get space analytic with params when BE provide
      try {
        const response = await axios.get(
          `/help-desk/spaces/${spaceId}/analytics`,
          {
            params: {
              spaceId,
            },
          },
        );
        return response.data;
      } catch (error) {
        console.error(
          `Error fetching space ${spaceId}: ${(error as Error).message}`,
        );
        return {};
      }
    },
    enabled: true,
  });
};
