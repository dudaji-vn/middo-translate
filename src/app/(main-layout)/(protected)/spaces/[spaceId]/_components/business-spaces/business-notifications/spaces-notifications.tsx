import { Button } from '@/components/actions';
import React from 'react';
import { Bell, Circle, Clock, Clock3, Trash2 } from 'lucide-react';
import Ping from '../ping/ping';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/data-display/popover';
import { Avatar, Typography } from '@/components/data-display';
import moment from 'moment';
import { cn } from '@/utils/cn';

export type TNotification = {
  image: string;
  name: string | React.ReactNode;
  description: string;
  deleteAble?: boolean;
  createdAt: string;
  unRead?: boolean;
  link?: string;
};

const Notification = ({
  image,
  name,
  description,
  deleteAble,
  createdAt,
  unRead = true,
  link,
}: TNotification) => {
  const timeDiff = moment().diff(createdAt, 'days');
  const displayTime =
    timeDiff > 1
      ? moment(createdAt).format('DD/MM/YYYY HH:mm')
      : moment(createdAt).fromNow();
  return (
    <div
      className={cn(
        'flex w-full flex-row items-center justify-stretch gap-3 p-4',
        {
          'bg-white': unRead,
          'cursor-pointer hover:bg-primary-200': !!link,
        },
      )}
    >
      {unRead && (
        <Circle className=" h-3 w-3 fill-primary-500-main stroke-primary-500-main" />
      )}
      <div className="flex w-full flex-col justify-between">
        <div className="flex w-full flex-row justify-between">
          <div className="flex flex-row items-center  justify-start gap-2">
            <Avatar src={image} alt="avt" className="size-4" />
            <p className="text-sm font-semibold text-neutral-500">{name}</p>
          </div>
          <div className="flex flex-row items-center justify-start gap-2">
            <Clock3 className="h-4 w-4 text-neutral-400" />
            <p className="text-xs text-neutral-400">{displayTime}</p>
          </div>
        </div>
        <Typography className="text-sm text-neutral-400">
          {description}
        </Typography>
      </div>
      <Button.Icon
        variant={'default'}
        color={'default'}
        size={'xs'}
        className={deleteAble ? '' : 'invisible'}
      >
        <Trash2 />
      </Button.Icon>
    </div>
  );
};

const SpacesNotifications = ({
  invitations = [],
  others = [],
}: {
  invitations?: Array<{
    email: string;
    space: {
      name: string;
      avatar: string;
    };
    invitedAt: string;
  }>;
  others?: TNotification[];
}) => {
  const [open, setOpen] = React.useState(false);
  const notifications: TNotification[] = invitations?.map((item) => {
    return {
      image: item.space.avatar,
      name: item.space.name,
      description: `You've been invited to join ${item.space.name}`,
      createdAt: item.invitedAt,
    };
  });
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button.Icon
          variant={'default'}
          color={'default'}
          size={'xs'}
          className="relative"
        >
          <Ping
            className={cn('absolute -right-[8px] -top-[2px]', {
              hidden: !notifications.some((item) => item.unRead),
            })}
            size={12}
          />
          <Bell className="h-4 w-4" />
        </Button.Icon>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex max-h-[400px] min-h-[300px] w-[462px] max-w-[100vw] flex-col overflow-y-auto bg-white px-0 py-4"
      >
        {notifications.map((item, index) => (
          <Notification key={index} {...item} />
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default SpacesNotifications;
