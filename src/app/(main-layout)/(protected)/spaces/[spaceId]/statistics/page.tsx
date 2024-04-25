import { Typography } from '@/components/data-display';
import { ChatSidebar } from '@/features/chat/components/chat-sidebar';
import ChatSidebarHeader from '@/features/chat/components/chat-sidebar/chat-sidebar-header';
import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import { notFound } from 'next/navigation'
export enum EStatisticErrors {
  NO_ANALYSTIC_DATA = "NO_ANALYSTIC_DATA",
  NEXT_NOT_FOUND = "NEXT_NOT_FOUND"
}

const StatisticPage = async ({
  params: {
    spaceId
  }
}: {
  params: {
    spaceId: string;
  }
}) => {
  const spaceData = await businessAPI.getSpaceBySpaceID(spaceId);
  if (!spaceData) {
    notFound();
  }
  return <div className='md:hidden flex flex-row gap-2 items-center max-h-full w-full overflow-y-auto' >
    <ChatSidebarHeader />
    <Typography variant="h6">Statistics </Typography>
  </div>
}

export default StatisticPage