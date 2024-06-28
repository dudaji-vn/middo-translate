import Ping from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces/ping/ping';
import { Button } from '@/components/actions';
import {
  Avatar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Typography,
} from '@/components/data-display';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useSideChatStore } from '@/features/chat/stores/side-chat.store';
import { usePlatformStore } from '@/features/platform/stores';
import { useGetStations } from '@/features/stations/hooks/use-get-spaces';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/utils/cn';
import { DropdownMenuTriggerProps } from '@radix-ui/react-dropdown-menu';
import { ChevronDown, Home, Plus, SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TStation } from '../../../_components/type';
import { useStationNavigationData } from '@/hooks';

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
  const [width, setWidth] = useState<number>(322);
  const { setCurrentSide } = useSideChatStore();
  const { isOnStation } = useStationNavigationData();

  const { t } = useTranslation('common');
  const { data: stations, isLoading } = useGetStations({
    type: 'all_stations',
  });
  const { workStation } = useAuthStore();
  const station = useMemo(() => {
    if (pathname?.includes(ROUTE_NAMES.ONLINE_CONVERSATION)) {
      return {
        _id: ROUTE_NAMES.ONLINE_CONVERSATION,
        name: 'Middo Station',
        avatar: '/icon.png',
      } as TStation;
    }
    return workStation;
  }, [pathname, workStation]);

  const items: Item[] = useMemo(() => {
    const items: Item[] = [];
    if (isLoading || !stations || !station) {
      return items;
    }

    stations.forEach((s: TStation) => {
      items.push({
        name: s.name,
        href: `${ROUTE_NAMES.STATIONS}/${s._id}/conversations`,
        pathToInclude: `${ROUTE_NAMES.STATIONS}/${s._id}/conversations`,
        station: s,
        isActive: pathname?.includes(
          `${ROUTE_NAMES.STATIONS}/${s._id}/conversations`,
        ),
      });
    });
    return items;
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
  }, [stations, triggerRef]);

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
    <div className="flex items-center">
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
            <Section label="GLOBAL STATION">
              <DropdownMenuItem
                className={cn(
                  'relative my-0 w-full  rounded-none bg-none  dark:hover:bg-neutral-800 md:py-2',
                  !isOnStation
                    ? 'cursor-default !bg-primary-200 dark:!bg-primary-900'
                    : '',
                )}
              >
                <a
                  href={!isOnStation ? '#' : ROUTE_NAMES.ONLINE_CONVERSATION}
                  className="relative flex w-full flex-row items-center justify-start gap-4"
                >
                  <Avatar alt="hello" size="sm" src="/icon.png" />

                  <span className="pr-4">Middo Station</span>
                </a>
              </DropdownMenuItem>
            </Section>
            <Section label="WORK STATION">
              {items?.map((option: Item) => (
                <DropdownMenuItem
                  className={cn(
                    'relative my-0 w-full  rounded-none bg-none  dark:hover:bg-neutral-800 md:py-2',
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
            </Section>
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
      {!pathname?.includes(ROUTE_NAMES.ONLINE_CONVERSATION) && (
        <Button.Icon
          onClick={() => setCurrentSide('station_settings')}
          color="default"
          size="xs"
          className="mr-2"
        >
          <SettingsIcon />
        </Button.Icon>
      )}
    </div>
  );
};

export default StationNavigator;

export const Section = ({
  label,
  children,
}: {
  label: string;
  labelRight?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col">
      <div className="px-3 py-2">
        <Typography className="text-sm font-normal leading-[18px] text-neutral-500">
          {label}
        </Typography>
      </div>
      {children}
    </div>
  );
};
