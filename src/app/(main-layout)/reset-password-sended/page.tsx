'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/form/Button';
import Image from 'next/image';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useRouter } from 'next/navigation';

export default function ResetPasswordSended() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    let emailLocalstorage = localStorage.getItem('email_reset_password') || '';
    if (!emailLocalstorage) {
      router.push(ROUTE_NAMES.SIGN_IN);
    }
    setEmail(emailLocalstorage);
    localStorage.removeItem('email_reset_password');
  }, [router]);

  return (
    <div className="flex flex-col items-center bg-background bg-cover bg-center bg-no-repeat md:!bg-[url('/bg_auth.png')]">
      <div className="w-full bg-background px-[5vw] py-8 md:mt-10 md:w-[500px] md:rounded-3xl md:px-6 md:shadow-2">
        <div className="mx-auto w-[223px]">
          <Image
            src="/sended_email.svg"
            alt="Reset password"
            width={500}
            height={500}
          ></Image>
        </div>
        <p className="mt-8 text-center text-[22px] font-medium text-primary">
          Reset password
        </p>
        <p className="mt-5 text-center">
          An reset password link has been sent to <strong>{email}</strong>
        </p>
        <Button tag="a" href={ROUTE_NAMES.SIGN_IN}>
          Go to sign in
        </Button>
      </div>
    </div>
  );
}
