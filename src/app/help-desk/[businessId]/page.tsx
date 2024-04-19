
import { notFound } from 'next/navigation';
import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import { headers } from 'next/headers';
import { isAllowedDomain } from '@/utils/allowed-domains';
import StartAConversation from './[...slugs]/_components/start-conversation/start-a-conversation';
import { cn } from '@/utils/cn';

const HelpDeskStartConversationPage = async ({ params: { slugs, businessId }, ...props }: {
    params: {
        businessId: string;
        slugs: string[];
    };
}) => {
    const extensionData = await businessAPI.getExtensionByBusinessId(businessId);
    if (!extensionData) {
        notFound();
    }
    const headersList = headers();
    const referer = headersList.get('referer');
    const isAllowed = isAllowedDomain({ refer: referer, allowedDomains: extensionData.domains });

    if (!isAllowed) {
        //   notFound();
    }
    return (<StartAConversation extensionData={extensionData} />)

};

export default HelpDeskStartConversationPage;
