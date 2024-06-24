'use client';

import { useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';
import { AlertError } from '@/components/alert/alert-error';

import Image from 'next/image';
import { InputField } from '@/components/form/Input-field';
import Link from 'next/link';

import { ROUTE_NAMES } from '@/configs/route-name';
import { loginService, setCookieService } from '@/services/auth.service';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/auth.store';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useElectron } from '@/hooks/use-electron';
import { ELECTRON_EVENTS } from '@/configs/electron-events';
import trim from 'lodash/trim';
import { useTranslation } from 'react-i18next';
import DataRequestSetCookie from '@/types/set-cookie-data.interface';
import { PageLoading } from '@/components/feedback';
import { Typography } from '@/components/data-display';
import { Button } from '@/components/actions';
import { UserRound } from 'lucide-react';
import { usePlatformStore } from '@/features/platform/stores';
import { useReactNativePostMessage } from '@/hooks/use-react-native-post-message';
import customToast from '@/utils/custom-toast';

interface DataResponseToken {
  token: string;
  refresh_token: string;
}

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const { postMessage } = useReactNativePostMessage();
  const isMobile = usePlatformStore((state) => state.platform === 'mobile');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { isElectron, ipcRenderer } = useElectron();
  const { t } = useTranslation('common');
  const {
    register,
    watch,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          email: yup
            .string()
            .trim()
            .required({
              value: true,
              message: t('MESSAGE.ERROR.REQUIRED'),
            })
            .email({
              value: true,
              message: t('MESSAGE.ERROR.INVALID_EMAIL'),
            }),
          password: yup.string().required({
            value: true,
            message: t('MESSAGE.ERROR.REQUIRED'),
          }),
        })
        .required(),
    ),
  });

  const {
    isAuthentication,
    setData: setDataAuth,
    user: userData,
  } = useAuthStore();

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    trigger();

    if (!isValid) return;
    try {
      setLoading(true);
      const formData = {
        email: trim(watch('email').toLocaleLowerCase()),
        password: watch('password'),
      };
      const data = await loginService(formData);
      if (isMobile) {
        postMessage({
          type: 'Trigger',
          data: {
            event: 'login',
            payload: data,
          },
        });
        return;
      }
      const { user } = data?.data;
      setDataAuth({ user, isAuthentication: true });
      customToast.success(t('MESSAGE.SUCCESS.LOGIN'));
      setErrorMessage('');
    } catch (err: any) {
      setErrorMessage(t('MESSAGE.ERROR.INVALID_ACCOUNT'));
    } finally {
      setLoading(false);
      // reset();
    }
  };

  const handleLoginGoogle = async () => {
    ipcRenderer.send(ELECTRON_EVENTS.GOOGLE_LOGIN);
  };

  const saveCookie = useCallback((data: DataResponseToken) => {
    const { token, refresh_token } = data;
    const setCookieData: DataRequestSetCookie[] = [
      { key: 'access_token', value: token },
      { key: 'refresh_token', value: refresh_token },
    ];
    setCookieService(setCookieData)
      .then((_) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (isElectron && ipcRenderer) {
      ipcRenderer.on(ELECTRON_EVENTS.GOOGLE_LOGIN_SUCCESS, saveCookie);
    }
    return () => {
      if (isElectron && ipcRenderer) {
        ipcRenderer.off(ELECTRON_EVENTS.GOOGLE_LOGIN_SUCCESS, saveCookie);
      }
    };
  }, [ipcRenderer, isElectron, saveCookie]);

  useEffect(() => {
    if (isAuthentication) {
      if (!userData?.avatar && !userData?.name && !userData?.language) {
        router.push(ROUTE_NAMES.CREATE_ACCOUNT);
      } else {
        router.push(ROUTE_NAMES.ONLINE_CONVERSATION);
      }
    }
  }, [
    isAuthentication,
    router,
    userData?.avatar,
    userData?.language,
    userData?.name,
  ]);

  return (
    <>
      {(loading || (isAuthentication && userData)) && <PageLoading />}
      <form
        className="flex w-full flex-col items-center"
        onSubmit={handleSubmitForm}
      >
        {!isMobile && (
          <Typography
            variant={'h1'}
            className="mb-8 text-center text-2xl font-semibold text-primary"
          >
            {t('SIGN_IN.TITLE')}
          </Typography>
        )}
        <InputField
          placeholder={t('COMMON.EMAIL_PLACEHOLDER')}
          register={{ ...register('email') }}
          errors={errors.email}
          type="text"
        />
        <InputField
          className="mt-5"
          placeholder={t('COMMON.PASSWORD_PLACEHOLDER')}
          register={{ ...register('password') }}
          errors={errors.password}
          type="password"
        />
        <Link
          className="ml-auto mt-3 inline-block rounded-xl px-3 py-2 font-semibold text-neutral-700 active:bg-neutral-100 dark:text-neutral-50 md:hover:bg-neutral-50 dark:md:hover:bg-neutral-900 dark:md:active:bg-neutral-800"
          href={ROUTE_NAMES.FORGOT_PASSWORD}
        >
          {t('SIGN_IN.FORGOT_PASSWORD')}
        </Link>
        <AlertError errorMessage={errorMessage}></AlertError>
        <Button
          variant={'default'}
          size={'md'}
          shape={'square'}
          color={'primary'}
          className="mt-5 w-full"
          type="submit"
        >
          {t('SIGN_IN.TITLE')}
        </Button>
      </form>
      <div className="mx-auto my-10 h-[1px] w-full bg-neutral-50 dark:bg-neutral-900"></div>
      <Typography
        variant={'h2'}
        className="mb-5 text-center text-base font-normal text-neutral-800 dark:text-neutral-50"
      >
        {t('SIGN_IN.NO_ACCOUNT')}
      </Typography>
      <Link href={ROUTE_NAMES.SIGN_UP} className="mb-4 block">
        <Button
          variant={'default'}
          size={'md'}
          shape={'square'}
          color={'default'}
          startIcon={<UserRound className="size-4" />}
          className="w-full"
        >
          {t('SIGN_IN.SIGN_UP')}
        </Button>
      </Link>
      {!isMobile && (
        <>
          {isElectron ? (
            <Button
              variant={'default'}
              size={'md'}
              shape={'square'}
              color={'default'}
              onClick={handleLoginGoogle}
              className="w-full"
            >
              <Image
                src="/images/google-icon.svg"
                alt="Google"
                width={16}
                height={16}
                className="mr-2"
              />
              {t('SIGN_IN.GOOGLE_LOGIN')}
            </Button>
          ) : (
            <Link href="/api/auth/google">
              <Button
                variant={'default'}
                size={'md'}
                shape={'square'}
                color={'default'}
                className="w-full"
              >
                <Image
                  src="/images/google-icon.svg"
                  alt="Google"
                  width={16}
                  height={16}
                  className="mr-2"
                />
                {t('SIGN_IN.GOOGLE_LOGIN')}
              </Button>
            </Link>
          )}
        </>
      )}
    </>
  );
}
