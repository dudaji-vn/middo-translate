import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/utils/cn';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import moment from 'moment';
import { Avatar } from '@/components/data-display';
import { Circle, Key, MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/actions';
import { cva } from 'class-variance-authority';
import { useRouter } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useTranslation } from 'react-i18next';
import { SPK_FOCUS } from '@/configs/search-param-key';
import { TStation } from '../type';

const tagsVariants = cva('text-[12px] font-medium rounded-full ', {
  variants: {
    tag: {
      my: 'bg-primary text-white',
      joined:
        'bg-primary-200 border border-primary-500-main text-primary-500-main',
    },
  },
});
const MAPPED_ICONS = {
  my: <Key className="mr-2 h-4 w-4" />,
  joined: <User className="mr-2 h-4 w-4" />,
};
const MAPPED_TAGS = {
  my: 'EXTENSION.SPACE.MY_SPACE',
  joined: 'EXTENSION.SPACE.JOINED_SPACE',
};
const Station = ({
  data: { name, members = [], totalNewMessages = 0, createdAt, avatar, _id },
  tag,
  ...props
}: {
  data: TStation;
  tag: 'my' | 'joined';
} & React.HTMLAttributes<HTMLDivElement>) => {
  const hasNotification = totalNewMessages > 0;
  const { t } = useTranslation('common');
  const router = useRouter();
  return (
    <Card
      key={_id}
      className={cn(
        'relative min-w-[280px] max-w-full cursor-pointer gap-2 space-y-3 rounded-[12px] border border-solid border-primary-200 bg-primary-100 p-3 transition-all duration-300 ease-in-out hover:border-primary-500-main dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-primary',
      )}
      onClick={() => {
        router.push(`${ROUTE_NAMES.SPACES}/${_id}/conversations`);
      }}
      {...props}
    >
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
      <CardHeader className="!m-0 flex flex-row items-center justify-between p-0 text-neutral-600">
        <Badge className={tagsVariants({ tag })}>
          {MAPPED_ICONS[tag]}
          {t(MAPPED_TAGS[tag])}
        </Badge>
        <span className="text-sm font-light leading-[18px] text-neutral-600 dark:text-neutral-100">
          <span className="max-[320px]:hidden">
            {t('COMMON.TIME.CREATED_ON')}
          </span>
          {` ${moment(createdAt).format('DD/MM/YYYY')}`}
        </span>
      </CardHeader>
      <CardContent className="flex flex-row items-center gap-3 p-0">
        <Avatar
          src={avatar || '/logo.png'}
          alt={'avatar-owner'}
          variant={'outline'}
          className="size-[88px] border border-neutral-50 p-1 dark:border-neutral-800"
        />
        <div className="flex flex-col space-y-1">
          <CardTitle className="max-w-36 break-words text-base  font-semibold  leading-[18px] text-neutral-800  dark:text-neutral-50 sm:max-w-44 xl:max-w-56">
            {name}
          </CardTitle>
          <span className="text-sm font-light leading-[18px] text-neutral-600 dark:text-neutral-100">{`${members?.length} ${t('COMMON.MEMBER')}`}</span>
          <Button
            size={'xs'}
            shape={'square'}
            color={'primary'}
            variant={'ghost'}
            onClick={(e) => {
              e.stopPropagation();
              router.push(
                `${ROUTE_NAMES.SPACES}/${_id}/conversations?${SPK_FOCUS}=unread-help-desk`,
              );
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
