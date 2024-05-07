import { notFound, redirect } from 'next/navigation';
import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import { cookies, headers } from 'next/headers';
import { getAllowedDomain } from '@/utils/allowed-domains';
import StartAConversation from './[...slugs]/_components/start-conversation/start-a-conversation';
import { CK_VISITOR_ID, CK_VISITOR_ROOM_ID } from '@/types/business.type';

const HelpDeskStartConversationPage = async ({
  params: { slugs, businessId },
  ...props
}: {
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
  const allowedDomain = getAllowedDomain({
    refer: referer,
    allowedDomains: extensionData.domains,
  });

  const cookieStore = cookies();
  const visitorId = cookieStore.get(CK_VISITOR_ID)?.value;
  const visitorRoomId = cookieStore.get(CK_VISITOR_ROOM_ID)?.value;

  if (visitorId && visitorRoomId) {
    redirect(
      `/help-desk/${businessId}/${visitorRoomId}/${visitorId}?themeColor=${extensionData.color}`,
    );
  }
  if (!allowedDomain) {
    notFound();
  }
  return (
    <StartAConversation
      extensionData={extensionData}
      fromDomain={allowedDomain}
    />
  );
};

export default HelpDeskStartConversationPage;
