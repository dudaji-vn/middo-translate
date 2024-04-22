import React from 'react'
import BusinessTip from '../_components/business-tip/business-tip'
import { Typography } from '@/components/data-display'
import Image from 'next/image';
import BusinessExtension from './_components/extenstion/business-extension';

import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import SpaceSetting from './_components/space-setting/space-setting';
import CreateExtension from './_components/extension-creation/create-extension';
import { notFound } from 'next/navigation';


const SpaceSettingPage = async ({ searchParams, params }: {
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
        <div className='max-md:w-screen max-md:px-1 w-full bg-white h-full max-h-full overflow-y-auto'>
            <SpaceSetting space={space} />
            <div className='w-full bg-white'>
                <CreateExtension space={space} open={Boolean(modatType === 'create-extension' || modatType === 'edit-extension' && businessExtension)} initialData={businessExtension} />
            </div>
        </div>
    )
}

export default SpaceSettingPage