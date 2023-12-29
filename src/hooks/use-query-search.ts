import { useQuery } from '@tanstack/react-query';

export function useQuerySearch<T>(
  searchApi: Function,
  queryKey: string,
  searchTerm: string,
) {
  const { data, ...rest } = useQuery({
    queryKey: ['search' + queryKey, { q: searchTerm }],
    queryFn: (): T => searchApi({ q: searchTerm }),
    enabled: !!searchTerm,
    staleTime: 1000 * 60 * 5, // 5 minutes
    // keepPreviousData: true,
  });

  return {
    searchTerm,
    data: data,
    ...rest,
  };
}
