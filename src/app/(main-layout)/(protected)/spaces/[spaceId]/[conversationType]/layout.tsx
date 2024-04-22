import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import { useAppStore } from '@/stores/app.store';
import { EBusinessConversationKeys } from '@/types/business.type';
import { notFound } from 'next/navigation';
import React, { ReactNode } from 'react';
import ConversationLayout from './_components/conversation-layout';

const BusinessConversationLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: {
    conversationType: EBusinessConversationKeys;
    spaceId: string;
  };
}) => {
  if (
    !Object.values(EBusinessConversationKeys).includes(params.conversationType)
  ) {
    notFound();
  }
  const spaceData = await businessAPI.getSpaceBySpaceID(params.spaceId);
  return (
    <div className="flex-1">
      <ConversationLayout spaceData={spaceData}>{children}</ConversationLayout>
    </div>
  );
};
export default BusinessConversationLayout;
