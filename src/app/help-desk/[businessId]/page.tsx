import { notFound, redirect } from 'next/navigation';
import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import { headers } from 'next/headers';
import { getAllowedDomain } from '@/utils/allowed-domains';
import StartAConversation from './[...slugs]/_components/start-conversation/start-a-conversation';

const HelpDeskStartConversationPage = async ({
  params: { slugs, businessId },
  searchParams: { originReferer },
  ...props
}: {
  params: {
    businessId: string;
    slugs: string[];
  };
  searchParams: {
    originReferer: string;
  };
}) => {
  const extensionData = await businessAPI.getExtensionByBusinessId(businessId);
  if (!extensionData) {
    notFound();
  }

  const headersList = headers();
  const referer = headersList.get('referer');
  const allowedDomain = getAllowedDomain({
    refer: referer,
    allowedDomains: extensionData.domains,
  });
  const isRedirectedFromRatePage =
    referer?.startsWith(
      `${process.env.NEXT_PUBLIC_URL}/help-desk/${businessId}/rate`,
    ) && originReferer;

  if (!allowedDomain && !isRedirectedFromRatePage) {
    notFound();
  }
  return (
    <StartAConversation
      visitorData={headersList}
      extensionData={extensionData}
      fromDomain={isRedirectedFromRatePage ? originReferer : allowedDomain}
    />
  );
};

export default HelpDeskStartConversationPage;
