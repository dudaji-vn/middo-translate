import { axios } from '@/lib/axios';
import { DEFAULT_SCRIPTS_PAGINATION } from '@/types/scripts.type';
import { useQuery } from '@tanstack/react-query';
import { mockScriptData } from './mock-data';

export const GET_CONVERSATION_SCRIPTS_KEY = 'get-conversation-scripts';

export const useGetConversationScripts = ({
  currentPage = DEFAULT_SCRIPTS_PAGINATION.currentPage,
  limit = DEFAULT_SCRIPTS_PAGINATION.limit,
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
      GET_CONVERSATION_SCRIPTS_KEY,
      { search, limit, currentPage, spaceId },
    ],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `/help-desk/spaces/${spaceId}/scripts`,
          {
            params: {
              q: search,
              limit,
              currentPage: currentPage,
            },
          },
        );
        return response.data;
      } catch (error) {
        console.error(
          `Error fetching chat scripts: ${(error as Error).message}`,
        );
        return {
          items: [],
          totalPage: 0,
        };
      }
    },
    enabled: true,
  });
};
