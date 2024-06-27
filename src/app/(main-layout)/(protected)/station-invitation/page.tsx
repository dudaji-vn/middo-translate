'use client';

import { ExpiredVerifyToken } from '@/components/verifications/expired-verify-token';
import { ROUTE_NAMES } from '@/configs/route-name';
import { stationApi } from '@/features/stations/api/stations.api';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const StationInvitationPage = () => {
  const searchParams = useSearchParams();
  const [expired, setExpired] = useState(false);
  const router = useRouter();
  const url = window.location.href;
  const { error, isSuccess, isLoading } = useQuery({
    queryKey: ['station-invitation'],
    queryFn: () =>
      stationApi.joinByInvitationLink({
        link: url,
        stationId: searchParams?.get('stationId') || '',
      }),
  });
  useEffect(() => {
    if (isLoading) return;
    const errorAxios = error as AxiosError;
    if (isSuccess || errorAxios?.response?.status === 409) {
      router.push(
        `${ROUTE_NAMES.STATIONS}/${searchParams?.get('stationId')}/conversations`,
      );
      return;
    }
    setExpired(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isSuccess, isLoading]);
  if (isLoading) {
    return null;
  }
  if (expired && !isLoading && !isSuccess) {
    return <ExpiredVerifyToken token="" />;
  }
  return (
    <main className="flex h-[calc(100vh-52px)] items-center justify-center  px-8 md:px-2  "></main>
  );
};

export default StationInvitationPage;
