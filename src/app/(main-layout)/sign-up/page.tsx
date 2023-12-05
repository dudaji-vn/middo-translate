"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { InputField } from '@/components/form/InputField';
import { ROUTE_NAMES } from '@/configs/route-name';
import { registerService } from '@/services/authService';
import { toast } from '@/components/toast';
import { PageLoading } from '@/components/feedback';
import { RegisterSchema as schema } from '@/configs/yup-form';
import { Button } from '@/components/form/Button';


export default function SignUp() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
    const {
      register,
      watch,
      trigger,
      reset,
      formState: { errors, isValid },
    } = useForm({
      mode: "onSubmit",
      defaultValues: {
        email: "",
        password: "",
        confirmPassword: "",
      },
      resolver: yupResolver(schema),
    });

    const handleSubmitForm = async (e: React.FormEvent) => {
      e.preventDefault();
      trigger();
      if (!isValid) return;

      try {
        setLoading(true);
        await registerService(watch());
        localStorage.setItem("email_register", watch().email);
        router.push(ROUTE_NAMES.SIGN_UP_SUCCESS);
      } catch (error: any) {
        if(error?.response?.data?.message) {
          toast({ title: 'Error', description: error?.response?.data?.message });
        }
      } finally {
        setLoading(false);
        reset();
      }
    }

    return (  
      <div>
        {loading && <PageLoading />}
        <div className="flex h-screen flex-col items-center bg-background bg-cover bg-center bg-no-repeat md:!bg-[url('/bg_auth.png')]">
          <div className="bg-background px-[5vw] py-8 md:mt-10 md:w-[500px] md:rounded-3xl md:px-6 md:shadow-2 w-full">
            <div className="flex w-full items-stretch justify-start gap-3">
              <div className="h-full w-1 rounded-full bg-primary"></div>
              <h4 className="text-primary">Sign up</h4>
            </div>
            <form className="flex w-full flex-col items-center" onSubmit={handleSubmitForm}>
              <InputField
                className="mt-8"
                label="Email"
                placeholder="Enter your email"
                register={{...register('email')}}
                errors={errors.email}
                type="text"
              />
              <InputField 
                className="mt-4"
                label="Password"
                subLabel="At least 8 characters, including 1 capitalize letter."
                placeholder="Enter your password"
                register={{...register('password')}}
                errors={errors.password}
                type="password"
              />
              <InputField
                className="mt-4"
                label="Confirm Password"
                placeholder="Confirm your password"
                register={{...register('confirmPassword')}}
                errors={errors.confirmPassword}
                type="password"
              />
              <Button type="submit">Sign up</Button>
            </form>
            <div className="mt-8 flex justify-center">
              <Link
                href={ROUTE_NAMES.SIGN_IN}
                className="active:text-primary md:hover:font-medium mx-auto inline-block w-fit-content"
              >Cancel</Link>
            </div>
          </div>
        </div>
      </div>
    );
}
