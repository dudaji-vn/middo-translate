import { Button } from '@/components/actions';
import { Avatar, Typography } from '@/components/data-display';
import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import moment from 'moment';
import { notFound, redirect } from 'next/navigation';
import React from 'react'
import ValidateInvitation from './_components/validate-ivitation';




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
    const thisInvitation = invitations.find(invitation => invitation.verifyToken === token);


    if (!thisInvitation) {
        notFound();
    }

    const { space, email, invitedAt } = thisInvitation;


    return (
        <main className='flex justify-center items-center h-screen'>
            <div className='flex flex-col items-center gap-8 leading-8'>
                <Typography className='text-primary-500-main text-[2rem]  font-semibold' >
                    {email}
                </Typography>
                <Typography className='text-neutral-600 text-[2rem] font-semibold' >
                    You&apos;ve been invited to join
                </Typography>
                <div className='flex w-full p-3 bg-primary-100 rounded-[12px] flex-row gap-4 items-center justify-start'>
                    <Avatar src={space?.avatar || '/avatar.png'} alt='avt' className='w-24 h-24' />
                    <Typography className='text-neutral-800  font-light text-base'>
                        {space?.name}
                    </Typography>
                </div>
                <div className='flex flex-row justify-center gap-3'>
                    <Typography className='text-neutral-600 text-base font-normal'>
                        {`By ${space?.owner?.email}`}
                    </Typography>
                    <Typography className='text-neutral-600 text-base font-normal'>
                        {`At ${moment(invitedAt).format('DD/MM/YYYY HH:mm')}`}
                    </Typography>
                </div>
                <Typography className='text-neutral-600 text-base font-normal'>
                    Accept this invitation to join to Dudaji Vietnam. Or you could decline it.
                </Typography>
                <ValidateInvitation invitation={thisInvitation} token={token} />
            </div>
        </main>
    )
}

export default SpaceVerify