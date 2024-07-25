import { axios } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

export const GET_FORMS_INFO_KEY = 'get-conversation-forms-names';

export const useGetFormsNames = ({ spaceId }: { spaceId: string }) => {
  return useQuery({
    queryKey: [GET_FORMS_INFO_KEY, { spaceId }],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `/help-desk/spaces/${spaceId}/forms-names`,
        );
        return response.data;
      } catch (error) {
        console.error(`Error fetching forms name: ${(error as Error).message}`);
        return null;
      }
    },
    enabled: true,
  });
};
