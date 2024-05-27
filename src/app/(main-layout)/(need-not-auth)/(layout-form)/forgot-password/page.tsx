'use client';
import * as yup from 'yup';
import { AlertError } from '@/components/alert/alert-error';
import { InputField } from '@/components/form/Input-field';
import Link from 'next/link';
import { PageLoading } from '@/components/feedback';
import { ROUTE_NAMES } from '@/configs/route-name';
import { forgotPasswordService } from '@/services/auth.service';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/data-display';
import { Button } from '@/components/actions';

export default function ForgotPassword() {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {t} = useTranslation('common')
  const {
    register,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
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
      })
      .required()),
  });

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    trigger();
    if (!isValid) return;
    setLoading(true);
    try {
      let res = await forgotPasswordService(watch().email);
      localStorage.setItem('email_reset_password', watch().email);
      router.push(ROUTE_NAMES.RESET_PASSWORD_SENDED);
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
        {t('FORGOT_PASSWORD.TITLE')}
      </Typography>
      <Typography variant={'h2'} className="text-center text-sm text-neutral-400 font-normal mb-8 whitespace-break-spaces">
        {t('FORGOT_PASSWORD.DESCRIPTION')}
      </Typography>
      <InputField
        placeholder={t('COMMON.EMAIL_PLACEHOLDER')}
        register={{ ...register('email') }}
        errors={errors.email}
        type="text"
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
