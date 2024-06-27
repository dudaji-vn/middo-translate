import { PK_STATION_KEY } from '@/app/(main-layout)/(protected)/stations/_components/type';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export function useSearch<T>(searchApi: Function, queryKey: string) {
  const params = useParams();
  const stationId = params?.[PK_STATION_KEY]
    ? String(params[PK_STATION_KEY])
    : undefined;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { data } = useQuery({
    queryKey: ['search' + queryKey, { q: searchTerm, stationId }],
    queryFn: (): T =>
      searchApi({
        q: searchTerm,
        stationId,
      }),
    enabled: !!searchTerm,
    staleTime: 1000 * 60 * 5, // 5 minutes
    // keepPreviousData: true,
  });

  return {
    searchTerm,
    setSearchTerm,
    stationId,
    data: data,
  };
}
