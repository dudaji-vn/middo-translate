'use client';

import React from 'react';
import ExtensionForm from './_components/form-detail';
import { announceToParent } from '@/utils/iframe-util';

const page = ({
  searchParams,
}: {
  searchParams: {
    formId: string;
    guestId: string;
  };
}) => {
  const closeIframe = () => {
    announceToParent({
      type: 'close-form',
      payload: {},
    });
  };

  
  return <ExtensionForm {...searchParams} onClose={closeIframe} />;
};

export default page;
