import React from 'react';

import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import SpaceSetting from './_components/space-setting/space-setting';
import CreateExtension from './_components/extension-creation/create-extension';
import { notFound } from 'next/navigation';

enum ESettingTabs {
  'MEMBERS' = 'members',
  'EXTENSION' = 'extension',
  'TAGS' = 'tags',
}
const SpaceSettingPage = async ({
  searchParams,
  params,
}: {
  searchParams: Record<string, string>;
  params: {
    spaceId: string;
  };
}) => {
  const space = await businessAPI.getSpaceBySpaceID(params.spaceId);

  const modalType = searchParams.modal;
  const openTab =
    Object.values(ESettingTabs).find((tab) => tab === searchParams.tab) ||
    ESettingTabs.MEMBERS;
  const businessExtension = space?.extension;
  if (!space) {
    notFound();
  }

  return (
    <div className="h-full max-h-full w-full overflow-y-auto bg-white max-md:w-screen max-md:px-1">
      <SpaceSetting space={space} defaultTab={openTab} />
      <div className="w-full bg-white">
        <CreateExtension
          space={space}
          open={Boolean(
            modalType === 'create-extension' ||
              (modalType === 'edit-extension' && businessExtension),
          )}
          isEditing={Boolean(modalType === 'edit-extension')}
          initialData={businessExtension}
        />
      </div>
    </div>
  );
};

export default SpaceSettingPage;
