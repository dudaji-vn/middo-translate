
import { notFound, redirect } from 'next/navigation';
import { businessAPI } from '@/features/chat/business/business.service';
import { headers } from 'next/headers';
import { isAllowedDomain } from '@/utils/allowed-domains';
import StartAConversation from './[...slugs]/_components/start-conversation/start-a-conversation';

const HelpDeskConversationPage = async ({ params: { slugs, businessId }, ...props }: {
    params: {
        businessId: string;
        slugs: string[];
    };
}) => {
    const businessData = await businessAPI.getBusinessInfomation(businessId);
    console.log('businessId', businessId)
    if (!businessData) {
        notFound();
    }
    const headersList = headers();
    const referer = headersList.get('referer');
    const isAllowed = isAllowedDomain({ refer: referer, allowedDomains: businessData.domains });

    // if (!isAllowed) {
    //   notFound();
    // }
    return (
        <div className="w-full pb-4">
            <StartAConversation businessData={businessData} />
        </div>
    )

};

export default HelpDeskConversationPage;
