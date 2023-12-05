"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ROUTE_NAMES } from '@/configs/route-name';
import { verifyEmailService } from '@/services/authService';
import { Button } from '@/components/form/Button';

export default function Verify() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const [statusVerify, setStatusVerify] = useState(''); // success, expired

    useEffect(() => {
        const token = searchParams?.get('token');
        if(!token) {
            router.push(ROUTE_NAMES.SIGN_IN);
        }
        localStorage.setItem('access_token', token || '')
        const verifyEmailWithToken = async () => {
            try {
                await verifyEmailService();
                setStatusVerify('success')
            } catch (error) {
                setStatusVerify('expired')
            } finally {
                localStorage.removeItem('access_token')
            }
        }
        verifyEmailWithToken();
    }, []);

    if(statusVerify == 'success') {
        return (  
            <div>
                <div className='px-5 w-full md:max-w-[500px] mx-auto py-8'>
                    <div className='mx-auto'>
                        <img className='mx-auto' src="/email_verified.svg" alt="Email verified!" />
                    </div>
                    <p className='text-primary text-center mt-8 text-[22px] font-medium'>Email verified!</p>
                    <p className='text-center mt-5'>Your email has been verified. Now you can sign in with registered email to use all Middo’s features</p>
                    <Button tag='a' href={ROUTE_NAMES.SIGN_IN}>Go to sign in</Button>
                </div>
            </div>
            );
    }

    if(statusVerify == 'expired') {
        return (  
            <div>
                <div className='px-5 w-full md:max-w-[500px] mx-auto py-8'>
                    <div className='mx-auto'>
                        <img className='mx-auto' src="/link_expired.svg" alt="Link expired!" />
                    </div>
                    <p className='text-primary text-center mt-8 text-[22px] font-medium'>Link expired!</p>
                    <p className='text-center mt-5'>Your email verification link has expired. Please sign up again to get a new verification link.</p>
                    <Button tag='a' href={ROUTE_NAMES.SIGN_UP}>Go to sign up</Button>
                </div>
            </div>
            );
    }

    return null
}
