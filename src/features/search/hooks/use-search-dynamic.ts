import { PK_STATION_KEY } from '@/app/(main-layout)/(protected)/stations/_components/type';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { searchApi } from '../api';
import { useBusinessNavigationData } from '@/hooks';

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
  const { spaceId } = useBusinessNavigationData();

  return useQuery({
    queryFn: () =>
      searchApi.conversations({
        q: searchValue || '',
        type,
        stationId,
        spaceId: spaceId as string,
      }),
    queryKey: ['search', type, searchValue, stationId],
    enabled: !!searchValue,
  });
};
