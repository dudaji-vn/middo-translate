
import { notFound } from 'next/navigation';
import HelpDeskConversation from './_components/help-desk-conversation/help-desk-conversation';
import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import { DEFAULT_THEME, extentionsCustomThemeOptions } from '@/app/(main-layout)/(protected)/business/settings/_components/extention-modals/sections/options';


const HelpDeskConversationPage = async ({ params: { slugs, }, searchParams: { themeColor } }: {
  params: {
    slugs: string[];
  };
  searchParams: {
    themeColor: string;
  }
}) => {
  const [roomId, anonymousUserId] = slugs;

  const room = await businessAPI.getChatRoom(roomId, anonymousUserId);
  if (!room || !room?._id || !anonymousUserId) {
    notFound();
  }
  const anonymousUser = room.participants.find((p: { _id: string }) => p._id === anonymousUserId);
  const theme = extentionsCustomThemeOptions.find((item) => item.name === themeColor) || extentionsCustomThemeOptions[0]
  return (
    <HelpDeskConversation params={{ slugs }} anonymousUser={anonymousUser} room={room} className={theme.name} isAnonymousPage />
  );
};

export default HelpDeskConversationPage;
