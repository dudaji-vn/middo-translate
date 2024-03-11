import React from 'react'
import BusinessTip from '../_components/business-tip/business-tip'
import { Typography } from '@/components/data-display'
import Image from 'next/image';
import BusinessExtension, { TBusinessExtensionData } from './_components/Extenstion/business-extension';
import { Button } from '@/components/actions';
import { Plus } from 'lucide-react';

const mockData: TBusinessExtensionData[] = [
    {
        id: '0',
        name: 'Middo Conversation Extension',
        createdAt: '23 Mar 2024',
        deletedAt: '23 Mar 2024',
        code: `<!- Past this code into your website ->
            <script>
            (function() {
                var middo = document.createElement('script');
                middo.type = 'text/javascript';
                })();
       </script>
      `
    },
];


const SettingPage = () => {
    const isEmpty = mockData.length === 0;
    return (
        <div className=' max-md:w-screen px-[60px] max-md:px-3'>
            <section className=' w-full py-8 space-y-5'>
                <BusinessTip />
                <Typography variant='h1' className='text-2xl text-neutral-800 font-semibold'>Conversation Extension</Typography>
            </section>
            <section className='w-full flex flex-col'>
                {mockData?.map((data, index) => {
                    return (
                        <BusinessExtension key={index} {...data} />
                    )
                })}
                {isEmpty && (<div className='w-full flex flex-col items-center gap-2'>
                    <Image src='/empty-extentions.png' width={200} height={156} alt='empty-extentions' className='mx-auto my-3' />
                    <Typography className='text-neutral-800 font-semibold text-lg leading-5'>
                        Your extension is almost here!
                    </Typography>
                    <Typography className='text-neutral-600'>
                        Create a conversation extension with the help of ready-made theme or define a unique one on your own
                    </Typography>
                    <Button shape='square' className='mt-5 py-4'>
                        <Plus className='w-4 h-4' />
                        Create Extension
                    </Button>
                </div>)}
            </section>
        </div>
    )
}

export default SettingPage