'use client';

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { ROUTE_NAMES } from '@/configs/route-name';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/configs/store-key';
import { setCookieService, signOutService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/utils/cn';
import { ArrowLeftRight } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
const statusMessages: Record<string, string> = {
  '400': 'The invitation is invalid',
  '403': 'You do not have permission to view this invitation',
  '409': 'You has joined this space',
};

const InvalidVerifyToken = ({
  token,
  status,
}: {
  token: string;
  status: string;
}) => {
  const { user: currentUser, setData } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const onSwitchAccount = async () => {
    setCookieService([
      {
        key: 'redirect-path',
        value: pathname + `?token=${token}`,
        time: 15,
      },
    ]).finally(async () => {
      // router.push(ROUTE_NAMES.SIGN_IN);
      await signOutService();
      setData({ user: null, isAuthentication: false });
    });
  };
  return (
    <main className="flex h-[calc(100vh-52px)] items-center  justify-center">
      <div className="flex flex-col items-center gap-8">
        <Image
          src="/invalid_invitation.svg"
          width={320}
          height={320}
          alt="invalid-verify-token"
        />
        <div className="flex  flex-col gap-3 text-center text-neutral-800">
          <span className="text-[2rem] font-semibold leading-[48px] text-neutral-800">
            {statusMessages[status] || 'The invitation is invalid'}
          </span>
          <span
            className={cn('font-light  leading-[22px] text-neutral-800', {
              hidden: {
                status: '409',
              },
            })}
          >
            You&apos;re sign in as &nbsp;
            <span className="font-medium text-primary-500-main">
              {currentUser?.email}
            </span>
          </span>
        </div>
        <Button
          shape={'square'}
          onClick={onSwitchAccount}
          startIcon={<ArrowLeftRight />}
          className={cn('px-6', {
            hidden: {
              status: '409',
            },
          })}
        >
          Switch account
        </Button>
      </div>
    </main>
  );
};

export default InvalidVerifyToken;
