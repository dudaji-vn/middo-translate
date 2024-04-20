import { Button } from '@/components/actions';
import { Avatar, Typography } from '@/components/data-display';
import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import moment from 'moment';
import { notFound, redirect } from 'next/navigation';
import React from 'react'
import ValidateInvitation from './_components/validate-ivitation';
import { Clock } from 'lucide-react';
import InvalidVerifyToken from './_components/invalid-verify-token';
import ExpiredVerifyToken from './_components/expired-verify-token';




const SpaceVerify = async ({
    searchParams: {
        token
    }
}: {
    searchParams: {
        token: string
    }
}) => {
    const invitations = await businessAPI.getMyInvitations()
    const thisInvitation = invitations.find(invitation => {
        return invitation.verifyToken === token
    });
    if (!token) {
        notFound();
    }

    if (!thisInvitation) {
        return <InvalidVerifyToken token={token} />
    }
    if (thisInvitation.isExpired) {
        return <ExpiredVerifyToken token={token} />
    }

    const { space, email, invitedAt } = thisInvitation;


    return (
        <main className='flex justify-center items-center  h-[calc(100vh-52px)]' >
            <div className='flex flex-col items-center gap-8 leading-8'>
                <Typography className='text-primary-500-main text-center space-y-3 text-[2rem] font-semibold' >
                    {email}<span className='text-neutral-800 leading-[48px]'>, </span>
                    <br />
                    <span className='text-neutral-800 text-[2rem] font-semibold leading-[48px]' >
                        You&apos;ve been invited to join
                    </span>
                </Typography>
                <div className='w-fit h-auto min-w-[320px] space-y-3'
                >
                    <div className='flex w-full min-w-[320px] p-3 bg-primary-100 rounded-[12px] flex-row gap-4 items-center justify-center'>
                        <Avatar src={space?.avatar || '/avatar.svg'} alt='avt' className='w-24 h-24 bg-white' />
                        <Typography className='text-neutral-800  text-[18px] font-semibold'>
                            {space?.name}
                        </Typography>
                    </div>
                    <div className='flex flex-row justify-center divide-x gap-x-3 divide-[#D9D9D9]'>
                        <Typography className='text-neutral-500 text-sm  font-light'>
                            By&nbsp;
                            <span className='px-1 text-base font-normal leading-[18px]'>{space?.owner?.email}</span>
                        </Typography>
                        <Typography className='text-neutral-500 text-sm  pl-3 p font-light flex items-center'>
                            At&nbsp;
                            <Clock className='inline-block size-4 ml-1' />
                            <span className='text-base font-normal leading-[18px] '>{moment(invitedAt).format('DD/MM/YYYY HH:mm')}</span>
                        </Typography>
                    </div>
                </div>
                <Typography className='text-neutral-600 text-base font-normal'>
                    Accept this invitation to join to&nbsp;
                    <span>{space?.name}</span>
                    . Or you could decline it.
                </Typography>
                <ValidateInvitation token={token} />
            </div>
        </main>
    )
}

export default SpaceVerify