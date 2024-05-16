import { axios } from '@/lib/axios';
import { DEFAULT_CLIENTS_PAGINATION } from '@/types/business-statistic.type';
import { useQuery } from '@tanstack/react-query';

export const GET_CLIENTS_KEY = 'get-my-clients';

export const useGetClients = ({
  currentPage = DEFAULT_CLIENTS_PAGINATION.currentPage,
  limit = DEFAULT_CLIENTS_PAGINATION.limit,
  search = '',
  spaceId,
}: {
  search?: string;
  limit?: number;
  currentPage?: number;
  spaceId?: string;
}) => {
  return useQuery({
    queryKey: [GET_CLIENTS_KEY, { search, limit, currentPage, spaceId }],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `/help-desk/spaces/${spaceId}/my-clients`,
          {
            params: {
              q: search,
              limit,
              currentPage: currentPage,
              spaceId,
            },
          },
        );
        return response.data;
      } catch (error) {
        console.error(`Error fetching clients: ${(error as Error).message}`);
        return {
          items: [],
          totalPage: 0,
        };
      }
    },
    enabled: true,
  });
};
