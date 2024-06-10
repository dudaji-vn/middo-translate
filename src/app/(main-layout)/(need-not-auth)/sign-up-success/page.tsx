'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { PageLoading } from '@/components/feedback';
import { ROUTE_NAMES } from '@/configs/route-name';
import { resendEmailService } from '@/services/auth.service';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/actions';

export default function SignUpSuccess() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isResend, setIsResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(30);
  const timerRef = useRef<any>();
  const {t} = useTranslation('common')
  useEffect(() => {
    if (time > 0) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      clearInterval(timerRef.current);
    };
  }, [isResend, time]);

  useEffect(() => {
    let emailLocalstorage = localStorage.getItem('email_register') || '';
    if (!emailLocalstorage) {
      router.push(ROUTE_NAMES.SIGN_UP);
    }
    setEmail(emailLocalstorage);
    localStorage.removeItem('email_register');
  }, [router]);

  const resendEmail = async () => {
    try {
      setLoading(true);
      setIsResend(true);
      const data = await resendEmailService(email);
      toast.success(t('MESSAGE.SUCCESS.RESEND_EMAIL'));
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-background">
      {loading && <PageLoading />}
      <div className="w-full bg-background px-[5vw] py-8 md:my-10 md:w-[500px] md:rounded-3xl md:px-6">
        <div className="mx-auto w-[223px]">
          <Image
            src="/sended_email.svg"
            alt={t('SIGN_UP_SUCCESS.TITLE')}
            width={500}
            height={500}
          ></Image>
        </div>
        <p className="mt-8 text-center text-[22px] font-medium text-primary">
          {t('SIGN_UP_SUCCESS.TITLE')}
        </p>
        <p className="mt-5 text-center" dangerouslySetInnerHTML={{__html: t('SIGN_UP_SUCCESS.MESSAGE', {email: email})}}></p>
        {time > 0 && <p className="mt-4 text-center text-sm text-neutral-300 font-medium">
          {t('SIGN_UP_SUCCESS.RESEND_AFTER', {time: time})}
        </p>}
        <Button
          variant={'default'}
          size={'md'}
          shape={'square'}
          color={'primary'}
          className='w-full mt-5'
          onClick={resendEmail}
          disabled={isResend || time > 0}
          type='submit'
        >
          {t('SIGN_UP_SUCCESS.RESEND')}
        </Button>
        <div className="flex justify-center">
          <Link href={ROUTE_NAMES.SIGN_IN} className='block w-full mt-3'>
            <Button
              variant={'ghost'}
              size={'md'}
              shape={'square'}
              color={'default'}
              className='w-full'>
              {t('COMMON.CANCEL')}
            </Button>
          </Link>
        </div>
        
      </div>
    </div>
  );
}
