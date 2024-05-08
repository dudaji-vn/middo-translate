import { notFound, redirect } from 'next/navigation';
import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import { headers } from 'next/headers';
import { getAllowedDomain } from '@/utils/allowed-domains';
import StartAConversation from './[...slugs]/_components/start-conversation/start-a-conversation';

const HelpDeskStartConversationPage = async ({
  params: { slugs, businessId },
  searchParams: { originReferrer },
  ...props
}: {
  params: {
    businessId: string;
    slugs: string[];
  };
  searchParams: {
    originReferrer: string;
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
    ) && originReferrer;

  if (!allowedDomain && !isRedirectedFromRatePage) {
    notFound();
  }
  return (
    <StartAConversation
      visitorData={JSON.stringify(headersList)}
      extensionData={extensionData}
      fromDomain={allowedDomain || originReferrer}
    />
  );
};

export default HelpDeskStartConversationPage;
