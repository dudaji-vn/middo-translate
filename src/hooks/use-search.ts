import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export function useSearch<T>(searchApi: Function, queryKey: string) {
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { data } = useQuery({
    queryKey: ['search' + queryKey, { q: searchTerm }],
    queryFn: (): T => searchApi({ q: searchTerm }),
    enabled: !!searchTerm,
    staleTime: 1000 * 60 * 5, // 5 minutes
    // keepPreviousData: true,
  });

  return {
    searchTerm,
    setSearchTerm,
    data: data,
  };
}
