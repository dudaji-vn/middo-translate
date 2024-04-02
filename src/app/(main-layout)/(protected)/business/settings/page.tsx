import React from 'react'
import BusinessTip from '../_components/business-tip/business-tip'
import { Typography } from '@/components/data-display'
import Image from 'next/image';
import BusinessExtension from './_components/extenstion/business-extension';

import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import SettingHeader from './_components/setting-header/setting-header';
import CreateExtension from './_components/extension-creation/create-extension';


const SettingPage = async ({ searchParams }: {
    searchParams: Record<string, string>
}) => {
    const businessExtension = await businessAPI.getExtension();
    const modatType = searchParams.modal;
    console.log('BusinessExtension', BusinessExtension)
    return (
        <div className='max-md:w-screen max-md:px-1 w-full bg-primary-100 h-full'>
            <SettingHeader data={businessExtension} />
            <div className='w-full bg-white'>
                {!modatType && <BusinessExtension data={businessExtension} name='Middo Extension' />}
                <CreateExtension open={Boolean(modatType === 'create-extension' || modatType === 'edit-extension' && businessExtension)} initialData={businessExtension} />
            </div>
        </div>
    )
}

export default SettingPage