"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ROUTE_NAMES } from '@/configs/route-name';
import Image from 'next/image';
import { Button } from '@/components/form/Button';

export default function ResetPasswordSended() {
    const router = useRouter();
    const [email, setEmail] = useState("");

    useEffect(() => {
        let emailLocalstorage = localStorage.getItem("email_reset_password") || '';
        if (!emailLocalstorage) {
            router.push(ROUTE_NAMES.SIGN_IN);
        }
        setEmail(emailLocalstorage);
        localStorage.removeItem("email_reset_password");
    }, [router]);


    return (
        <div>
            <div className='px-5 w-full md:max-w-[500px] mx-auto py-8'>
                <div className='mx-auto w-[223px]'>
                    <Image
                        src="/sended_email.svg"
                        alt="Reset password"
                        width={500}
                        height={500}
                    ></Image>
                </div>
                <p className='text-primary text-center mt-8 text-[22px] font-medium'>Reset password</p>
                <p className='text-center mt-5'>An reset password link has been sent to <strong>{email}</strong></p>
                <Button tag='a' href={ROUTE_NAMES.SIGN_IN}>Go to sign in</Button>
            </div>
        </div>
    );
}
