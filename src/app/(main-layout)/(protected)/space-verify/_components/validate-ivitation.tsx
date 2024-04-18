
'use client'

import { Button } from '@/components/actions';
import { validateInvitation } from '@/services/business-space.service';
import React from 'react'
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type ValidateInvitationProps = {
    token: string;
}
const ValidateInvitation = (
    { token }: ValidateInvitationProps
) => {
    const router = useRouter();
    const onValidateInvitation = async (status: 'accept' | 'decline') => {
        try {
            const res = await validateInvitation({
                token,
                status
            });
            router.push('/spaces')
        } catch (error) {
            console.error(error);
            toast.error('Error validating invitation');
        }
    }

    return (<div className="flex flex-col gap-y-2">
        <Button
            variant={'default'}
            color={'primary'}
            shape={'square'}
            className='min-w-[280px]'
            size={'sm'}
            onClick={() => onValidateInvitation('accept')}
        >
            Accept
        </Button>
        <Button
            variant={'ghost'}   
            color={'default'}
            shape={'square'}
            // size={'sm'}
            className='min-w-[280px]'
            onClick={() => onValidateInvitation('decline')}
        >
            Decline
        </Button>
    </div>)
}

export default ValidateInvitation