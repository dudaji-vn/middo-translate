'use client';

import { useEffect } from 'react';

import { setCookieService } from '@/services/auth.service';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/actions';

export default function LoginGoogleElectron() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = searchParams?.get('access_token') || '';
  const refreshToken = searchParams?.get('refresh_token') || '';
  const IS_LOADING = !accessToken && !refreshToken;
  const { t } = useTranslation('common');
  if (accessToken && refreshToken) {
    // window.location.href = `middo://token?token=${accessToken}&refresh_token=${refreshToken}`;
  }
  const openDesktop = () => {
    // window.location.href = `middo://token?token=${accessToken}&refresh_token=${refreshToken}`;
  };
  useEffect(() => {
    if (accessToken || refreshToken) return;
    setCookieService([{ key: 'login-type', value: 'desktop' }])
      .then((_) => {
        router.push('/api/auth/google');
      })
      .catch((_) => router.push(ROUTE_NAMES.ROOT));
  }, [accessToken, refreshToken, router]);

  return (
    <div className="flex flex-col items-center bg-background bg-cover bg-center bg-no-repeat md:!bg-[url('/bg_auth.png')] h-screen">
      <div className="w-full bg-background px-[5vw] py-8 my-auto md:w-[500px] md:rounded-3xl md:px-6 md:shadow-2">
        <div className="mx-auto w-[100px]">
          <Image
            src="/logo.png"
            alt=""
            width={1000}
            height={1000}
          ></Image>
        </div>
        <p className="mt-8 text-center text-[22px] font-medium">
          {IS_LOADING
            ? t('DESKTOP_LOGIN.TITLE_LOADING')
            : t('DESKTOP_LOGIN.TITLE_LOGIN_SUCCESS')}
        </p>
        <p className="mt-2 text-center">
          {IS_LOADING
            ? t('DESKTOP_LOGIN.DESCRIPTION_LOADING')
            : t('DESKTOP_LOGIN.DESCRIPTION_LOGIN_SUCCESS')}
        </p>
        {!IS_LOADING && (
          <Button onClick={openDesktop} shape={'square'} size={'sm'} className='mx-auto block mt-8'>{t('DESKTOP_LOGIN.OPEN_MIDDO')}</Button>
        )}
        {/* <div className="mt-8 flex justify-center">
          <Link
            href={ROUTE_NAMES.SIGN_IN}
            className="w-fit-content mx-auto inline-block active:text-primary md:hover:font-medium"
          >
            {t('DESKTOP_LOGIN.BACK_TO_HOME')}
          </Link>
        </div> */}
      </div>
    </div>
  );
}
