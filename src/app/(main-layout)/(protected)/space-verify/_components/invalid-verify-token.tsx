"use client"

import { Button } from '@/components/actions'
import { Typography } from '@/components/data-display'
import { ROUTE_NAMES } from '@/configs/route-name'
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/configs/store-key'
import { setCookieService, signOutService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { ArrowLeftRight } from 'lucide-react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

const InvalidVerifyToken = ({ token }: {
    token: string

}) => {
    const { user: currentUser, setData } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const onSwitchAccount = async () => {
        setCookieService([
            {
                key: 'redirect-path',
                value: pathname + `?token=${token}`,
                time: 15,
            }
        ]).finally(async () => {
            // router.push(ROUTE_NAMES.SIGN_IN);
            await signOutService();
            setData({ user: null, isAuthentication: false });
        });
    }
    return (
        <main className='flex justify-center items-center  h-[calc(100vh-52px)]' >
            <div className='flex flex-col items-center gap-8'>
                <Image src='/invalid_invitation.svg' width={320} height={320} alt='invalid-verify-token' />
                <div className='text-neutral-800  text-center flex flex-col gap-3' >
                    <span className='text-neutral-800 text-[2rem] font-semibold leading-[48px]' >
                        You do not have permission to view this invitaion
                    </span>
                    <span className='text-neutral-800  font-light leading-[22px]' >
                        You&apos;re sign in as &nbsp;
                        <span className='text-primary-500-main font-medium'>{currentUser?.email}
                        </span>
                    </span>
                </div>
                <Button shape={'square'}
                    onClick={onSwitchAccount}
                    startIcon={<ArrowLeftRight />}
                    className='px-6'>
                    Switch account
                </Button>
            </div>
        </main>
    )
}

export default InvalidVerifyToken