import { extentionsCustomThemeOptions } from '@/app/(main-layout)/(protected)/business/settings/_components/extension-creation/sections/options';
import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import { cn } from '@/utils/cn';
import { notFound } from 'next/navigation';
import React, { ReactNode } from 'react'

const HelpDeskConversationLayout = async ({ children, params: { businessId } }: {
    children: ReactNode, params: {
        businessId: string;
        slugs: string[];
    }
}) => {

    const businessData = await businessAPI.getBusinessInfomation(businessId);
    if (!businessData) {
        notFound();
    }
    const theme = extentionsCustomThemeOptions.find((item) => item.name === businessData.color || item.hex === businessData.color) || extentionsCustomThemeOptions[0];

    return (
        <div className={cn(theme.name, 'h-main-container-height')}>
            {children}
        </div>
    )
}
export default HelpDeskConversationLayout
