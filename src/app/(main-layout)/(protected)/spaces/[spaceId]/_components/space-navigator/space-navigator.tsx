'use client';

import {
  Avatar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/utils/cn';
import { DropdownMenuTriggerProps } from '@radix-ui/react-dropdown-menu';
import { ChevronDown, Home, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TSpace } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/actions';
import Ping from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces/ping/ping';
import { useSidebarStore } from '@/stores/sidebar.store';
import Link from 'next/link';
import { usePlatformStore } from '@/features/platform/stores';
import { useGetSpaces } from '@/features/business-spaces/hooks/use-get-spaces';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useAppStore } from '@/stores/app.store';

interface Item {
  name: string | React.ReactNode;
  href: string;
  isActive?: boolean;
  pathToInclude: string;
  space?: TSpace;
}

const SpaceNavigator = ({ ...props }: DropdownMenuTriggerProps) => {
  const pathname = usePathname();

  const isMobilePlatform =
    usePlatformStore((state) => state.platform) === 'mobile';
  const isMobile = useAppStore((state) => state.isMobile);
  const { expand, openNavigator, setOpenNavigator } = useSidebarStore();

  const { t } = useTranslation('common');
  const { data: spaces, isLoading } = useGetSpaces({
    type: 'all_spaces',
  });
  const { space } = useAuthStore();

  const items: Item[] = useMemo(() => {
    if (isLoading || !spaces || !space) {
      return [];
    }
    return (
      spaces?.map((s: TSpace) => ({
        name: s.name,
        href:
          `${ROUTE_NAMES.SPACES}/${s._id}/conversations` +
          (isMobilePlatform ? '?platform=mobile' : ''),
        pathToInclude: `${ROUTE_NAMES.SPACES}/${s._id}`,
        isActive: pathname?.includes(`${ROUTE_NAMES.SPACES}/${s._id}`),
        space: s,
      })) ?? []
    );
  }, [space, spaces, pathname]);

  const hasNotification = useMemo(() => {
    return spaces?.some(
      (s: TSpace) =>
        !pathname?.includes(`spaces/${s._id}`) &&
        Number(s.totalNewMessages) > 0,
    );
  }, [spaces]);

  if (isLoading || !space || !pathname?.includes(space?._id)) {
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
    <div className="flex p-2">
      <DropdownMenu open={openNavigator} onOpenChange={setOpenNavigator}>
        <DropdownMenuTrigger
          {...props}
          className={cn(
            'flex h-fit flex-1 !bg-transparent text-neutral-800  active:!bg-transparent',
            props.className,
            expand && !isMobile && ' max-w-full',
          )}
        >
          <div className=" flex w-full flex-row items-center justify-start gap-3 overflow-x-hidden  rounded-[12px] bg-primary-100 p-2 dark:bg-neutral-900 dark:text-neutral-50">
            {space?.avatar && (
              <Avatar
                alt={space.name ?? ''}
                size="sm"
                src={String(space.avatar)}
                className="border border-neutral-50 bg-white dark:border-neutral-900 dark:bg-neutral-900"
              />
            )}
            <div
              className={cn('hidden ', {
                ' flex max-w-full flex-grow flex-row items-center justify-start gap-1 ':
                  expand || isMobile,
              })}
            >
              <p className="max-w-56 truncate text-ellipsis break-words text-left font-semibold">
                {space?.name}
              </p>
              <ChevronDown className="ml-auto h-4 w-4" />
            </div>
            <Ping
              size={12}
              className={cn('absolute right-4 top-1 ', {
                hidden: !hasNotification,
              })}
            />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="w-[--radix-dropdown-menu-trigger-width] max-w-full border-none p-0 shadow-[2px_10px_24px_2px_#1616161A] dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="no-scrollbar h-fit max-h-96 w-full overflow-y-auto">
            {items?.map((option: Item) => (
              <DropdownMenuItem
                className={cn(
                  'relative  w-full rounded-none  bg-none dark:hover:bg-neutral-800',
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
                  {option?.space?.avatar && (
                    <Avatar
                      alt={option.space.name ?? ''}
                      size="sm"
                      src={String(option.space.avatar)}
                    />
                  )}
                  <span className="pr-4">{option.name}</span>
                  <Ping
                    size={12}
                    className={cn('absolute right-2 top-[12px]', {
                      hidden:
                        Number(option?.space?.totalNewMessages) === 0 ||
                        option?.isActive,
                    })}
                  />
                </a>
              </DropdownMenuItem>
            ))}
          </div>
          <div className={cn('flex w-full flex-col gap-2 p-2')}>
            <Link href={'/spaces?modal=create-space'}>
              <Button
                className="w-full"
                shape={'square'}
                size={'md'}
                startIcon={<Plus size={16} />}
              >
                {t('EXTENSION.SPACE.CREATE_SPACE')}
              </Button>
            </Link>
            <Link href="/spaces">
              <Button
                className="w-full"
                shape={'square'}
                variant={'ghost'}
                size={'md'}
                startIcon={<Home size={16} />}
              >
                {t('EXTENSION.SPACE.DASHBOARD')}
              </Button>
            </Link>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SpaceNavigator;
