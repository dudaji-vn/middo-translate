import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

const A_MINUTE = 1000 * 60;
const DEFAULT_STALE_TIME = A_MINUTE * 5; // 5 minutes
export function useQuerySearch<T>({
  searchApi,
  queryKey,
  searchTerm,
  businessSpaceParams,
  limit = 10,
}: {
  searchApi: Function;
  queryKey: string;
  searchTerm: string;
  businessSpaceParams?: { type?: string; spaceId?: string };
  limit?: number;
}) {
  const { type, spaceId } = businessSpaceParams || {};
  const params = useParams();
  const stationId = params?.stationId ? String(params.stationId) : undefined;
  const { data, ...rest } = useQuery({
    queryKey: [
      'search' + queryKey,
      { q: searchTerm, type, spaceId, stationId },
    ],
    queryFn: (): T =>
      searchApi({ q: searchTerm, type, spaceId, stationId, limit }),
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
