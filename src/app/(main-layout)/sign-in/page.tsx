"use client";
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { AlertCircleOutline, CheckmarkCircle2, EyeOff2Outline, EyeOutline } from "@easy-eva-icons/react";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import { Button } from "@/components/actions/button";
import { InputField } from '@/components/form/InputField';
import { FC, useEffect } from 'react';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useAuthStore } from '@/stores/auth';

interface SignInProps {
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
        })
    })
    .required()

export default function SignIn(props: SignInProps) {

    const {
        register,
        watch,
        trigger,
        formState: { errors, dirtyFields },
    } = useForm({
        mode: "onBlur",
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: yupResolver(schema),
    });

    const { isAuthentication, loading, login: submitLogin } = useAuthStore();

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();
        trigger();
        if (Object.keys(errors).length > 0) return;
        submitLogin(watch());
    }

    useEffect(() => {
        if (isAuthentication) {
            console.log('auth')
        }else {
            console.log('not auth')
        }
    }, [isAuthentication])

    return (
        <div>
            <div className="flex h-screen flex-col items-center bg-background bg-cover bg-center bg-no-repeat md:!bg-[url('/bg_auth.png')]">
                <div className="bg-background px-5 py-10 md:mt-10 md:w-[500px] md:rounded-3xl md:px-6 md:shadow-2 w-full">
                    <h4 className="text-primary font-bold text-center text-[26px]">Sign in</h4>
                    <form className="flex w-full flex-col items-center" onSubmit={handleSubmitForm}>
                        <InputField
                            className="mt-8"
                            placeholder="Enter your email"
                            register={{ ...register('email') }}
                            errors={errors.email}
                            type="text"
                        />
                        <InputField
                            className="mt-4"
                            placeholder="Enter your password"
                            register={{ ...register('password') }}
                            errors={errors.password}
                            type="password"
                        />
                        <Link className='inline-block ml-auto italic color-[#333] mt-3 hover:underline' href={ROUTE_NAMES.FORGOT_PASSWORD}>Forgot password?</Link>
                        <button
                            type="submit"
                            className="mt-10 flex w-full items-center justify-center rounded-full border border-transparent bg-primary px-8 py-4 font-semibold text-background active:!border-transparent active:!bg-shading active:!text-background md:max-w-[320px] md:hover:border md:hover:border-primary md:hover:bg-background md:hover:text-primary"
                        >
                            Sign in
                        </button>
                    </form>
                    <div className='my-10 mx-auto w-[120px] h-[1px] bg-[#ccc]'></div>
                    <p className='text-center text-[#333] mb-5'>Not have account yet?</p>
                    <div className='flex justify-center mb-10'>
                        <Link className="text-primary font-medium relative after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[1px] after:bg-primary after:opacity-0 hover:after:opacity-1" href={ROUTE_NAMES.SIGN_UP}>Sign up here</Link>
                    </div>
                    <div className='flex items-center justify-center gap-5'>
                        <p>Or log in with</p>
                        <a href=""><img src="/google.png" alt="Google" /></a>
                    </div>
                </div>
            </div>
        </div>
    );
}
