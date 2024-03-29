'use client';

import { useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';
import { AlertError } from '@/components/alert/alert-error';
import { Button } from '@/components/form/button';
import { GoogleIcon } from '@/components/icons';
import Image from 'next/image';
import { InputField } from '@/components/form/Input-field';
import Link from 'next/link';
import { Button as MyButton } from '@/components/actions/button';
import { PageLoading } from '@/components/loading/page-loading';
import { ROUTE_NAMES } from '@/configs/route-name';
import {
  getCookieService,
  loginService,
  setCookieService,
} from '@/services/auth.service';
import { LoginSchema as schema } from '@/configs/yup-form';
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
interface DataResponseToken {
  token: string;
  refresh_token: string;
}

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { isElectron, ipcRenderer } = useElectron();
  const {t} = useTranslation("common");
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
    resolver: yupResolver(yup
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
            message: t('MESSAGE.ERROR.REQUIRED'),
          }),
        password: yup.string().required({
          value: true,
          message: t('MESSAGE.ERROR.REQUIRED'),
        }),
      })
      .required()),
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
      const { user } = data?.data;
      setDataAuth({ user, isAuthentication: true });
      toast.success(t('MESSAGE.SUCCESS.LOGIN'));
      setErrorMessage('');
    } catch (err: any) {
      setErrorMessage( t('MESSAGE.ERROR.INVALID_ACCOUNT'));
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
      {key: 'access_token', value: token},
      {key: 'refresh_token', value: refresh_token},
    ]
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
        router.push(ROUTE_NAMES.ROOT);
      }
    }
  }, [
    isAuthentication,
    router,
    userData?.avatar,
    userData?.language,
    userData?.name,
  ]);

  if (isAuthentication && userData) return null;

  return (
    <div>
      {loading && <PageLoading />}
      <div className="flex flex-col items-center bg-background bg-cover bg-center bg-no-repeat md:!bg-[url('/bg_auth.png')]">
        <div className="w-full bg-background px-[5vw] py-8 md:mt-10 md:w-[500px] md:rounded-3xl md:px-6 md:shadow-2">
          <h4 className="text-center text-[26px] font-bold text-primary">
            {t('SIGN_IN.TITLE')}
          </h4>

          <form
            className="flex w-full flex-col items-center"
            onSubmit={handleSubmitForm}
          >
            <InputField
              className="mt-8"
              placeholder={t('COMMON.EMAIL_PLACEHOLDER')}
              register={{ ...register('email') }}
              errors={errors.email}
              type="text"
            />
            <InputField
              className="mt-4"
              placeholder={t('COMMON.PASSWORD_PLACEHOLDER')}
              register={{ ...register('password') }}
              errors={errors.password}
              type="password"
            />
            <Link
              className="color-[#333] ml-auto mt-3 inline-block italic hover:underline"
              href={ROUTE_NAMES.FORGOT_PASSWORD}
            >
              {t('SIGN_IN.FORGOT_PASSWORD')}
            </Link>
            <AlertError errorMessage={errorMessage}></AlertError>
            <Button type="submit">{t('SIGN_IN.TITLE')}</Button>
          </form>
          <div className="mx-auto my-10 h-[1px] w-[120px] bg-[#ccc]"></div>
          <p className="mb-5 text-center text-[#333]">{t('SIGN_IN.NO_ACCOUNT')}</p>
          <div className="mb-10 flex justify-center">
            <Link
              className="hover:after:opacity-1 relative font-medium text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-primary after:opacity-0 after:content-['']"
              href={ROUTE_NAMES.SIGN_UP}
            >
              {t('SIGN_IN.SIGN_UP_HERE')}
            </Link>
          </div>
          <div className="flex items-center justify-center gap-5">
            <p>{t('SIGN_IN.SOCIAL_LOGIN')}</p>
            {isElectron ? (
              <MyButton.Icon color="default" onClick={handleLoginGoogle}>
                <GoogleIcon />
              </MyButton.Icon>
            ) : (
              <Link href="/api/auth/google">
                <MyButton.Icon color="default">
                  <GoogleIcon />
                </MyButton.Icon>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
