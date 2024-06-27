import Ping from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces/ping/ping';
import { Button } from '@/components/actions';
import {
  Avatar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTE_NAMES } from '@/configs/route-name';
import { usePlatformStore } from '@/features/platform/stores';
import { useGetStations } from '@/features/stations/hooks/use-get-spaces';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/utils/cn';
import { DropdownMenuTriggerProps } from '@radix-ui/react-dropdown-menu';
import { ChevronDown, Home, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useResizeObserver } from 'usehooks-ts';
import { TStation } from '../../../_components/type';

interface Item {
  name: string | React.ReactNode;
  href: string;
  isActive?: boolean;
  pathToInclude: string;
  station?: TStation;
}

const StationNavigator = ({ ...props }: DropdownMenuTriggerProps) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isMobile = usePlatformStore((state) => state.platform) === 'mobile';
  const triggerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);

  const { t } = useTranslation('common');
  const { data: stations, isLoading } = useGetStations({
    type: 'all_stations',
  });
  const { workStation: station } = useAuthStore();

  const items: Item[] = useMemo(() => {
    if (isLoading || !stations || !station) {
      return [];
    }
    return (
      stations?.map((s: TStation) => ({
        name: s.name,
        href:
          `${ROUTE_NAMES.STATIONS}/${s._id}/conversations` +
          (isMobile ? '?platform=mobile' : ''),
        pathToInclude: `${ROUTE_NAMES.STATIONS}/${s._id}`,
        isActive: pathname?.includes(`${ROUTE_NAMES.STATIONS}/${s._id}`),
        station: s,
      })) ?? []
    );
  }, [station, stations, pathname]);

  const hasNotification = useMemo(() => {
    return stations?.some(
      (s: TStation) =>
        !pathname?.includes(`stations/${s._id}`) &&
        Number(s.totalNewMessages) > 0,
    );
  }, [stations]);

  useEffect(() => {
    if (triggerRef.current) {
      setWidth(triggerRef.current.clientWidth);
    }
  }, [stations]);

  if (isLoading || !station || !pathname?.includes(station?._id)) {
    return (
      <div
        className={cn(
          'flex h-fit  w-full flex-row items-center justify-start  bg-white p-2 text-neutral-500 dark:bg-neutral-900',
          props.className,
        )}
      >
        <Skeleton className="relative size-[50px] rounded-[8px] bg-primary-100 dark:bg-neutral-800">
          <div className="absolute inset-2 rounded-full border border-neutral-50 bg-white dark:border-neutral-800 dark:bg-neutral-900" />
        </Skeleton>
      </div>
    );
  }
  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          {...props}
          className={cn(
            'flex h-fit w-full !bg-transparent p-2 text-neutral-800  active:!bg-transparent',
            props.className,
            'min-w-[200px]  max-w-full',
          )}
        >
          <div
            ref={triggerRef}
            className="relative flex w-full flex-row items-center justify-start gap-3  rounded-[12px] bg-primary-100 p-2 dark:bg-neutral-900 dark:text-neutral-50"
          >
            {station?.avatar && (
              <Avatar
                alt={station.name ?? ''}
                size="sm"
                src={String(station.avatar)}
                className="border border-neutral-50 bg-white dark:border-neutral-900 dark:bg-neutral-900"
              />
            )}
            <div
              className={
                ' flex flex-grow flex-row items-center justify-start gap-1 '
              }
            >
              <p className="font-semibold">{station?.name}</p>
              <ChevronDown className="h-4 w-4" />
            </div>
            <Ping
              size={12}
              className={cn('absolute right-[6px] top-[20px]', 'right-4', {
                hidden: !hasNotification,
              })}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[360px] max-w-full border-none p-0 shadow-[2px_10px_24px_2px_#1616161A] dark:border-neutral-800 dark:bg-neutral-900"
          sideOffset={-4}
          alignOffset={8}
          style={{
            width: width,
          }}
        >
          <div className="h-fit max-h-96 w-full overflow-y-auto ">
            {items?.map((option: Item) => (
              <DropdownMenuItem
                className={cn(
                  'relative my-0  w-full rounded-none  bg-none dark:hover:bg-neutral-800',
                  option.isActive
                    ? 'cursor-default !bg-primary-200 dark:!bg-primary-900'
                    : '',
                )}
                key={option.href}
              >
                <a
                  href={option.isActive ? '#' : option.href}
                  className="relative flex w-full flex-row items-center justify-start gap-4"
                >
                  {option?.station?.avatar && (
                    <Avatar
                      alt={option.station.name ?? ''}
                      size="sm"
                      src={String(option.station.avatar)}
                    />
                  )}
                  <span className="pr-4">{option.name}</span>
                  <Ping
                    size={12}
                    className={cn('absolute right-2 top-[12px]', {
                      hidden:
                        Number(option?.station?.totalNewMessages) === 0 ||
                        option?.isActive,
                    })}
                  />
                </a>
              </DropdownMenuItem>
            ))}
          </div>
          <div className={cn('flex w-full flex-col gap-2 p-2')}>
            <Link href={`${ROUTE_NAMES.STATIONS}?modal=create-station`}>
              <Button
                className="w-full"
                shape={'square'}
                size={'md'}
                startIcon={<Plus size={16} />}
              >
                {t('STATION.CREATE_STATION')}
              </Button>
            </Link>
            <Link href="/stations">
              <Button
                className="w-full"
                shape={'square'}
                variant={'ghost'}
                size={'md'}
                startIcon={<Home size={16} />}
              >
                {t('STATION.DASHBOARD')}
              </Button>
            </Link>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default StationNavigator;
