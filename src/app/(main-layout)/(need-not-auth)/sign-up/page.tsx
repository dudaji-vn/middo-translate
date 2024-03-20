'use client';

import * as yup from 'yup';
import { AlertError } from '@/components/alert/alert-error';
import { Button } from '@/components/form/button';
import { InputField } from '@/components/form/Input-field';
import Link from 'next/link';
import { PageLoading } from '@/components/loading/page-loading';
import { ROUTE_NAMES } from '@/configs/route-name';
import { registerService } from '@/services/auth.service';
import { RegisterSchema as schema } from '@/configs/yup-form';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { PASSWORD_PATTERN } from '@/configs/regex-pattern';

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
    <div>
      {loading && <PageLoading />}
      <div className="flex flex-col items-center bg-background bg-cover bg-center bg-no-repeat md:!bg-[url('/bg_auth.png')]">
        <div className="w-full bg-background px-[5vw] py-8 md:mt-10 md:w-[500px] md:rounded-3xl md:px-6 md:shadow-2">
          <div className="flex w-full items-stretch justify-start gap-3">
            <div className="h-full w-1 rounded-full bg-primary"></div>
            <h3 className="relative pl-4 leading-tight text-primary before:absolute before:bottom-0 before:left-0 before:top-0 before:w-1 before:rounded-md before:bg-primary before:content-['']">
              {t('SIGN_UP.TITLE')}
            </h3>
          </div>
          <AlertError errorMessage={errorMessage}></AlertError>
          <form
            className="flex w-full flex-col items-center"
            onSubmit={handleSubmitForm}
          >
            <InputField
              className="mt-4"
              label={t('COMMON.EMAIL')}
              placeholder={t('COMMON.EMAIL_PLACEHOLDER')}
              register={{ ...register('email') }}
              errors={errors.email}
              isTouched={touchedFields.email}
              type="text"
            />
            <InputField
              className="mt-4"
              label={t('COMMON.PASSWORD')}
              subLabel={t('SIGN_UP.PASSWORD_DES')}
              placeholder={t('COMMON.PASSWORD_PLACEHOLDER')}
              register={{ ...register('password') }}
              errors={errors.password}
              isTouched={touchedFields.password}
              type="password"
            />
            <InputField
              className="mt-4"
              label={t('COMMON.CONFIRM_PASSWORD')}
              placeholder={t('COMMON.CONFIRM_PASSWORD_PLACEHOLDER')}
              register={{ ...register('confirmPassword') }}
              errors={errors.confirmPassword}
              isTouched={touchedFields.confirmPassword}
              type="password"
            />
            <Button type="submit">{t('SIGN_UP.TITLE')}</Button>
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
    </div>
  );
}
