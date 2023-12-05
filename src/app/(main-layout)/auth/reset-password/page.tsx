"use client";

import Link from 'next/link';
import * as yup from "yup"
import { use, useEffect, useState } from 'react';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useRouter } from 'next/navigation';
import { forgotPasswordService, resetPasswordService } from '@/services/authService';
import { toast } from '@/components/toast';
import { InputField } from '@/components/form/InputField';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { PageLoading } from '@/components/loading/PageLoading';
import { useSearchParams } from 'next/navigation';


const schema = yup
    .object()
    .shape({
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

export default function ResetPassword() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams()

    const { register, watch, trigger, formState: { errors, isValid } } = useForm({
        mode: "onSubmit",
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        const token = searchParams?.get('token');
        if(!token) {
            router.push(ROUTE_NAMES.SIGN_IN);
        }
        localStorage.setItem('access_token', token || '')
    }, []);


    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        trigger();
        if (!isValid) return;
        setLoading(true);
        try {
            let res = await resetPasswordService(watch().password);
            console.log(res);
            toast({ title: 'Success', description: res?.data?.message })
            localStorage.removeItem('access_token')
            router.push(ROUTE_NAMES.SIGN_IN);
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
                <h2 className="text-primary relative pl-4 mb-5 leading-tight before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:w-1 before:rounded-md before:bg-primary">Change password</h2>
                <form onSubmit={handleSubmitForm}>
                    <InputField
                        className="mt-5"
                        label='Password'
                        placeholder="Enter password"
                        register={{ ...register('password') }}
                        errors={errors.password}
                        type="password"
                    />
                    <InputField
                        className="mt-5"
                        label='Confirm Password'
                        placeholder="Confirm password"
                        register={{ ...register('confirmPassword') }}
                        errors={errors.confirmPassword}
                        type="password"
                    />
                    <button
                        type="submit"
                        className="mt-10 mx-auto flex w-full items-center justify-center rounded-full border border-transparent bg-primary px-8 py-4 font-semibold text-background active:!border-transparent active:!bg-shading active:!text-background md:max-w-[320px] md:hover:border md:hover:border-primary md:hover:bg-background md:hover:text-primary"
                    >Confirm</button>
                </form>
            </div>
        </div>
    );
}
