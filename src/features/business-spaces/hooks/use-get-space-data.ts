'use client';

import { BusinessTabType } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces';
import { axios } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

export const GET_SPACE_DATA_KEY = 'get-space-data';

export const useGetSpaceData = ({ spaceId }: { spaceId: string }) => {
  return useQuery({
    queryKey: [GET_SPACE_DATA_KEY, { spaceId }],
    queryFn: async () => {
      try {
        const response = await axios.get(`/help-desk/spaces/${spaceId}`, {
          params: {
            spaceId,
          },
        });
        return response.data;
      } catch (error) {
        console.error(
          `Error fetching space ${spaceId} from useGetSpaceData: ${error as Error}`,
        );
        return {};
      }
    },
    enabled: true,
  });
};
