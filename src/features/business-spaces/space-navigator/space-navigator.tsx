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
import { ChevronDown, HomeIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetSpaces } from '../hooks/use-get-spaces';
import { TSpace } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces';
import { isActive } from '@tiptap/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/actions';

interface Item {
  name: string | React.ReactNode;
  href: string;
  isActive?: boolean;
  pathToInclude: string;
  space?: TSpace;
}

const SpaceNavigator = ({ ...props }: DropdownMenuTriggerProps) => {
  const pathname = usePathname();
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
      spaces?.map((s: TSpace) => ({
        name: s.name,
        href: `/spaces/${s._id}/conversations`,
        pathToInclude: `/spaces/${s._id}`,
        isActive: pathname?.includes(`/spaces/${s._id}`),
        space: s,
      })) ?? []
    );
  }, [space, spaces, pathname]);

  const [isOpen, setOpen] = React.useState(false);

  const onChangeSpace = (href: string) => {
    console.log('href', href);
  };
  if (isLoading || !space) {
    return (
      <div
        className={cn(
          'flex !h-[42px] w-full flex-row items-center justify-start border-b border-neutral-50 bg-white px-4 py-3 text-neutral-500',
          props.className,
        )}
      >
        <Skeleton className="h-8 w-40 rounded-[8px] bg-neutral-50" />
      </div>
    );
  }
  return (
    <DropdownMenu open={isOpen} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        {...props}
        className={cn(
          'flex !h-[42px] w-full  border-b border-neutral-50 bg-primary-100 px-4 py-1 font-semibold text-neutral-800',
          props.className,
        )}
      >
        <div className="flex h-full min-w-[300px] max-w-[400px]  flex-row items-center justify-start gap-4 rounded-[12px] ">
          {space?.avatar && (
            <Avatar
              alt={space.name ?? ''}
              size="sm"
              src={String(space.avatar)}
            />
          )}
          <p>{space?.name}</p>
          <ChevronDown className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" onClick={() => setOpen(false)}>
        {items?.map((option: Item) => (
          <DropdownMenuItem
            className={cn(
              'flex flex-row items-center justify-start gap-4',
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
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SpaceNavigator;
