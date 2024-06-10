'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ACCESS_TOKEN_NAME } from '@/configs/store-key';
import Image from 'next/image';
import { ROUTE_NAMES } from '@/configs/route-name';
import { setCookieService, verifyEmailService } from '@/services/auth.service';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Button } from '@/components/actions';

export default function Verify() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusVerify, setStatusVerify] = useState(''); // success, expired
  const {t} = useTranslation('common')
  useEffect(() => {
    const token = searchParams?.get('token');
    if (!token) {
      router.push(ROUTE_NAMES.SIGN_IN);
    }
    const verifyEmailWithToken = async () => {
      try {
        const token = searchParams?.get('token');
        await setCookieService([{key: ACCESS_TOKEN_NAME, value: token || '', time: 15 }]);
        await verifyEmailService();
        setStatusVerify('success');
      } catch (error) {
        setStatusVerify('expired');
      } finally {}
    };
    verifyEmailWithToken();
  }, [router, searchParams]);

  if (statusVerify == 'success') {
    return (
      <div className="">
        <div className="mx-auto mt-10 w-full px-[5vw] py-8 md:max-w-[500px] md:rounded-3xl md:px-6">
          <div className="mx-auto w-[223px]">
            <Image
              src="/email_verified.svg"
              alt="Email verified!"
              width={500}
              height={500}
            ></Image>
          </div>
          <p className="mt-8 text-center text-[22px] font-medium text-primary">
            {t('VERIFY.SUCCESS.TITLE')}
          </p>
          <p className="mt-3 text-center">
            {t('VERIFY.SUCCESS.MESSAGE')}
          </p>
          <Link href={ROUTE_NAMES.SIGN_IN} className='mt-5 justify-center flex'>
            <Button
              variant={'default'}
              size={'md'}
              shape={'square'}
              color={'primary'}>
              {t('VERIFY.SUCCESS.GOTO_SIGN_IN')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (statusVerify == 'expired') {
    return (
      <div className="bg-background">
        <div className="mx-auto mt-10 w-full px-[5vw] py-8 md:max-w-[500px] md:rounded-3xl md:px-6">
          <div className="mx-auto w-[223px]">
            <Image
              src="/link_expired.svg"
              alt="Link expired!"
              width={500}
              height={500}
            ></Image>
          </div>
          <p className="mt-8 text-center text-[22px] font-medium text-primary">
          {t('VERIFY.EXPIRED.TITLE')}
          </p>
          <p className="mt-3 text-center">
          {t('VERIFY.EXPIRED.MESSAGE')}
          </p>
          <Link href={ROUTE_NAMES.SIGN_UP} className='mt-5 justify-center flex'>
            <Button
              variant={'default'}
              size={'md'}
              shape={'square'}
              color={'primary'}>
              {t('VERIFY.EXPIRED.GOTO_SIGN_UP')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
