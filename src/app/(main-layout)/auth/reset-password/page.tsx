'use client';

import { useEffect, useState } from 'react';

import { ACCESS_TOKEN_NAME } from '@/configs/store-key';
import { AlertError } from '@/components/Alert/AlertError';
import { Button } from '@/components/form/Button';
import { InputField } from '@/components/form/InputField';
import { PageLoading } from '@/components/loading/PageLoading';
import { ROUTE_NAMES } from '@/configs/route-name';
import { resetPasswordService } from '@/services/authService';
import { ResetPasswordSchema as schema } from '@/configs/yup-form';
import { toast } from '@/components/toast';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');

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
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const token = searchParams?.get('token');
    if (!token) {
      router.push(ROUTE_NAMES.SIGN_IN);
    }
    localStorage.setItem(ACCESS_TOKEN_NAME, token || '');
    return () => {
      localStorage.removeItem(ACCESS_TOKEN_NAME);
    };
  }, [router, searchParams]);

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    trigger();
    if (!isValid) return;
    setLoading(true);
    try {
      await resetPasswordService(watch().password);
      localStorage.removeItem(ACCESS_TOKEN_NAME);
      router.push(ROUTE_NAMES.SIGN_IN);
      toast({
        title: 'Your password has been changed!',
        description: 'Please login again!',
      });
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
          Change password
        </h4>
        <form onSubmit={handleSubmitForm}>
          <InputField
            className="mt-5"
            label="Password"
            placeholder="Enter password"
            register={{ ...register('password') }}
            errors={errors.password}
            type="password"
          />
          <InputField
            className="mt-5"
            label="Confirm Password"
            placeholder="Confirm password"
            register={{ ...register('confirmPassword') }}
            errors={errors.confirmPassword}
            type="password"
          />
          <AlertError errorMessage={errorMessage}></AlertError>
          <Button type="submit">Confirm</Button>
        </form>
      </div>
    </div>
  );
}
