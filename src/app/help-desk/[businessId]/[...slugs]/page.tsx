import { notFound, redirect } from 'next/navigation';
import HelpDeskConversation from './_components/help-desk-conversation/help-desk-conversation';
import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import { extensionsCustomThemeOptions } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/settings/_components/extension-creation/sections/options';
import { ROUTE_NAMES } from '@/configs/route-name';
import ExpiredRoom from './_components/expired-room/expired-room';

const HelpDeskConversationPage = async ({
  params: { businessId, slugs },
  searchParams: { themeColor },
}: {
  params: {
    businessId: string;
    slugs: string[];
  };
  searchParams: {
    themeColor: string;
  };
}) => {
  const [roomId, anonymousUserId] = slugs;

  const room = await businessAPI.getChatRoom(roomId, anonymousUserId);

  if (!room || !room?._id || !anonymousUserId) {
    return (
      <ExpiredRoom
        redirectPath={`${ROUTE_NAMES.HELPDESK_CONVERSATION}/${businessId}`}
      />
    );
  }
  const anonymousUser = room.participants.find(
    (p: { _id: string }) => p._id === anonymousUserId,
  );
  const theme =
    extensionsCustomThemeOptions.find((item) => item.name === themeColor) ||
    extensionsCustomThemeOptions[0];
  const chatFlow = room?.chatFlow;

  return (
      <HelpDeskConversation
        chatFlow={chatFlow}
        params={{ slugs }}
        anonymousUser={anonymousUser}
        room={room}
        className={theme.name}
        isAnonymousPage
      />
  );
};

export default HelpDeskConversationPage;
