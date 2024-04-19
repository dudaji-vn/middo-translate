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

const ExpiredVerifyToken = ({ token }: {
    token: string

}) => {
    const { user: currentUser, setData } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    return (
        <main className='flex justify-center items-center  h-[calc(100vh-52px)]' >
            <div className='flex flex-col items-center gap-8'>
                <Image src='/expired_invitation.svg' width={320} height={320} alt='Expired-verify-token' />
                <div className='text-neutral-800  text-center flex flex-col gap-3' >
                    <span className='text-neutral-800 text-[2rem] font-semibold leading-[48px]' >
                        The invitation has expired
                    </span>
                    <span className='text-neutral-800  font-light leading-[22px]' >
                        Ask the space owner to resend the invitation
                    </span>
                </div>
            </div>
        </main>
    )
}

export default ExpiredVerifyToken