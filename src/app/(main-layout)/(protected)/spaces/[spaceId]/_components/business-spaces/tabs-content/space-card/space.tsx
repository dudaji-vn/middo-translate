
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/utils/cn';
import React from 'react'
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
      joined: 'bg-primary-200 border border-primary-500-main text-primary-500-main'
    }
  }

})
const MAPPED_TAGS = {
  'my': 'My spaces',
  'joined': 'Joined spaces'
}
const Space = ({
  data: {
    name,
    members = [],
    newMessagesCount,
    owner,
    createdAt,
    _id,
  },
  tag,
  ...props
}: {
  data: TSpace,
  tag: 'my' | 'joined'
} & React.HTMLAttributes<HTMLDivElement>
) => {
  const hasNotification = newMessagesCount > 0;
  const router = useRouter()
  return (
    <Card
      key={_id}
      className={cn("gap-2 relative p-3 space-y-3 border-primary-200 bg-primary-100 min-w-[320px] border rounded-[12px] border-solid hover:border-primary-500-main cursor-pointer transition-all duration-300 ease-in-out")}
      onClick={() => {
        router.push(`${ROUTE_NAMES.SPACES}/${_id}/business/settings`)
      }}
      {...props}
    >
      <div className='absolute -top-1 right-[10px]'>
        <Circle size={16} className={hasNotification ? 'fill-primary-500-main absolute inset-0 stroke-primary-500-main animate-ping' : 'invisible'} />
        <Circle size={16} className={hasNotification ? 'fill-primary-500-main absolute inset-0 stroke-primary-500-main' : 'invisible'} />
      </div>
      <CardHeader className='flex p-0 !m-0 flex-row justify-between items-center text-neutral-600'>
        <Badge className={tagsVariants({ tag })}>{MAPPED_TAGS[tag]}</Badge>
        <span className='text-neutral-600 font-light text-sm leading-[18px]'><span className='max-[320px]:hidden'>Created on:</span> {` ${moment(createdAt).format('DD/MM/YYYY')}`}</span>
      </CardHeader>
      <CardContent className='p-0 flex flex-row items-center gap-2'>
        <Avatar src={owner?.avatar ?? '/logo.png'} alt={'avatar-owner'} className="size-[88px] p-1 border border-neutral-50" />
        <div className='space-y-1 flex flex-col'>
          <CardTitle className='text-base font-normal  break-words max-w-36  sm:max-w-44 xl:max-w-56  leading-[18px]'>{name}</CardTitle>
          <span className='text-neutral-600 font-light text-sm leading-[18px]'>{`${members?.length} members`}</span>
          <Button
            size={'xs'}
            shape={'square'}
            color={'primary'}
            variant={'ghost'}
            className={newMessagesCount > 0 ? 'text-primary-500-main font-semibold text-sm  leading-[18px]' : 'invisible'}
            startIcon={<MessageSquare className='h-4 w-4' />}
          >{`${newMessagesCount} new messages`}</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Space