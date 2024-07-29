'use client';

import React from 'react';
import ExtensionForm from './_components/form-detail';
import { announceToParent } from '@/utils/iframe-util';
import { useSearchParams } from 'next/navigation';

const Page = (
  {
    // searchParams,
  }: {
    searchParams: {
      formId: string;
      guestId: string;
    };
  },
) => {
  const searchParams = useSearchParams();
  const formId = searchParams?.get('formId') || '';
  const guestId = searchParams?.get('guestId') || '';
  const closeIframe = () => {
    announceToParent({
      type: 'close-form',
      payload: {},
    });
  };

  return (
    <ExtensionForm formId={formId} guestId={guestId} onClose={closeIframe} />
  );
};

export default Page;
