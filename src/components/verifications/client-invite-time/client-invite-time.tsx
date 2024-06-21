'use client';

import { Typography } from '@/components/data-display';
import { Clock } from 'lucide-react';
import moment from 'moment';
import React from 'react';

const ClientInviteTime = ({ invitedAt }: { invitedAt: string }) => {
  return (
    <Typography className="p flex  items-center text-sm font-light text-neutral-500 dark:text-neutral-100 max-md:pt-2 md:pl-3">
      At&nbsp;
      <Clock className="ml-1 inline-block size-4" />
      <span className="text-base font-normal leading-[18px] ">
        {moment(invitedAt).format('DD/MM/YYYY HH:mm')}
      </span>
    </Typography>
  );
};

export default ClientInviteTime;
