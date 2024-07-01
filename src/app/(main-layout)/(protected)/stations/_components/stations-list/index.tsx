'use client';

import { Typography } from '@/components/data-display';
import {
  Blocks,
  Key,
  KeyIcon,
  User2Icon,
  User as UserIcon,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import { useGetStations } from '@/features/stations/hooks/use-get-stations';
import React, { useMemo } from 'react';
import { StationTabItem, StationTabType } from '../type';
import PublicStation from './public-station';
import WorkStations from './work-stations';

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
  const [tab] = React.useState<StationTabType>('all_stations');
  const searchParams = useSearchParams();

  const { data: stations_list, isLoading } = useGetStations({
    type: tab,
  });
  const modal = useMemo(() => {
    const modal = searchParams?.get('modal');
    if (modal === 'create-station') return modal;
    return null;
  }, [searchParams]);

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
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1">
              <div className="flex size-5 items-center justify-center rounded-full bg-primary text-white">
                <KeyIcon size={12} />
              </div>
              <span className="text-sm text-neutral-600 dark:text-neutral-200">
                My Station
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex size-5 items-center justify-center rounded-full bg-secondary text-primary">
                <User2Icon size={12} />
              </div>
              <span className="ext-neutral-600 text-sm dark:text-neutral-200">
                Joined Station
              </span>
            </div>
          </div>
        </div>
        <WorkStations stations={stations_list} loading={isLoading} />
      </section>
    </div>
  );
};
export default StationsList;
