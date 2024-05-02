'use client';

import React from 'react';

import { Typography } from '@/components/data-display';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import UploadSpaceImage from './upload-space-image';

const CreateSpaceForm = () => {
  return (
    <section className="flex h-[calc(100vh-220px)] min-h-80  max-w-[800px] flex-col items-center justify-center gap-8">
      <div className="flex w-full flex-col  gap-3">
        <Typography className="text-[32px] font-semibold leading-9 text-neutral-800">
          Give <span className="text-primary-500-main">your space</span> some
          information
        </Typography>
        <Typography className="font-normal text-neutral-600">
          Help your crews to recognize your business easier by naming this
          space, adding space avatar or company&apos;s logo{' '}
          <span className="font-light">(optional)</span>.
        </Typography>
      </div>
      <div className="flex w-full flex-row items-center gap-3 rounded-[12px] bg-primary-100 p-3">
        <UploadSpaceImage nameField="avatar" />
        <RHFInputField
          name="name"
          formItemProps={{
            className: 'w-full',
          }}
          inputProps={{
            placeholder: 'Enter space name',
            required: true,
          }}
        />
      </div>
    </section>
  );
};

export default CreateSpaceForm;
