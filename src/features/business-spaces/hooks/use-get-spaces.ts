'use client';

import { BusinessTabType } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces';
import { axios } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

export const GET_SPACES_KEY = 'get-spaces';

export const useGetSpaces = ({ type }: { type?: BusinessTabType }) => {
  return useQuery({
    queryKey: [GET_SPACES_KEY, { type }],
    queryFn: async () => {
      try {
        const response = await axios.get(`/help-desk/spaces`, {
          params: {
            type,
          },
        });
        return response.data;
      } catch (error) {
        console.error(`Error fetching spaces: ${error as Error}`);
        return {};
      }
    },
    enabled: true,
  });
};
