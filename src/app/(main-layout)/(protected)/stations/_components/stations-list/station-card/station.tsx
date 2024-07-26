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
import {
  Circle,
  KeyIcon,
  MoreVertical,
  Settings,
  SettingsIcon,
  StarIcon,
  StarOffIcon,
  Trash2Icon,
  User2Icon,
} from 'lucide-react';
import { Button } from '@/components/actions';
import { cva } from 'class-variance-authority';
import { useRouter } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useTranslation } from 'react-i18next';
import { TStation } from '../../type';
import { Item } from '@radix-ui/react-dropdown-menu';

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
  REMOVE_DEFAULT = 'remove-default',
}

type StationMenuItem = {
  label: string;
  action: EStationActions;
  icon?: React.ReactNode;
  labelProps?: React.HTMLAttributes<HTMLSpanElement>;
}[];
const menuItems: StationMenuItem = [
  {
    label: 'STATION.ACTIONS.SETTINGS',
    action: EStationActions.SETTINGS,
    icon: <SettingsIcon className="size-4" />,
  },
  {
    label: 'STATION.ACTIONS.SET_AS_DEFAULT',
    action: EStationActions.SET_AS_DEFAULT,
    icon: <StarIcon className="size-4" />,
  },
  {
    label: 'STATION.ACTIONS.REMOVE_DEFAULT',
    action: EStationActions.REMOVE_DEFAULT,
    icon: <StarOffIcon className="size-4" />,
  },
  {
    label: 'COMMON.DELETE',
    action: EStationActions.DELETE,
    icon: <Trash2Icon className="size-4" />,
    labelProps: {
      className: '!text-error ',
    },
  },
];
export type StationMenuProps = {
  station: TStation;
  onAction: (action: EStationActions) => void;
  isDefault?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const StationMenu = ({
  station,
  onAction,
  isDefault,
  ...props
}: StationMenuProps) => {
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
          if (item.action === EStationActions.REMOVE_DEFAULT && !isDefault) {
            return null;
          }
          if (item.action === EStationActions.SET_AS_DEFAULT && isDefault) {
            return null;
          }
          return (
            <DropdownMenuItem
              className="flex items-center active:bg-primary-200 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"
              key={item.action}
              onClick={(e) => {
                onAction(item.action);
              }}
            >
              <div className={cn('mr-2', item.labelProps?.className)}>
                {' '}
                {item.icon}
              </div>
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

const MAPPED_TAGS_ICONS = {
  my: {
    icon: <KeyIcon size={16} />,
    style: 'bg-primary text-white',
  },
  joined: {
    icon: <User2Icon size={16} />,
    style: 'bg-secondary text-primary',
  },
};

const Station = ({
  data,
  menuProps,
  isDefault,
  ...props
}: {
  data: TStation;
  menuProps: Omit<StationMenuProps, 'station'>;
  isDefault?: boolean;
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
        'relative min-h-[112px] min-w-[280px] max-w-full cursor-pointer gap-2 space-y-3 rounded-xl border border-solid border-transparent bg-primary-100 px-3 shadow-none transition-all duration-300 ease-in-out active:border-primary-500-main dark:bg-neutral-900 md:hover:shadow-2',
      )}
      onClick={() => {
        router.push(`${ROUTE_NAMES.STATIONS}/${_id}/conversations`);
      }}
      {...props}
    >
      <div className="absolute right-2 top-1 z-10">
        <StationMenu {...menuProps} isDefault={isDefault} station={data} />
      </div>
      <div className="absolute -top-[16px] right-[10px]">
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
        <div className="relative">
          <Avatar
            src={avatar || '/logo.png'}
            alt={'avatar-owner'}
            variant={'outline'}
            className="size-[88px] border border-neutral-50 p-1 dark:border-neutral-800"
          />
          <div className="absolute bottom-0  right-0 rounded-full border-2 border-primary-100 dark:border-neutral-900">
            <div
              className={cn(
                ' flex size-6 items-center justify-center rounded-full ',
                MAPPED_TAGS_ICONS[tag].style,
              )}
            >
              {MAPPED_TAGS_ICONS[tag].icon}
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-start space-y-1">
          <CardTitle className="flex-1  break-words text-base  font-semibold leading-[18px] text-neutral-800  dark:text-neutral-50">
            {name}
          </CardTitle>
          <span className="text-sm font-light leading-[18px] text-neutral-600 dark:text-neutral-100">{`${totalMembers} ${t('COMMON.MEMBER')}`}</span>
        </div>
      </CardContent>
      {isDefault && (
        <div className="absolute bottom-0 right-0 flex h-11 w-11 items-center justify-center rounded-br-xl rounded-tl-xl bg-primary">
          <StarIcon className="h-5 w-5 fill-white text-white " />
        </div>
      )}
    </Card>
  );
};

export default Station;
