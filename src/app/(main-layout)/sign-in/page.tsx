"use client";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { yupResolver } from "@hookform/resolvers/yup"
import { useAuthStore } from '@/stores/auth';

import { InputField } from '@/components/form/InputField';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useRouter } from 'next/navigation';
import { loginService } from '@/services/authService';
import { LoginSchema as schema } from '@/configs/yup-form';
import { Button } from '@/components/form/Button';
import Image from 'next/image';
import { toast } from '@/components/toast';
import { PageLoading } from '@/components/loading/PageLoading';

export default function SignIn() {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const { register, watch, reset, trigger, formState: { errors, isValid } } = useForm({
        mode: "onBlur",
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: yupResolver(schema),
    });

    const { isAuthentication, setData: setDataAuth, user: userData } = useAuthStore();

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        trigger();
        
        if (!isValid) return;
        try {
            setLoading(true);
            const data = await loginService(watch());
            const { user } = data?.data;
            setDataAuth({ user , isAuthentication: true });
            toast({ title: "Congratulations!", description: "You are login in!" });
            setErrorMessage("");
        } catch (_: unknown) {
            setErrorMessage("Username or password is incorrect");
        } 
        finally {
            setLoading(false);
            // reset();
        }
    }

    useEffect(() => {
        if (isAuthentication) {
            if(!userData.avatar && !userData.name && !userData.language) {
                router.push(ROUTE_NAMES.CREATE_ACCOUNT)
            }else {
                router.push(ROUTE_NAMES.ROOT)
            }
        }
        
    }, [isAuthentication, router, userData])

    if(isAuthentication && userData) return null;

    return (
        <div>
            { loading && <PageLoading /> }
            <div className="flex h-screen flex-col items-center bg-background bg-cover bg-center bg-no-repeat md:!bg-[url('/bg_auth.png')]">
                <div className="bg-background px-[5vw] py-8 md:mt-10 md:w-[500px] md:rounded-3xl md:px-6 md:shadow-2 w-full">
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
                        {errorMessage && 
                        <p className="mt-2 flex items-center gap-2 text-error-2 text-sm">{errorMessage}</p>
                        }
                        <Button type="submit">Sign in</Button>
                    </form>
                    <div className='my-10 mx-auto w-[120px] h-[1px] bg-[#ccc]'></div>
                    <p className='text-center text-[#333] mb-5'>Not have account yet?</p>
                    <div className='flex justify-center mb-10'>
                        <Link className="text-primary font-medium relative after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[1px] after:bg-primary after:opacity-0 hover:after:opacity-1" href={ROUTE_NAMES.SIGN_UP}>Sign up here</Link>
                    </div>
                    <div className='flex items-center justify-center gap-5'>
                        <p>Or log in with</p>
                        <a href="">
                            <Image src="/google.png" alt="Google" width={56} height={56} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
