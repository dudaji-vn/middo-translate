"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';

import { resetPasswordService } from '@/services/authService';
import { InputField } from '@/components/form/InputField';
import { PageLoading } from '@/components/loading/PageLoading';
import { ResetPasswordSchema as schema } from '@/configs/yup-form';
import { Button } from '@/components/form/Button';
import { ROUTE_NAMES } from '@/configs/route-name';
import { ACCESS_TOKEN_NAME } from '@/configs/store-key';

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
        localStorage.setItem(ACCESS_TOKEN_NAME, token || '')
        return () => {
            localStorage.removeItem(ACCESS_TOKEN_NAME)
        }
    }, [router, searchParams]);


    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        trigger();
        if (!isValid) return;
        setLoading(true);
        try {
            await resetPasswordService(watch().password);
            localStorage.removeItem(ACCESS_TOKEN_NAME)
            router.push(ROUTE_NAMES.SIGN_IN);
        } catch (_: unknown) {} finally {
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
                    <Button type="submit">Confirm</Button>
                </form>
            </div>
        </div>
    );
}
