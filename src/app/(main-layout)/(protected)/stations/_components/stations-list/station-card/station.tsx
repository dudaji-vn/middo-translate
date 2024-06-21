import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/utils/cn';
import React, { cloneElement, useCallback, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import moment from 'moment';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { Avatar } from '@/components/data-display';
import { Circle, Key, MessageSquare, MoreVertical, User } from 'lucide-react';
import { Button } from '@/components/actions';
import { cva } from 'class-variance-authority';
import { useRouter } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useTranslation } from 'react-i18next';
import { SPK_FOCUS } from '@/configs/search-param-key';
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

type StationMenuItem = {
  label: string;
  action: string;
  labelProps: React.HTMLAttributes<HTMLSpanElement>;
}[];

const items: StationMenuItem = [
  {
    label: 'STATION.ACTIONS.SETTINGS',
    action: 'settings',
    labelProps: {
      className: 'font-semibold text-neutral-800 dark:text-neutral-100',
    },
  },
  {
    // set as default
    label: 'STATION.ACTIONS.SET_AS_DEFAULT',
    action: 'set-as-default',
    labelProps: {
      className: 'font-semibold text-neutral-800 dark:text-neutral-100',
    },
  },
  {
    label: 'COMMON.DELETE',
    action: 'delete',
    labelProps: {
      className: 'font-semibold text-error-400 dark:text-neutral-100',
    },
  },
];

const StationMenu = ({
  station,
  ...props
}: {
  station?: TStation;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const { t } = useTranslation('common');
  const [isOpen, setOpen] = useState(false);
  const onOpenChange = useCallback((open: boolean) => {
    setOpen(open);
  }, []);

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
        {items.map(({ ...item }) => {
          return (
            <DropdownMenuItem
              className="flex items-center active:bg-primary-200 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"
              key={item.action}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                console.log('STATION ?? ', item.action);
              }}
            >
              <span {...item.labelProps}>{t(item.label)}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const MAPPED_ICONS = {
  my: <Key className="mr-2 h-4 w-4" />,
  joined: <User className="mr-2 h-4 w-4" />,
};
const MAPPED_TAGS = {
  my: 'STATION.MY_STATION',
  joined: 'STATION.JOINED_STATION',
};

const Station = ({
  data,
  tag,
  ...props
}: {
  data: TStation;
  tag: 'my' | 'joined';
} & React.HTMLAttributes<HTMLDivElement>) => {
  const {
    name,
    totalMembers,
    totalNewMessages = 0,
    createdAt,
    avatar,
    _id,
  } = data || {};
  const hasNotification = totalNewMessages > 0;
  const { t } = useTranslation('common');
  const router = useRouter();
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
        <StationMenu station={data} />
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
            {MAPPED_ICONS[tag]}
            {t(MAPPED_TAGS[tag])}
          </Badge>
          <CardTitle className="max-w-36 break-words text-base  font-semibold  leading-[18px] text-neutral-800  dark:text-neutral-50 sm:max-w-44 xl:max-w-56">
            {name}
          </CardTitle>
          <span className="text-sm font-light leading-[18px] text-neutral-600 dark:text-neutral-100">{`${totalMembers} ${t('COMMON.MEMBER')}`}</span>
          <Button
            size={'xs'}
            shape={'square'}
            color={'primary'}
            variant={'ghost'}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`${ROUTE_NAMES.STATIONS}/${_id}`);
            }}
            className={
              totalNewMessages > 0
                ? 'text-left text-sm font-semibold  leading-[18px] text-primary-500-main'
                : 'hidden'
            }
            startIcon={<MessageSquare className="h-4 w-4" />}
          >{`${totalNewMessages} ${t('TOOL_TIP.NEW_CONVERSATION')}`}</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Station;
