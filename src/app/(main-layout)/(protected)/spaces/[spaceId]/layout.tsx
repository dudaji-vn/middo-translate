import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import { notFound } from 'next/navigation';
import React from 'react';

const layout = async ({
  children,
  params: { spaceId },
}: {
  children: React.ReactNode;
  params: {
    spaceId: string;
  };
}) => {
  const spaceData = await businessAPI.getSpaceBySpaceID(spaceId);
  if (!spaceData) {
    notFound();
  }
  return children;
};

export default layout;
