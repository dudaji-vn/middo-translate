'use client';

import React from 'react';
import ExtensionForm from './_components/form-detail';

const page = ({
  searchParams,
}: {
  searchParams: {
    // spaceId: string;
    formId: string;
  };
}) => {
  return <ExtensionForm {...searchParams} />;
};

export default page;
