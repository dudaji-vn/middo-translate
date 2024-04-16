import React from 'react'
import BusinessTip from '../_components/business-tip/business-tip'
import { Typography } from '@/components/data-display'
import Image from 'next/image';
import BusinessExtension from './_components/extenstion/business-extension';

import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import SettingHeader from './_components/setting-header/setting-header';
import CreateExtension from './_components/extension-creation/create-extension';
import { notFound } from 'next/navigation';


const SettingPage = async ({ searchParams, params }: {
    searchParams: Record<string, string>,
    params: {
        spaceId: string
    
    }

}) => {
    const space = await businessAPI.getSpaceBySpaceID(params.spaceId);
    const modatType = searchParams.modal;
    const businessExtension = space?.extension;
    if (!space) {
        notFound();
    }

    return (
        <div className='max-md:w-screen max-md:px-1 w-full bg-primary-100 h-full'>
            <SettingHeader space={space} />
            <div className='w-full bg-white'>
                <CreateExtension open={Boolean(modatType === 'create-extension' || modatType === 'edit-extension' && businessExtension)} initialData={businessExtension} />
            </div>
        </div>
    )
}

export default SettingPage