
import StartAConversation from './_components/start-conversation/start-a-conversation';
import { notFound } from 'next/navigation';
import { businessAPI } from '@/features/chat/business/business.service';
import HelpDeskConversation from './_components/help-desk-conversation/help-desk-conversation';

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
  if (!roomId) {
    return (
      <div className="w-full pb-4">
        <StartAConversation businessData={businessData} />
      </div>
    )
  }
  const room = await businessAPI.getChatRoom(roomId, anonymousUserId);
  console.log('room, anonymousId', room, roomId, anonymousUserId)
  if (!room || !room?._id || !anonymousUserId) {
    notFound();
  }
  const anonymousUser = room.participants.find((p: { _id: string }) => p._id === anonymousUserId);
  return (
    <HelpDeskConversation params={{ slugs }} anonymousUser={anonymousUser} room={room} {...props}  isAnonymousPage />
  );
};

export default HelpDeskConversationPage;
