'use client';

import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/form/button';
import Image from 'next/image';
import Link from 'next/link';
import { PageLoading } from '@/components/feedback';
import { ROUTE_NAMES } from '@/configs/route-name';
import { resendEmailService } from '@/services/auth.service';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

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
    <div className="flex flex-col items-center bg-background bg-cover bg-center bg-no-repeat md:!bg-[url('/bg_auth.png')]">
      {loading && <PageLoading />}
      <div className="w-full bg-background px-[5vw] py-8 md:mt-10 md:w-[500px] md:rounded-3xl md:px-6 md:shadow-2">
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
        <Button onClick={resendEmail} disabled={isResend || time > 0}>
          {time > 0 ? t('SIGN_UP_SUCCESS.RESEND_AFTER', {time: time}) : t('SIGN_UP_SUCCESS.RESEND')}
        </Button>
        <div className="mt-8 flex justify-center">
          <Link
            href={ROUTE_NAMES.SIGN_IN}
            className="w-fit-content mx-auto inline-block active:text-primary md:hover:font-medium"
          >
            {t('COMMON.CANCEL')}
          </Link>
        </div>
      </div>
    </div>
  );
}
