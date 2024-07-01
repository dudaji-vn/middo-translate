'use client';
import * as yup from 'yup';
import { useEffect, useState } from 'react';

import { ACCESS_TOKEN_NAME } from '@/configs/store-key';
import { AlertError } from '@/components/alert/alert-error';
import { InputField } from '@/components/form/Input-field';
import { PageLoading } from '@/components/feedback';
import { ROUTE_NAMES } from '@/configs/route-name';
import { checkTokenResetPassword, resetPasswordService, setCookieService } from '@/services/auth.service';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { CAPS_PATTERN, PASSWORD_PATTERN, patternMinLength } from '@/configs/regex-pattern';
import { Typography } from '@/components/data-display';
import { Button } from '@/components/actions';
import { InputPasswordPattern } from '@/components/form/input-password-pattern';
import customToast from '@/utils/custom-toast';

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
            CAPS_PATTERN, t('MESSAGE.ERROR.PASSWORD_PATTERN'),
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
    const checkToken = async () => {
      try {
        await setCookieService([{key: ACCESS_TOKEN_NAME, value: token || '', time: 15 }]);
        const res = await checkTokenResetPassword();
        const {data} = res;
        if(data?.isValid) return;
        router.push(ROUTE_NAMES.SIGN_IN);
      } catch (_: unknown) {
        router.push(ROUTE_NAMES.SIGN_IN);
      } finally {
        setLoading(false);
      }
    }
    if (!token) {
      router.push(ROUTE_NAMES.SIGN_IN);
    } else {
      // Check Token
      checkToken();

    }
  }, [router, searchParams, t]);

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
      customToast.success(t('MESSAGE.SUCCESS.CHANGE_PASSWORD'));
      setErrorMessage('');
    } catch (err: any) {
      setErrorMessage(t(err?.response?.data?.message || 'BACKEND.MESSAGE.SOMETHING_WRONG'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <PageLoading />}
      <form onSubmit={handleSubmitForm} className='mt-5'>
      <Typography variant={'h1'} className="text-center text-2xl font-semibold text-primary mb-1">
        {t('CHANGE_PASSWORD.TITLE')}
      </Typography>
      {/* <InputField
        className="mt-5"
        placeholder={t('COMMON.PASSWORD_PLACEHOLDER')}
        register={{ ...register('password') }}
        errors={errors.password}
        type="password"
      /> */}
      <InputPasswordPattern 
        className="mt-5"
        placeholder={t('COMMON.PASSWORD_PLACEHOLDER')}
        register={{ ...register('password') }}
        errors={errors.password}
        value={watch().password}
        patterns={[
          {
            pattern: patternMinLength(8),
            message: t('MESSAGE.ERROR.AT_LEAST_CHARACTERS', { num: 8 }),
          },
          {
            pattern: CAPS_PATTERN,
            message: t('MESSAGE.ERROR.AT_LEAST_ONE_CAPITAL'),
          },
        ]}
      />
      <InputField
        className="mt-5"
        placeholder={t('COMMON.CONFIRM_PASSWORD_PLACEHOLDER')}
        register={{ ...register('confirmPassword') }}
        errors={errors.confirmPassword}
        type="password"
      />
      <AlertError errorMessage={errorMessage}></AlertError>
      <Button
        variant={'default'}
        size={'md'}
        shape={'square'}
        color={'primary'}
        className='w-full mt-5'
        disabled={!isValid}
        type='submit'
      >{t('COMMON.CONFIRM')}</Button>
      </form>
    </>
  );
}
