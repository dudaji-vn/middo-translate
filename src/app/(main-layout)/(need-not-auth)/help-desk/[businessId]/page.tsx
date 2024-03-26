
import { notFound } from 'next/navigation';
import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import { headers } from 'next/headers';
import { isAllowedDomain } from '@/utils/allowed-domains';
import StartAConversation from './[...slugs]/_components/start-conversation/start-a-conversation';
import { cn } from '@/utils/cn';
import { DEFAULT_THEME, extentionsCustomThemeOptions } from '@/app/(main-layout)/(protected)/business/settings/_components/extention-modals/sections/options';

const HelpDeskStartConversationPage = async ({ params: { slugs, businessId }, ...props }: {
    params: {
        businessId: string;
        slugs: string[];
    };
}) => {
    const businessData = await businessAPI.getBusinessInfomation(businessId);
    if (!businessData) {
        notFound();
    }
    const headersList = headers();
    const referer = headersList.get('referer');
    const isAllowed = isAllowedDomain({ refer: referer, allowedDomains: businessData.domains });

    if (!isAllowed) {
        //   notFound();
    }
    const theme = extentionsCustomThemeOptions.find((item) => item.name === businessData.color || item.hex === businessData.color) || extentionsCustomThemeOptions[0];
    console.log('businessData==>', businessData)
    return (
        <div className={cn("w-full pb-4 ", theme.name)}>
            <StartAConversation businessData={businessData} />
        </div>
    )

};

export default HelpDeskStartConversationPage;
