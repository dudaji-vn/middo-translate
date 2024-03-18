
import StartAConversation from './_components/start-conversation/start-a-conversation';
import { notFound } from 'next/navigation';
import { businessAPI } from '@/features/chat/business/business.service';
import HelpDeskConversation from './_components/help-desk-conversation/help-desk-conversation';
import { headers } from 'next/headers';
import { isAllowedDomain } from '@/utils/allowed-domains';

const HelpDeskConversationPage = async ({ params: { slugs }, ...props }: {
  params: {
    slugs: string[];
  };
}) => {
  const [businessId, roomId, anonymousUserId] = slugs;
  const businessData = await businessAPI.getBusinessInfomation(businessId);
  if (!businessData) {
    return <div>Not Found</div>;
  }
  const headersList = headers();
  const referer = headersList.get('referer');
  const isAllowed = isAllowedDomain({ refer: referer, allowedDomains: businessData.domains });
  console.log('allowedDomains',businessData.domains)

  if (!isAllowed) {
    notFound();
  }

  if (!roomId) {
    return (
      <div className="w-full pb-4">
        <StartAConversation businessData={businessData} />
      </div>
    )
  }
  const room = await businessAPI.getChatRoom(roomId, anonymousUserId);
  if (!room || !room?._id || !anonymousUserId) {
    notFound();
  }
  const anonymousUser = room.participants.find((p: { _id: string }) => p._id === anonymousUserId);
  return (
    <HelpDeskConversation params={{ slugs }} anonymousUser={anonymousUser} room={room} {...props}  isAnonymousPage />
  );
};

export default HelpDeskConversationPage;
