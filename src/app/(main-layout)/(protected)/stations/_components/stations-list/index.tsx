'use client';

import { Button } from '@/components/actions';
import { Avatar, Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';
import { Blocks, Key, Plus, User as UserIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import React, { useMemo } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useTranslation } from 'react-i18next';
import { useGetStations } from '@/features/stations/hooks/use-get-spaces';
import PublicStation from './public-station';
import WorkStations from './work-stations';
import { StationTabItem, StationTabType } from '../type';

const tabItems: StationTabItem[] = [
  {
    value: 'all_stations',
    label: 'ALL_SPACE',
    icon: <Blocks />,
    componentProps: {
      className: '',
    },
  },
  {
    value: 'my_stations',
    label: 'MY_SPACE',
    icon: <Key />,
  },
  {
    value: 'joined_stations',
    label: 'JOINED_SPACE',
    icon: <UserIcon />,
  },
];
const StationsList = () => {
  const [tab, setTab] = React.useState<StationTabType>('all_stations');
  const currentUser = useAuthStore((s) => s.user);
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();

  const { data: stations_list, isLoading } = useGetStations({
    type: tab,
  });
  const modal = useMemo(() => {
    const modal = searchParams?.get('modal');
    if (modal === 'create-station') return modal;
    return null;
  }, [searchParams]);

  const router = useRouter();
  return (
    <div className="flex w-full flex-col gap-4 px-[5vw] py-4">
      <section
        className={
          modal ? 'hidden' : 'flex flex-col gap-4  dark:text-neutral-50'
        }
      >
        <div className="flex flex-row items-center justify-between border-b border-neutral-50 pb-2 dark:border-neutral-700">
          <Typography className=" text-center text-base font-normal leading-[18px] text-neutral-500">
            PUBLIC STATION
          </Typography>
        </div>
        <PublicStation />
      </section>
      <section
        className={
          modal ? 'hidden' : 'flex flex-col gap-4 dark:text-neutral-50'
        }
      >
        <div className="flex flex-row items-center justify-between  border-b  border-neutral-50 pb-2 dark:border-neutral-700">
          <Typography className=" text-center text-base font-normal leading-[18px] text-neutral-500">
            WORK STATIONS
          </Typography>
        </div>
        <WorkStations stations={stations_list} loading={isLoading} />
      </section>
    </div>
  );
};
export default StationsList;
