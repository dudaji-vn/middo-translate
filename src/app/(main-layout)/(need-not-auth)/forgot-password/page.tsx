'use client';
import * as yup from 'yup';
import { AlertError } from '@/components/alert/alert-error';
import { Button } from '@/components/form/button';
import { InputField } from '@/components/form/Input-field';
import Link from 'next/link';
import { PageLoading } from '@/components/loading/page-loading';
import { ROUTE_NAMES } from '@/configs/route-name';
import { forgotPasswordService } from '@/services/auth.service';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';

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
      // toast({ title: "Your request has been send!", description: "Please check your email!" });
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
          {t('FORGOT_PASSWORD.TITLE')}
        </h4>
        <p>
          {t('FORGOT_PASSWORD.DESCRIPTION')}
        </p>
        <form onSubmit={handleSubmitForm}>
          <InputField
            className="mt-8"
            label={t('COMMON.EMAIL')}
            placeholder={t('COMMON.EMAIL_PLACEHOLDER')}
            register={{ ...register('email') }}
            errors={errors.email}
            type="text"
          />
          <AlertError errorMessage={errorMessage}></AlertError>
          <Button type="submit">{t('COMMON.CONFIRM')}</Button>
        </form>
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
