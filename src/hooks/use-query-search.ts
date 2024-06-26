import { useQuery } from '@tanstack/react-query';

const A_MINUTE = 1000 * 60;
const DEFAULT_STALE_TIME = A_MINUTE * 5; // 5 minutes
export function useQuerySearch<T>({
  searchApi,
  queryKey,
  searchTerm,
  helpdeskParams,
}: {
  searchApi: Function;
  queryKey: string;
  searchTerm: string;
  helpdeskParams?: { type?: string; spaceId?: string };
}) {
  const { type, spaceId } = helpdeskParams || {};
  const { data, ...rest } = useQuery({
    queryKey: ['search' + queryKey, { q: searchTerm, type, spaceId }],
    queryFn: (): T => searchApi({ q: searchTerm, type, spaceId, limit: 3 }),
    enabled: !!searchTerm,
    // staleTime: DEFAULT_STALE_TIME, // 5 minutes
    keepPreviousData: true,
  });

  return {
    searchTerm,
    data: data,
    ...rest,
  };
}
