'use client';

import * as yup from 'yup';
import { AlertError } from '@/components/alert/alert-error';
import { Button } from '@/components/actions';
import { InputField } from '@/components/form/Input-field';
import Link from 'next/link';
import { PageLoading } from '@/components/feedback';
import { ROUTE_NAMES } from '@/configs/route-name';
import { registerService } from '@/services/auth.service';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { CAPS_PATTERN, PASSWORD_PATTERN, patternMinLength } from '@/configs/regex-pattern';
import { Typography } from '@/components/data-display';
import { InputPasswordPattern } from '@/components/form/input-password-pattern';

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {t} = useTranslation("common");
  const router = useRouter();

  const {
    register,
    watch,
    trigger,
    reset,
    formState: { errors, isValid, touchedFields },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(yup
      .object()
      .shape({
        email: yup
          .string()
          .required({
            value: true,
            message: t('MESSAGE.ERROR.REQUIRED'),
          })
          .email({
            value: true,
            message: t('MESSAGE.ERROR.INVALID_EMAIL'),
          }),
        password: yup
          .string()
          .required({
            value: true,
            message: t('MESSAGE.ERROR.REQUIRED'),
          })
          .min(8, {
            value: 8,
            message: t('MESSAGE.ERROR.MIN_LENGTH', {num: 8}),
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

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    trigger();
    if (!isValid) return;

    try {
      setLoading(true);
      await registerService(watch());
      localStorage.setItem('email_register', watch().email);
      router.push(ROUTE_NAMES.SIGN_UP_SUCCESS);
      setErrorMessage('');
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message);
    } finally {
      setLoading(false);
      // reset();
    }
  };

  return (
    <>
      {loading && <PageLoading />}
      <form className="flex w-full flex-col items-center" onSubmit={handleSubmitForm} >
        <Typography variant={'h1'} className="text-center text-2xl font-semibold text-primary mb-8">
          {t('SIGN_UP.TITLE')}
        </Typography>
        <InputField
          placeholder={t('COMMON.EMAIL_PLACEHOLDER')}
          register={{ ...register('email') }}
          errors={errors.email}
          isTouched={touchedFields.email}
          type="text"
        />
        <InputPasswordPattern 
          className="mt-5"
          placeholder={t('COMMON.PASSWORD_PLACEHOLDER')}
          register={{ ...register('password') }}
          errors={errors.password}
          isTouched={touchedFields.password}
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
          isTouched={touchedFields.confirmPassword}
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
        >{t('SIGN_UP.TITLE')}</Button>
      </form>
      <Link href={ROUTE_NAMES.SIGN_IN} className='mb-4 block'>
        <Button
          variant={'ghost'}
          size={'md'}
          shape={'square'}
          color={'default'}
          className='w-full mt-3'>
          {t('COMMON.CANCEL')}
        </Button>
      </Link>
    </>
  );
}
