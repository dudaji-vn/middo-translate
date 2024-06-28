'use client';

import { axios } from '@/lib/axios';
import { getInvitationByToken } from '@/services/business-space.service';
import { useQuery } from '@tanstack/react-query';

export const GET_VERI_KEY = 'get-space-verification';

export const useGetSpaceVerification = (token: string) => {
  return useQuery({
    queryKey: [GET_VERI_KEY, { token }],
    queryFn: async () => {
      try {
        const data = await getInvitationByToken(token);
        if (data.data) {
          return data.data;
        }
        return data;
      } catch (error: any) {
        console.error(
          'Error in get space invitation by token',
          error?.response?.data,
        );
        return {
          data: error?.response?.data || {
            statusCode: 500,
            message: 'Failed to get space invitation',
          },
        };
      }
    },
    enabled: true,
  });
};
