import { notFound } from 'next/navigation';
import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import { headers } from 'next/headers';
import { getAllowedDomain } from '@/utils/allowed-domains';
import StartAConversation from './[...slugs]/_components/start-conversation/start-a-conversation';
import TrackGuest from './rate/[roomId]/[userId]/_components/track-guest';

const HelpDeskStartConversationPage = async ({
  params: { slugs, businessId },
  searchParams: { originReferer, domain },
  ...props
}: {
  params: {
    businessId: string;
    slugs: string[];
  };
  searchParams: {
    originReferer: string;
    domain: string;
  };
}) => {
  const extensionData = await businessAPI.getExtensionByBusinessId(businessId);
  if (!extensionData) {
    return (
      <section className="flex h-screen items-center justify-center">
        <h1>Extension not found</h1>
        <p>
          Please check if your extension script is correct, or your domain is
          allowed for this extension.
        </p>
      </section>
    );
  }
  const headersList = headers();
  const referer = domain || originReferer || headersList.get('referer');
  const allowedDomain = getAllowedDomain({
    refer: referer,
    allowedDomains: extensionData.domains,
  });
  const isRedirectedFromRatePage =
    referer?.startsWith(
      `${process.env.NEXT_PUBLIC_URL}/help-desk/${businessId}/rate`,
    ) && originReferer;

  const host = headersList.get('host');

  return (
    <TrackGuest
      extensionId={businessId}
      domain={String(isRedirectedFromRatePage ? originReferer : allowedDomain)}
      invalidDomain={
        (!allowedDomain && !isRedirectedFromRatePage) ||
        host === process.env.NEXT_PUBLIC_URL
      }
    >
      <StartAConversation
        visitorData={headersList}
        extensionData={extensionData}
        fromDomain={isRedirectedFromRatePage ? originReferer : allowedDomain}
      />
    </TrackGuest>
  );
};

export default HelpDeskStartConversationPage;
