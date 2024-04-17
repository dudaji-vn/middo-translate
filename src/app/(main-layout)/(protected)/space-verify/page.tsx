import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import React from 'react'




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

    console.log('invitations', invitations)
    return (
        <main className='flex justify-center items-center h-screen'>
            <div className='flex flex-col items-center gap-8'>
                { }
            </div>
        </main>
    )
}

export default SpaceVerify