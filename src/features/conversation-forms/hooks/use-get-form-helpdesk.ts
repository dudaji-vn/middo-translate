'use client';

import { axios } from '@/lib/axios';
import { BusinessForm } from '@/types/forms.type';
import { useQuery } from '@tanstack/react-query';

export const GET_BUSINESS_FORM_HELPDESK_KEY = 'get-business-form-helpdesk';

export const useGetFormHelpdesk = ({
  formId,
  language,
  userId,
}: {
  formId?: string;
  language?: string;
  userId?: string;
}) => {
  return useQuery({
    queryKey: [
      GET_BUSINESS_FORM_HELPDESK_KEY,
      {
        formId,
      },
    ],
    queryFn: async () => {
      if (!formId) {
        return {};
      }
      try {
        const response = await axios.get(
          `help-desk/forms/${formId}`,

          {
            params: {
              language,
              userId,
            },
          },
        );
        return response.data;
      } catch (error) {
        console.error('Error while fetching form helpdesk of:', formId, error);
      }
      return {
        data: {},
      };
    },
    enabled: true,
  });
};
