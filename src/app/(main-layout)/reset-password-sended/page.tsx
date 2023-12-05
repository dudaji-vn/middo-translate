"use client";

import { useEffect, useState } from 'react';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useRouter } from 'next/navigation';

export default function ResetPasswordSended() {
    const router = useRouter();
    const [email, setEmail] = useState("");

    useEffect(() => {
        let emailLocalstorage = localStorage.getItem("email_reset_password") || '';
        console.log(emailLocalstorage);
        if (!emailLocalstorage) {
            router.push(ROUTE_NAMES.SIGN_IN);
        }
        setEmail(emailLocalstorage);
        localStorage.removeItem("email_reset_password");
    }, []);


    return (
        <div>
            <div className='px-5 w-full md:max-w-[500px] mx-auto py-8'>
                <div className='mx-auto'>
                    <img className='mx-auto' src="/sended_email.svg" alt="Reset password" />
                </div>
                <p className='text-primary text-center mt-8 text-[22px] font-medium'>Reset password</p>
                <p className='text-center mt-5'>An reset password link has been sent to <strong>{email}</strong></p>

                <button
                    onClick={() => router.push(ROUTE_NAMES.SIGN_IN)}
                    className={`mx-auto mt-10 flex w-full items-center justify-center rounded-full border border-transparent bg-primary px-8 py-4 font-semibold text-background active:!border-transparent active:!bg-shading active:!text-background md:max-w-[320px] md:hover:border md:hover:border-primary md:hover:bg-background md:hover:text-primary`}
                >
                    Go to sign in
                </button>
            </div>
        </div>
    );
}
