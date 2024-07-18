import { Button } from '@/components/actions';
import { Avatar, Typography } from '@/components/data-display';
import { Circle, Plus } from 'lucide-react';
import Image from 'next/image';
import Link, { LinkProps } from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTE_NAMES } from '@/configs/route-name';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';
import StationsListSkeletons from '../../skeletons/station-list-skeletons';
import { StationTabType, TStation } from '../../type';
import Station from '../station-card/station';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import moment from 'moment';

const PublicStation = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const hasNotification = true;
  return (
    <div className="grid grid-cols-1 gap-4  md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      <Card
        className={cn(
          'relative min-h-[112px] min-w-[280px] max-w-full cursor-pointer gap-2 space-y-3 rounded-[12px] border border-solid border-primary-200 bg-primary-100 px-3 transition-all duration-300 ease-in-out hover:border-primary-500-main dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-primary',
        )}
        onClick={() => {
          router.push(`${ROUTE_NAMES.ONLINE_CONVERSATION}`);
        }}
      >
        <div className="absolute -top-1 right-[10px]">
          <Circle
            size={16}
            className={
              hasNotification
                ? 'absolute inset-0 animate-ping fill-primary-500-main stroke-primary-500-main'
                : 'invisible'
            }
          />
          <Circle
            size={16}
            className={
              hasNotification
                ? 'absolute inset-0 fill-primary-500-main stroke-primary-500-main'
                : 'invisible'
            }
          />
        </div>
        <CardContent className="flex flex-row items-center gap-3 p-0">
          <Avatar
            src={'/icon.png'}
            alt={'avatar'}
            variant={'outline'}
            className="size-[88px] border border-neutral-50 p-1 dark:border-neutral-800"
          />
          <div className="flex flex-col space-y-1">
            <CardTitle className="max-w-36 break-words text-base  font-semibold  leading-[18px] text-neutral-800  dark:text-neutral-50 sm:max-w-44 xl:max-w-56">
              Middo Station
            </CardTitle>
            <span className="text-sm font-light leading-[18px] text-neutral-600 dark:text-neutral-100">
              {t('COMMON.DESCRIBE_MIDDO_STATION')}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicStation;
