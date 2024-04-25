import React from 'react';

import { businessAPI } from '@/features/chat/help-desk/api/business.service';
import SpaceSetting from './_components/space-setting/space-setting';
import CreateExtension from './_components/extension-creation/create-extension';
import { notFound } from 'next/navigation';

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
  const businessExtension = space?.extension;
  if (!space) {
    notFound();
  }

  return (
    <div className="h-full max-h-full w-full overflow-y-auto bg-white max-md:w-screen max-md:px-1">
      <SpaceSetting space={space} />
      <div className="w-full bg-white">
        <CreateExtension
          space={space}
          open={Boolean(
            modalType === 'create-extension' ||
              (modalType === 'edit-extension' && businessExtension),
          )}
          initialData={businessExtension}
        />
      </div>
    </div>
  );
};

export default SpaceSettingPage;
