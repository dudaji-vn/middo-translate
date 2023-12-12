'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ACCESS_TOKEN_NAME } from '@/configs/store-key';
import { Button } from '@/components/form/Button';
import Image from 'next/image';
import { ROUTE_NAMES } from '@/configs/route-name';
import { verifyEmailService } from '@/services/authService';

export default function Verify() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusVerify, setStatusVerify] = useState(''); // success, expired

  useEffect(() => {
    const token = searchParams?.get('token');
    if (!token) {
      router.push(ROUTE_NAMES.SIGN_IN);
    }
    localStorage.setItem(ACCESS_TOKEN_NAME, token || '');
    const verifyEmailWithToken = async () => {
      try {
        await verifyEmailService();
        setStatusVerify('success');
      } catch (error) {
        setStatusVerify('expired');
      } finally {
        localStorage.removeItem(ACCESS_TOKEN_NAME);
      }
    };
    verifyEmailWithToken();
  }, [router, searchParams]);

  if (statusVerify == 'success') {
    return (
      <div className="flex flex-col items-center bg-background bg-cover bg-center bg-no-repeat md:!bg-[url('/bg_auth.png')]">
        <div className="mx-auto mt-10 w-full px-[5vw] py-8 md:max-w-[500px] md:rounded-3xl md:px-6 md:shadow-2">
          <div className="mx-auto w-[223px]">
            <Image
              src="/email_verified.svg"
              alt="Email verified!"
              width={500}
              height={500}
            ></Image>
          </div>
          <p className="mt-8 text-center text-[22px] font-medium text-primary">
            Email verified!
          </p>
          <p className="mt-5 text-center">
            Your email has been verified. Now you can sign in with registered
            email to use all Middo’s features
          </p>
          <Button tag="a" href={ROUTE_NAMES.SIGN_IN}>
            Go to sign in
          </Button>
        </div>
      </div>
    );
  }

  if (statusVerify == 'expired') {
    return (
      <div className="flex flex-col items-center bg-background bg-cover bg-center bg-no-repeat md:!bg-[url('/bg_auth.png')]">
        <div className="mx-auto mt-10 w-full px-[5vw] py-8 md:max-w-[500px] md:rounded-3xl md:px-6 md:shadow-2">
          <div className="mx-auto w-[223px]">
            <Image
              src="/link_expired.svg"
              alt="Link expired!"
              width={500}
              height={500}
            ></Image>
          </div>
          <p className="mt-8 text-center text-[22px] font-medium text-primary">
            Link expired!
          </p>
          <p className="mt-5 text-center">
            Your email verification link has expired. Please sign up again to
            get a new verification link.
          </p>
          <Button tag="a" href={ROUTE_NAMES.SIGN_UP}>
            Go to sign up
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
