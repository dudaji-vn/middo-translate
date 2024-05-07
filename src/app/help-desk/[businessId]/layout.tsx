import { extensionsCustomThemeOptions } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/settings/_components/extension-creation/sections/options';
import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import { cn } from '@/utils/cn';
import { notFound } from 'next/navigation';
import React, { ReactNode } from 'react';

const HelpDeskConversationLayout = async ({
  children,
  params: { businessId },
}: {
  children: ReactNode;
  params: {
    businessId: string;
  };
}) => {
  const extensionData = await businessAPI.getExtensionByBusinessId(businessId);
  if (!extensionData) {
    notFound();
  }
  const theme =
    extensionsCustomThemeOptions.find(
      (item) =>
        item.name === extensionData.color || item.hex === extensionData.color,
    ) || extensionsCustomThemeOptions[0];

  return <div className={cn(theme.name, 'container-height')}>{children}</div>;
};
export default HelpDeskConversationLayout;
