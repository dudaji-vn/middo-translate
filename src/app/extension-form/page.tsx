'use client';

import React from 'react';
import ExtensionForm from './_components/extension-form';
import { announceToParent } from '@/utils/iframe-util';
import { useSearchParams } from 'next/navigation';

const Page = (
  {
    // searchParams,
  }: {
    searchParams: {
      formId: string;
      guestId: string;
      language?: string;
      messageId?: string;
    };
  },
) => {
  const searchParams = useSearchParams();
  const formId = searchParams?.get('formId') || undefined;
  const guestId = searchParams?.get('guestId') || undefined;
  const messageId = searchParams?.get('messageId') || undefined;
  const language = searchParams?.get('language') || undefined;
  const closeIframe = (done: boolean) => {
    announceToParent({
      type: 'close-form',
      payload: {
        done,
      },
    });
  };
  console.log('formId:languagelanguage>>', language);
  return (
    <ExtensionForm
      formId={formId}
      guestId={guestId}
      onClose={closeIframe}
      messageId={messageId}
      language={language}
    />
  );
};

export default Page;
