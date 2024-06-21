'use client';

import React from 'react';

import { Typography } from '@/components/data-display';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { useTranslation } from 'react-i18next';
import UploadStationImage from './upload-station-image';

const CreateStationForm = () => {
  const { t } = useTranslation('common');
  return (
    <section className="flex h-[calc(100vh-220px)] min-h-80 max-w-[800px]  flex-col items-center justify-center gap-8 max-md:px-4">
      <div className="flex w-full flex-col  gap-3">
        <Typography className="text-[32px] font-semibold leading-9 text-neutral-800 dark:text-neutral-50">
          <span
            dangerouslySetInnerHTML={{
              __html: t('MODAL.CREATE_STATION.TITLE'),
            }}
          />
        </Typography>
        <Typography className="font-normal text-neutral-600 dark:text-neutral-100">
          <span
            dangerouslySetInnerHTML={{
              __html: t('MODAL.CREATE_STATION.DESCRIPTION'),
            }}
          />
        </Typography>
      </div>
      <div className="flex w-full flex-row items-center gap-3 rounded-[12px] bg-primary-100 p-3 dark:bg-neutral-900">
        <UploadStationImage nameField="avatar" />
        <RHFInputField
          name="name"
          formItemProps={{
            className: 'w-full',
          }}
          formMessageProps={{
            render: ({ message }) => {
              console.log('message', message);
              return (
                <Typography className="text-sm text-red-500">
                  {t(message)}
                </Typography>
              );
            },
          }}
          inputProps={{
            placeholder: t('MODAL.CREATE_STATION.PLACEHOLDERS.NAME'),
            required: true,
          }}
        />
      </div>
    </section>
  );
};

export default CreateStationForm;
