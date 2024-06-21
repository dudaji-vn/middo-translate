import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link, { LinkProps } from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTE_NAMES } from '@/configs/route-name';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';
import StationsListSkeletons from '../../skeletons/station-list-skeletons';
import Station from '../station-card/station';
import { TStation } from '../../type';
import { useRouter } from 'next/navigation';

function StationCreateButton({}: {} & React.HTMLAttributes<HTMLDivElement>) {
  const { t } = useTranslation('common');
  const router = useRouter();
  return (
    <Card
      className={cn(
        'relative flex min-h-[112px] min-w-[280px] max-w-full cursor-pointer items-center justify-center  space-y-3 rounded-[12px] border  border-dashed  border-primary-500-main bg-primary-100 p-3 transition-all duration-300 ease-in-out hover:border-primary-500-main dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-primary',
      )}
      onClick={() => {
        router.push(`${ROUTE_NAMES.STATIONS}?modal=create-station`);
      }}
    >
      <Typography className="m-auto flex flex-row gap-2 text-primary">
        <Plus size={20} />
        ADD WORK STATION
      </Typography>
    </Card>
  );
}

const WorkStations = ({
  loading = false,
  stations = [],
}: {
  stations: TStation[];
  loading?: boolean;
}) => {
  const currentUser = useAuthStore((s) => s.user);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      <StationCreateButton />
      {loading && <StationsListSkeletons count={3} />}
      {stations?.map((stn, index) => {
        return <Station key={stn._id} data={stn} />;
      })}
    </div>
  );
};

export default WorkStations;
