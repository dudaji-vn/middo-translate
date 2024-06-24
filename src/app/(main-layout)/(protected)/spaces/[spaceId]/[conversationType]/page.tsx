import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import CreateExtensionShortcut from './_components/create-extension-shortcut';

import LetsPickAConversation from './_components/lets-pick-a-conversation';

export default async function BusinessConversationPage({
  params: { spaceId },
}: {
  params: { spaceId: string };
}) {
  const space = await businessAPI.getSpaceBySpaceID(spaceId);

  if (space?.extension) return <CreateExtensionShortcut />;

  return <LetsPickAConversation />;
}
