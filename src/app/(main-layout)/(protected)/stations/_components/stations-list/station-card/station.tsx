import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { cn } from '@/utils/cn';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { Avatar } from '@/components/data-display';
import { Circle, MoreVertical } from 'lucide-react';
import { Button } from '@/components/actions';
import { cva } from 'class-variance-authority';
import { useRouter } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useTranslation } from 'react-i18next';
import { TStation } from '../../type';

const tagsVariants = cva('text-[12px] font-medium rounded-full ', {
  variants: {
    tag: {
      my: 'bg-primary text-white',
      joined:
        'bg-primary-200 border border-primary-500-main text-primary-500-main',
    },
  },
});
export enum EStationActions {
  SETTINGS = 'settings',
  SET_AS_DEFAULT = 'set-as-default',
  DELETE = 'delete',
}

type StationMenuItem = {
  label: string;
  action: EStationActions;
  labelProps?: React.HTMLAttributes<HTMLSpanElement>;
}[];
const menuItems: StationMenuItem = [
  {
    label: 'STATION.ACTIONS.SETTINGS',
    action: EStationActions.SETTINGS,
  },
  {
    label: 'STATION.ACTIONS.SET_AS_DEFAULT',
    action: EStationActions.SET_AS_DEFAULT,
  },
  {
    label: 'COMMON.DELETE',
    action: EStationActions.DELETE,
    labelProps: {
      className: '!text-error ',
    },
  },
];
export type StationMenuProps = {
  station: TStation;
  onAction: (action: EStationActions) => void;
} & React.HTMLAttributes<HTMLDivElement>;

const StationMenu = ({ station, onAction, ...props }: StationMenuProps) => {
  const { t } = useTranslation('common');
  const [isOpen, setOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Button.Icon size="xs" variant="ghost" color="default">
          <MoreVertical />
        </Button.Icon>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="dark:border-neutral-800 dark:bg-neutral-900"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {menuItems.map(({ ...item }) => {
          return (
            <DropdownMenuItem
              className="flex items-center active:bg-primary-200 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"
              key={item.action}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onAction(item.action);
              }}
            >
              <span
                className={cn(
                  'font-semibold text-neutral-800 dark:text-neutral-100',
                  item.labelProps?.className,
                )}
              >
                {t(item.label)}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const MAPPED_TAGS = {
  my: 'STATION.MY_STATION',
  joined: 'STATION.JOINED_STATION',
};

const Station = ({
  data,
  menuProps,
  ...props
}: {
  data: TStation;
  menuProps: Omit<StationMenuProps, 'station'>;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const { name, totalMembers, totalNewMessages = 0, avatar, _id } = data || {};
  const hasNotification = totalNewMessages > 0;
  const { t } = useTranslation('common');
  const router = useRouter();

  const tag = data?.isOwner ? 'my' : 'joined';
  return (
    <Card
      key={_id}
      className={cn(
        'relative min-h-[112px] min-w-[280px] max-w-full cursor-pointer gap-2 space-y-3 rounded-[12px] border border-solid border-primary-200 bg-primary-100 px-3 transition-all duration-300 ease-in-out hover:border-primary-500-main dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-primary',
      )}
      onClick={() => {
        router.push(`${ROUTE_NAMES.STATIONS}/${_id}/conversations`);
      }}
      {...props}
    >
      <div className="absolute right-2 top-1 z-10">
        <StationMenu {...menuProps} station={data} />
      </div>
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
      <CardContent className=" m-0 flex flex-row items-center gap-3 p-0">
        <Avatar
          src={avatar || '/logo.png'}
          alt={'avatar-owner'}
          variant={'outline'}
          className="size-[88px] border border-neutral-50 p-1 dark:border-neutral-800"
        />
        <div className="flex flex-col items-start space-y-1">
          <Badge className={cn('px-2 py-1', tagsVariants({ tag }))}>
            {t(MAPPED_TAGS[tag])}
          </Badge>
          <CardTitle className="max-w-36 break-words text-base  font-semibold  leading-[18px] text-neutral-800  dark:text-neutral-50 sm:max-w-44 xl:max-w-56">
            {name}
          </CardTitle>
          <span className="text-sm font-light leading-[18px] text-neutral-600 dark:text-neutral-100">{`${totalMembers} ${t('COMMON.MEMBER')}`}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Station;
