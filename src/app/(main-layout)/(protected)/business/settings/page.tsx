import React from 'react'
import BusinessTip from '../_components/business-tip/business-tip'
import { Typography } from '@/components/data-display'
import Image from 'next/image';
import BusinessExtension, { TBusinessExtensionData } from './_components/extenstion/business-extension';
import CreateExtensionModal from './_components/extention-modals/create-extension-modal';
import { cookies } from 'next/headers';

// server-side fetching
const getExtension = async (): Promise<TBusinessExtensionData | undefined> => {
    const cookieStore = cookies();
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/help-desk/my-business',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookieStore.get('access_token')?.value}`
                }
            })
        const data = await response.json()
        if (!response.ok) {
            throw new Error(data.message)
        }
        return data?.data;
    }
    catch (error) {
        console.error('Error in getExtension', error)
        return undefined;
    }
}
// server-side page
const SettingPage = async () => {
    const businessExtension = await getExtension();
    const isEmpty = !businessExtension;
    return (
        <div className=' max-md:w-screen px-[60px] max-md:px-3'>
            <section className=' w-full py-8 space-y-5'>
                <BusinessTip />
                <Typography variant='h1' className='text-2xl text-neutral-800 font-semibold'>Conversation Extension</Typography>
            </section>
            <section className='w-full flex flex-col'>
                {isEmpty && (<div className='w-full flex flex-col items-center gap-2'>
                    <Image src='/empty-extentions.png' width={200} height={156} alt='empty-extentions' className='mx-auto my-3' />
                    <Typography className='text-neutral-800 font-semibold text-lg leading-5'>
                        Your extension is almost here!
                    </Typography>
                    <Typography className='text-neutral-600'>
                        Create a conversation extension with the help of ready-made theme or define a unique one on your own
                    </Typography>

                </div>)}
                <BusinessExtension data={businessExtension} name='Middo Extension' />

            </section>
        </div>
    )
}

export default SettingPage