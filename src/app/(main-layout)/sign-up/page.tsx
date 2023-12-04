"use client";

import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { InputField } from '@/components/form/InputField';
import Link from 'next/link';
import { useState } from 'react';
import { useAuthStore } from '@/stores/auth';

interface SignUpProps {
}
const schema = yup
  .object()
  .shape({
    email: yup.string().required({
        value: true,
        message: "Please enter email address!"
      }).email({
        value: true,
        message: "Please enter a valid email address!"
      }),
    password: yup.string().required({
        value: true,
        message: "Please enter password!"
      }).min(8, {
        value: 8,
        message: "Password must be at least 8 characters!"
      }).matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number!"
      ),
    confirmPassword: yup.string().required({
        value: true,
        message: "Please enter confirm password!"
      }).oneOf([yup.ref('password')], {
        value: true,
        message: "Confirm password does not match!"
      })
  })
  .required()

export default function SignUp(props: SignUpProps) {
    const {
      register,
      watch,
      trigger,
      reset,
      formState: { errors, dirtyFields },
    } = useForm({
      mode: "onBlur",
      defaultValues: {
        email: "",
        password: "",
        confirmPassword: "",
      },
      resolver: yupResolver(schema),
    });

    const { loading, register: submitRegister } = useAuthStore();

    const handleSubmitForm = async (e: React.FormEvent) => {
      e.preventDefault();
      trigger();
      if (Object.keys(errors).length > 0) return;
      let data = watch();
      await submitRegister(data);
      reset();
    }

    return (  
      <div>
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
              <button
                type="submit"
                className={`mt-10 flex w-full items-center justify-center rounded-full border border-transparent bg-primary px-8 py-4 font-semibold text-background active:!border-transparent active:!bg-shading active:!text-background md:max-w-[320px] md:hover:border md:hover:border-primary md:hover:bg-background md:hover:text-primary ${loading && '!bg-slate-400 pointer-events-none'}`}
                disabled={loading}
              >
                Sign up
              </button>
            </form>
            <div className="mt-8 flex justify-center">
              <Link
                href="/sign-in"
                className="active:text-primary md:hover:font-medium mx-auto inline-block w-fit-content"
              >Cancel</Link>
            </div>
          </div>
        </div>
      </div>
    );
}
