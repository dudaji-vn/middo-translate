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
        const res = await getInvitationByToken(token);
        return res?.data;
      } catch (error: unknown) {
        console.error('Error in get space invitation by token', error);
        return {
          statusCode: 500,
          error: 'Failed to get space invitation',
        };
      }
    },
    enabled: true,
  });
};
