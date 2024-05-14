import React from 'react';

import { businessAPI } from '@/features/chat/help-desk/api/business.service';

const ConversationScripts = async ({
  searchParams,
  params,
}: {
  searchParams: Record<string, string>;
  params: {
    spaceId: string;
  };
}) => {
  const space = await businessAPI.getSpaceBySpaceID(params.spaceId);

  return (
    <div className="h-full max-h-full w-full overflow-y-auto bg-white max-md:w-screen max-md:px-1">
      This is the conversation scripts page
    </div>
  );
};

export default ConversationScripts;
