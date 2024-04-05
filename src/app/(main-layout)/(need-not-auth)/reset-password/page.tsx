'use client';
import * as yup from 'yup';
import { useEffect, useState } from 'react';

import { ACCESS_TOKEN_NAME } from '@/configs/store-key';
import { AlertError } from '@/components/alert/alert-error';
import { Button } from '@/components/form/button';
import { InputField } from '@/components/form/Input-field';
import { PageLoading } from '@/components/loading/page-loading';
import { ROUTE_NAMES } from '@/configs/route-name';
import { resetPasswordService, setCookieService } from '@/services/auth.service';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { PASSWORD_PATTERN } from '@/configs/regex-pattern';

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');
  const {t} = useTranslation('common')
  const {
    register,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(yup
      .object()
      .shape({
        password: yup
          .string()
          .required({
            value: true,
            message: t('MESSAGE.ERROR.REQUIRED'),
          })
          .min(8, {
            value: 8,
            message: t('MESSAGE.ERROR.MIN_LENGTH', {num: 8, field: t('COMMON.PASSWORD')}),
          })
          .matches(
            PASSWORD_PATTERN, t('MESSAGE.ERROR.PASSWORD_PATTERN'),
          ),
        confirmPassword: yup
          .string()
          .required({
            value: true,
            message: t('MESSAGE.ERROR.REQUIRED'),
          })
          .oneOf([yup.ref('password')], {
            value: true,
            message: t('MESSAGE.ERROR.PASSWORD_NOT_MATCH'),
          }),
      })
      .required()),
  });

  useEffect(() => {
    const token = searchParams?.get('token');
    if (!token) {
      router.push(ROUTE_NAMES.SIGN_IN);
    }
  }, [router, searchParams]);

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    trigger();
    if (!isValid) return;
    setLoading(true);
    try {
      const token = searchParams?.get('token');
      await setCookieService([{key: ACCESS_TOKEN_NAME, value: token || '', time: 15 }]);
      await resetPasswordService(watch().password);
      router.push(ROUTE_NAMES.SIGN_IN);
      toast.success(t('MESSAGE.SUCCESS.CHANGE_PASSWORD'));
      setErrorMessage('');
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-background bg-cover bg-center bg-no-repeat md:!bg-[url('/bg_auth.png')]">
      {loading && <PageLoading />}
      <div className="mx-auto mt-10 w-full px-[5vw] py-8 md:max-w-[500px] md:rounded-3xl md:px-6 md:shadow-2">
        <h4 className="relative mb-5 pl-4 leading-tight text-primary before:absolute before:bottom-0 before:left-0 before:top-0 before:w-1 before:rounded-md before:bg-primary before:content-['']">
          {t('CHANGE_PASSWORD.TITLE')}
        </h4>
        <form onSubmit={handleSubmitForm}>
          <InputField
            className="mt-5"
            label={t('COMMON.PASSWORD')}
            placeholder={t('COMMON.PASSWORD_PLACEHOLDER')}
            register={{ ...register('password') }}
            errors={errors.password}
            type="password"
          />
          <InputField
            className="mt-5"
            label={t('COMMON.CONFIRM_PASSWORD')}
            placeholder={t('COMMON.CONFIRM_PASSWORD_PLACEHOLDER')}
            register={{ ...register('confirmPassword') }}
            errors={errors.confirmPassword}
            type="password"
          />
          <AlertError errorMessage={errorMessage}></AlertError>
          <Button type="submit">{t('COMMON.CONFIRM')}</Button>
        </form>
      </div>
    </div>
  );
}
