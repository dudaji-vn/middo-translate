'use client';

import { AlertError } from '@/components/Alert/AlertError';
import { Button } from '@/components/form/Button';
import { InputField } from '@/components/form/InputField';
import Link from 'next/link';
import { PageLoading } from '@/components/loading/PageLoading';
import { ROUTE_NAMES } from '@/configs/route-name';
import { forgotPasswordService } from '@/services/authService';
import { ForgotPasswordSchema as schema } from '@/configs/yup-form';
import { toast } from '@/components/toast';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

export default function ForgotPassword() {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    resolver: yupResolver(schema),
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
          Forgot password
        </h4>
        <p>
          We&apos;ll send a link through your provided email to help you reset
          your password
        </p>
        <form onSubmit={handleSubmitForm}>
          <InputField
            className="mt-8"
            label="Email"
            placeholder="Enter your email"
            register={{ ...register('email') }}
            errors={errors.email}
            type="text"
          />
          <AlertError errorMessage={errorMessage}></AlertError>
          <Button type="submit">Confirm</Button>
        </form>
        <div className="mt-8 flex justify-center">
          <Link
            href={ROUTE_NAMES.SIGN_IN}
            className="w-fit-content mx-auto inline-block active:text-primary md:hover:font-medium"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
