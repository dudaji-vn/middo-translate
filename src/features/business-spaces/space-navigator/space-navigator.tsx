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
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetSpaces } from '../hooks/use-get-spaces';
import { TSpace } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/actions';
import Ping from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces/ping/ping';
import { useSidebarStore } from '@/stores/sidebar.store';
import Link from 'next/link';

interface Item {
  name: string | React.ReactNode;
  href: string;
  isActive?: boolean;
  pathToInclude: string;
  space?: TSpace;
}

const SpaceNavigator = ({ ...props }: DropdownMenuTriggerProps) => {
  const pathname = usePathname();
  const { expand, openNavigator, setOpenNavigator } = useSidebarStore();

  const router = useRouter();
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
      spaces
        ?.filter((s: TSpace) => s._id !== space._id)
        .map((s: TSpace) => ({
          name: s.name,
          href: `/spaces/${s._id}/conversations`,
          pathToInclude: `/spaces/${s._id}`,
          isActive: pathname?.includes(`/spaces/${s._id}`),
          space: s,
        })) ?? []
    );
  }, [space, spaces, pathname]);
  const hasNotification = useMemo(() => {
    return spaces?.some((s: TSpace) => Number(s.totalNewMessages) > 0);
  }, [spaces]);

  const onChangeSpace = (href: string) => {
    router.push(href);
  };
  if (isLoading || !space || !pathname?.includes(space?._id)) {
    return (
      <div
        className={cn(
          'flex h-fit  w-full flex-row items-center justify-start  bg-white dark:bg-neutral-900 p-2 text-neutral-500',
          props.className,
        )}
      >
        <Skeleton className="relative size-[50px] rounded-[8px] bg-primary-100">
          <div className="absolute inset-2 rounded-full border border-neutral-50 bg-white dark:bg-neutral-900 dark:border-neutral-800" />
        </Skeleton>
      </div>
    );
  }
  return (
    <DropdownMenu open={openNavigator} onOpenChange={setOpenNavigator}>
      <DropdownMenuTrigger
        {...props}
        className={cn(
          'flex h-fit w-full !bg-transparent p-2 text-neutral-800  active:!bg-transparent',
          props.className,
          expand && 'min-w-[376px]  max-w-full',
        )}
      >
        <div className="relative flex w-full flex-row items-center justify-start gap-3  rounded-[12px] bg-primary-100 p-2 dark:bg-neutral-900 dark:text-neutral-50">
          {space?.avatar && (
            <Avatar
              alt={space.name ?? ''}
              size="sm"
              src={String(space.avatar)}
              className="border border-neutral-50 bg-white dark:bg-neutral-900 dark:border-neutral-900"
            />
          )}
          <div
            className={cn('hidden ', {
              ' flex flex-grow flex-row items-center justify-start gap-1 ':
                expand,
            })}
          >
            <p className="font-semibold">{space?.name}</p>
            <ChevronDown className="h-4 w-4" />
          </div>
          <Ping
            size={12}
            className={cn(
              'absolute right-[6px] top-[20px]',
              expand && 'right-4',
              {
                hidden: !hasNotification,
              },
            )}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[360px] max-w-full border-none p-0 shadow-[2px_10px_24px_2px_#1616161A] dark:bg-neutral-900 dark:border-neutral-800"
        sideOffset={-4}
        alignOffset={8}
      >
        {items?.map((option: Item) => (
          <DropdownMenuItem
            className={cn(
              'relative flex w-full flex-row items-center justify-start gap-4 rounded-none bg-none dark:hover:bg-neutral-800',
              option.isActive ? '!bg-primary !text-white' : '',
            )}
            onClick={() => onChangeSpace(option.href)}
            key={option.href}
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
              className={cn('absolute right-4 top-[20px]', {
                hidden: Number(option?.space?.totalNewMessages) === 0,
              })}
            />
          </DropdownMenuItem>
        ))}
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
  );
};

export default SpaceNavigator;
