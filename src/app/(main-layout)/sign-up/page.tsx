"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { InputField } from '@/components/form/InputField';
import { ROUTE_NAMES } from '@/configs/route-name';
import { registerService } from '@/services/authService';
import { RegisterSchema as schema } from '@/configs/yup-form';
import { Button } from '@/components/form/Button';
import { toast } from '@/components/toast';
import { PageLoading } from '@/components/loading/PageLoading';
import { AlertCircleOutline } from '@easy-eva-icons/react';
import { AlertError } from '@/components/Alert/AlertError';


export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
    const {
      register,
      watch,
      trigger,
      reset,
      formState: { errors, isValid, touchedFields },
    } = useForm({
      mode: "onBlur",
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
        setErrorMessage("");
      } catch (err: any) {
        setErrorMessage(err?.response?.data?.message);
      } finally {
        setLoading(false);
        // reset();
      }
    }

    return (  
      <div>
        {loading && <PageLoading />}
        <div className="flex h-screen flex-col items-center bg-background bg-cover bg-center bg-no-repeat md:!bg-[url('/bg_auth.png')]">
          <div className="bg-background px-[5vw] py-8 md:mt-10 md:w-[500px] md:rounded-3xl md:px-6 md:shadow-2 w-full">
            <div className="flex w-full items-stretch justify-start gap-3">
              <div className="h-full w-1 rounded-full bg-primary"></div>
              <h3 className="text-primary relative pl-4 leading-tight before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:w-1 before:rounded-md before:bg-primary">Sign up</h3>
            </div>
            <AlertError errorMessage={errorMessage}></AlertError>
            <form className="flex w-full flex-col items-center" onSubmit={handleSubmitForm}>
              <InputField
                className="mt-4"
                label="Email"
                placeholder="Enter your email"
                register={{...register('email')}}
                errors={errors.email}
                isTouched={touchedFields.email}
                type="text"
              />
              <InputField 
                className="mt-4"
                label="Password"
                subLabel="At least 8 characters, including 1 capitalize letter."
                placeholder="Enter your password"
                register={{...register('password')}}
                errors={errors.password}
                isTouched={touchedFields.password}
                type="password"
              />
              <InputField
                className="mt-4"
                label="Confirm Password"
                placeholder="Confirm your password"
                register={{...register('confirmPassword')}}
                errors={errors.confirmPassword}
                isTouched={touchedFields.confirmPassword}
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
