'use client';

import React from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { useTranslation } from 'react-i18next';
import { createBusinessFormSchema } from './schema';
import { Button } from '@/components/actions';
import { cn } from '@/utils/cn';
import { ArrowLeft, Eye } from 'lucide-react';
import { Typography } from '@/components/data-display';

export type TFormFormValues = z.infer<typeof createBusinessFormSchema>;

export const CreateFormHeader = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const onPreviewClick = () => {
    // TODO: Implement preview
  };
  return (
    <section
      className={cn(
        ' flex w-full flex-row items-center justify-between gap-3   px-4 py-2 ',
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Button.Icon
          onClick={() => {
            router.back();
          }}
          variant={'ghost'}
          size={'xs'}
          color={'default'}
          className="text-neutral-600"
        >
          <ArrowLeft className="" />
        </Button.Icon>
        <Typography className="min-w-max capitalize text-neutral-600 dark:text-neutral-50 max-sm:min-w-32">
          {t('EXTENSION.FORM.ADD_FORM')}
        </Typography>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Button
          onClick={onPreviewClick}
          shape={'square'}
          size={'xs'}
          type="button"
          color={'secondary'}
          startIcon={<Eye />}
        >
          {t('COMMON.PREVIEW')}
          &nbsp;
        </Button>
        <Button
          variant={'default'}
          size={'xs'}
          shape={'square'}
          color={'primary'}
          type="submit"
          form='form-create-form'
        >
          {t('EXTENSION.FORM.ADD_FORM')}
        </Button>
      </div>
    </section>
  );
};
