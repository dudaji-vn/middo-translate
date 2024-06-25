'use client';

import { Button } from '@/components/actions';
import { validateInvitation } from '@/services/business-space.service';
import React from 'react';
import { useRouter } from 'next/navigation';
import customToast from '@/utils/custom-toast';
import usePlatformNavigation from '@/hooks/use-platform-navigation';
import { ROUTE_NAMES } from '@/configs/route-name';

type ValidateInvitationProps = {
  token: string;
};
const ValidateInvitation = ({ token }: ValidateInvitationProps) => {
  const { navigateTo } = usePlatformNavigation();
  const onValidateInvitation = async (status: 'accept' | 'decline') => {
    try {
      const res = await validateInvitation({
        token,
        status,
      });
      navigateTo(ROUTE_NAMES.SPACES);
    } catch (error: unknown) {
      console.log(error);
      // @ts-ignore
      const msg = error?.response?.data?.message || error?.message;
      customToast.error(msg || 'Failed to validate invitation');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      <Button
        variant={'default'}
        color={'primary'}
        shape={'square'}
        className="min-w-[280px]"
        size={'lg'}
        onClick={() => onValidateInvitation('accept')}
      >
        Accept
      </Button>
      <Button
        variant={'ghost'}
        color={'default'}
        shape={'square'}
        size={'lg'}
        className="min-w-[280px]"
        onClick={() => onValidateInvitation('decline')}
      >
        Decline
      </Button>
    </div>
  );
};

export default ValidateInvitation;
