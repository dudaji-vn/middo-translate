import { PK_STATION_KEY } from '@/app/(main-layout)/(protected)/stations/_components/type';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { searchApi } from '../api';

type DynamicType = 'user' | 'message' | 'group';

export const useSearchDynamic = ({
  searchValue,
  type,
}: {
  searchValue: string;
  type: DynamicType;
}) => {
  const params = useParams();
  const stationId = params?.[PK_STATION_KEY]
    ? String(params[PK_STATION_KEY])
    : undefined;

  return useQuery({
    queryFn: () =>
      searchApi.conversations({ q: searchValue || '', type, stationId }),
    queryKey: ['search', type, searchValue, stationId],
    enabled: !!searchValue,
  });
};
