import { Button } from '@/components/actions';
import React, { useEffect } from 'react';
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
import { useGetMyBusinessNotifications } from '@/features/business-spaces/hooks/use-get-notification';
import { useReadNotifications } from '@/features/business-spaces/hooks/use-read-notifications';
import { useRouter } from 'next/navigation';
import { useDeleteNotifications } from '@/features/business-spaces/hooks/use-delete-notifications';

export type TSpacesNotification = {
  _id: string;
  from: {
    avatar: string;
    name: string | React.ReactNode;
  };
  description: string;
  deleteAble?: boolean;
  createdAt: string;
  unRead?: boolean;
  link?: string;
};

const Notification = ({
  _id,
  from: { avatar, name },
  description,
  deleteAble = true,
  createdAt,
  unRead = true,
  link,
}: TSpacesNotification) => {
  const timeDiff = moment().diff(createdAt, 'days');
  const router = useRouter();
  const { mutateAsync: deleteNotifications, isLoading } =
    useDeleteNotifications();
  const onDelete = (notificationId: TSpacesNotification['_id']) => {
    deleteNotifications(notificationId);
  };

  const displayTime =
    timeDiff > 1
      ? moment(createdAt).format('DD/MM/YYYY HH:mm')
      : moment(createdAt).fromNow();

  const onClickNotification = () => {
    if (isLoading) return;
    router.push(link || '/');
  };

  return (
    <div
      className={cn(
        'flex w-full flex-row items-center justify-stretch gap-3 p-4',
        {
          'bg-white': unRead,
          'cursor-pointer hover:bg-primary-100': !!link,
        },
        { 'opacity-50': isLoading },
      )}
      onClick={onClickNotification}
    >
      {unRead && (
        <Circle className=" h-3 w-3 fill-primary-500-main stroke-primary-500-main" />
      )}
      <div className="flex w-full flex-col justify-between">
        <div className="flex w-full flex-row justify-between">
          <div className="flex flex-row items-center  justify-start gap-2">
            <Avatar src={avatar} alt="avt" className="size-4" />
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
        disabled={isLoading}
        size={'xs'}
        className={deleteAble ? '' : 'invisible'}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onDelete(_id);
        }}
      >
        <Trash2 />
      </Button.Icon>
    </div>
  );
};

const SpacesNotifications = ({}: {}) => {
  const [open, setOpen] = React.useState(false);
  const { data: notifications } = useGetMyBusinessNotifications();

  const { mutateAsync: readNotifications } = useReadNotifications();

  useEffect(() => {
    if (open) {
      const unreadList = notifications?.filter(
        (item: TSpacesNotification) => item.unRead,
      );
      if (unreadList?.length) {
        readNotifications(unreadList);
      }
    }
  }, [open, notifications]);

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
              hidden: !notifications?.some(
                (item: TSpacesNotification) => item.unRead,
              ),
            })}
            size={12}
          />
          <Bell className="h-4 w-4" />
        </Button.Icon>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex h-fit max-h-[400px] min-h-[300px] w-[462px] max-w-[100vw] flex-col overflow-y-auto bg-white px-0 py-4"
      >
        {notifications?.map((item: TSpacesNotification) => (
          <Notification {...item} key={item._id} />
        ))}
        {notifications?.length === 0 && (
          <Typography className="mx-auto py-3 text-center font-light italic text-neutral-400">
            There&apos;s no notification
          </Typography>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default SpacesNotifications;
