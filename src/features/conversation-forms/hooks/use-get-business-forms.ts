import { axios } from '@/lib/axios';
import { DEFAULT_FORMS_PAGINATION } from '@/types/forms.type';
import { useQuery } from '@tanstack/react-query';

export const GET_CONVERSATION_FORMS_KEY = 'get-conversation-forms';

export const useGetBusinessForms = ({
  currentPage = DEFAULT_FORMS_PAGINATION.currentPage,
  limit = DEFAULT_FORMS_PAGINATION.limit,
  search = '',
  spaceId,
}: {
  search?: string;
  limit?: number;
  currentPage?: number;
  spaceId?: string;
}) => {
  return useQuery({
    queryKey: [
      GET_CONVERSATION_FORMS_KEY,
      { search, limit, currentPage, spaceId },
    ],
    queryFn: async () => {
      try {
        const response = await axios.get(`/help-desk/spaces/${spaceId}/forms`, {
          params: {
            q: search,
            limit,
            currentPage: currentPage,
          },
        });
        return response.data;
      } catch (error) {
        console.error(`Error fetching chat forms: ${(error as Error).message}`);
        return {
          items: [],
          totalPage: 0,
        };
      }
    },
    enabled: true,
  });
};
