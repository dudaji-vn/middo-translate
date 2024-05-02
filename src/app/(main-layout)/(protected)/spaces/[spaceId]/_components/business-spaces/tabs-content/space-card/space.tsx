import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/utils/cn';
import React from 'react';
import { TSpace } from '../..';
import { Badge } from '@/components/ui/badge';
import moment from 'moment';
import { Avatar, Typography } from '@/components/data-display';
import { Circle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/actions';
import { cva } from 'class-variance-authority';
import { useRouter } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';

const tagsVariants = cva('text-[12px] font-medium rounded-full ', {
  variants: {
    tag: {
      my: 'bg-primary text-white',
      joined:
        'bg-primary-200 border border-primary-500-main text-primary-500-main',
    },
  },
});
const MAPPED_TAGS = {
  my: 'My spaces',
  joined: 'Joined spaces',
};
const Space = ({
  data: { name, members = [], newMessagesCount, owner, createdAt, avatar, _id },
  tag,
  ...props
}: {
  data: TSpace;
  tag: 'my' | 'joined';
} & React.HTMLAttributes<HTMLDivElement>) => {
  const hasNotification = newMessagesCount > 0;
  const router = useRouter();
  return (
    <Card
      key={_id}
      className={cn(
        'relative min-w-[320px] cursor-pointer gap-2 space-y-3 rounded-[12px] border border-solid border-primary-200 bg-primary-100 p-3 transition-all duration-300 ease-in-out hover:border-primary-500-main',
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
        <Badge className={tagsVariants({ tag })}>{MAPPED_TAGS[tag]}</Badge>
        <span className="text-sm font-light leading-[18px] text-neutral-600">
          <span className="max-[320px]:hidden">Created on:</span>{' '}
          {` ${moment(createdAt).format('DD/MM/YYYY')}`}
        </span>
      </CardHeader>
      <CardContent className="flex flex-row items-center gap-2 p-0">
        <Avatar
          src={avatar || '/logo.png'}
          alt={'avatar-owner'}
          className="size-[88px] border border-neutral-50 p-1"
        />
        <div className="flex flex-col space-y-1">
          <CardTitle className="max-w-36 break-words  text-base font-normal  leading-[18px] sm:max-w-44  xl:max-w-56">
            {name}
          </CardTitle>
          <span className="text-sm font-light leading-[18px] text-neutral-600">{`${members?.length} members`}</span>
          <Button
            size={'xs'}
            shape={'square'}
            color={'primary'}
            variant={'ghost'}
            className={
              newMessagesCount > 0
                ? 'text-sm font-semibold leading-[18px]  text-primary-500-main'
                : 'invisible'
            }
            startIcon={<MessageSquare className="h-4 w-4" />}
          >{`${newMessagesCount} new messages`}</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Space;
