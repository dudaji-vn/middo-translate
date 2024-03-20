'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useRouter } from 'next/navigation';

export default function ResetPasswordSended() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const {t} = useTranslation('common')
  useEffect(() => {
    let emailLocalStorage = localStorage.getItem('email_reset_password') || '';
    if (!emailLocalStorage) {
      router.push(ROUTE_NAMES.SIGN_IN);
    }
    setEmail(emailLocalStorage);
    localStorage.removeItem('email_reset_password');
  }, [router]);

  return (
    <div className="flex h-screen flex-col items-center bg-background bg-cover bg-center bg-no-repeat md:!bg-[url('/bg_auth.png')]">
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
          {t('RESET_PASSWORD_SENDED.TITLE')}
        </p>
        <p className="mt-5 text-center">
          {t('RESET_PASSWORD_SENDED.MESSAGE')} <strong>{email}</strong>
        </p>
        {/* <Button tag='a' href={ROUTE_NAMES.SIGN_IN}>Go to sign in</Button> */}
      </div>
    </div>
  );
}
