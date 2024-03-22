
import { notFound } from 'next/navigation';
import { businessAPI } from '@/features/chat/business/business.service';
import HelpDeskConversation from './_components/help-desk-conversation/help-desk-conversation';


const HelpDeskConversationPage = async ({ params: { slugs, }, ...props }: {
  params: {
    slugs: string[];
  };
}) => {
  const [ roomId, anonymousUserId] = slugs;

  const room = await businessAPI.getChatRoom(roomId, anonymousUserId);
  if (!room || !room?._id || !anonymousUserId) {
    notFound();
  }
  const anonymousUser = room.participants.find((p: { _id: string }) => p._id === anonymousUserId);
  return (
    <HelpDeskConversation params={{ slugs }} anonymousUser={anonymousUser} room={room} {...props} isAnonymousPage />
  );
};

export default HelpDeskConversationPage;
