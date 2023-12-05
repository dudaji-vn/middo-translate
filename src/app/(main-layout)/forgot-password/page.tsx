"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { ROUTE_NAMES } from '@/configs/route-name';
import { forgotPasswordService } from '@/services/authService';
import { toast } from '@/components/toast';
import { InputField } from '@/components/form/InputField';
import { PageLoading } from '@/components/loading/PageLoading';
import { ForgotPasswordSchema as schema } from '@/configs/yup-form';
import { Button } from '@/components/form/Button';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, watch, trigger, formState: { errors, isValid } } = useForm({
    mode: "onSubmit",
    defaultValues: {
      email: "",
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
      toast({ title: 'Success', description: res?.data?.message })
      localStorage.setItem('email_reset_password', watch().email);
      router.push(ROUTE_NAMES.RESET_PASSWORD_SENDED);
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.message || 'Something went wrong!' })
    } finally {
      setLoading(false);
    }
  }



  return (
    <div>
      {loading && <PageLoading />}
      <div className='px-5 w-full md:max-w-[500px] mx-auto py-8'>
        <h2 className="text-primary relative pl-4 mb-5 leading-tight before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:w-1 before:rounded-md before:bg-primary">Forgot password</h2>
        <p>We'll send a link through your provided email to help you reset your password</p>
        <form onSubmit={handleSubmitForm}>
          <InputField
            className="mt-8"
            label='Email'
            placeholder="Enter your email"
            register={{ ...register('email') }}
            errors={errors.email}
            type="text"
          />
          <Button type="submit">Confirm</Button>
        </form>
        <div className="mt-8 flex justify-center">
          <Link
            href={ROUTE_NAMES.SIGN_IN}
            className="active:text-primary md:hover:font-medium mx-auto inline-block w-fit-content"
          >Cancel</Link>
        </div>
      </div>
    </div>
  );
}
