'use client';

import { axios } from '@/lib/axios';
import { BusinessForm } from '@/types/forms.type';
import { useQuery } from '@tanstack/react-query';

export const GET_BUSINESS_FORM_KEY = 'get-business-form-data';

export const useGetFormData = ({
  spaceId,
  formId,
  currentPage,
  search,
  limit,
}: {
  spaceId: string;
  formId: string;
  currentPage?: number;
  search?: string;
  limit?: number;
}) => {
  return useQuery<
    BusinessForm & {
      totalPage: number;
      totalSubmissions: number;
    }
  >({
    queryKey: [
      GET_BUSINESS_FORM_KEY,
      {
        spaceId,
        formId,
        currentPage,
        search,
        limit,
      },
    ],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `/help-desk/spaces/${spaceId}/forms/${formId}`,
          {
            params: {
              q: search,
              limit,
              currentPage: currentPage,
              spaceId,
            },
          },
        );
        console.log('response FORM', response);
        return response.data;
      } catch (error) {
        console.error('Error while fetching form data of:', formId, error);
      }
      return {
        data: {},
      };
    },
    enabled: true,
  });
};
