'use client';

import { BusinessTabType } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces';
import { axios } from '@/lib/axios';
import { getBusinessForm } from '@/services/forms.service';
import { useQuery } from '@tanstack/react-query';

export const GET_BUSINESS_FORM_KEY = 'get-business-form-data';

export const useGetFormData = ({
  spaceId,
  formId,
}: {
  spaceId: string;
  formId: string;
}) => {
  return useQuery({
    queryKey: [GET_BUSINESS_FORM_KEY, { spaceId, formId }],
    queryFn: () => {
      try {
        const data = getBusinessForm(spaceId, formId);
        return data;
      } catch (error) {
        console.error('Error while fetching form data of:', formId, error);
      }
    },
    enabled: true,
  });
};
