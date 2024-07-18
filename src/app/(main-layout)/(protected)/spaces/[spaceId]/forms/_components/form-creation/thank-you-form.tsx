import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { Switch } from '@/components/data-entry';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { ImageIcon } from 'lucide-react';
import React from 'react';

const ThankYouForm = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5">
      <div className="flex h-fit w-full flex-col items-center justify-center gap-5">
        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-row items-center gap-2 text-neutral-600">
            <Typography>Heading</Typography>
            <Switch />
          </div>
          <div className="flex flex-row items-center gap-2 text-neutral-600">
            <Typography>Paragraph</Typography>
            <Switch />
          </div>
        </div>
        <Typography className="text-neutral-600">
          * This page will appear after the form has been successfully submitted
        </Typography>
      </div>
      <div className="flex aspect-[4/3] md:w-[30vw] w-full max-h-[300px] max-w-[400px] flex-col items-center justify-center rounded-[12px] border border-dashed border-primary-500-main ">
        <Button.Icon color="primary" size="lg">
          <ImageIcon />
        </Button.Icon>
      </div>
      <RHFInputField
        name="thankyou.title"
        formItemProps={{
          className: 'w-full',
        }}
        inputProps={{
          className:
            'p-0 text-2xl text-center outline-none  border-none !bg-transparent font-semibold leading-7 text-neutral-800 dark:text-neutral-50',
        }}
      />
      <RHFInputField
        name="thankyou.subtitle"
        formItemProps={{
          className: 'w-full',
        }}
        inputProps={{
          className:
            'p-0 text-center outline-none border-none !bg-transparent text-neutral-800 dark:text-neutral-50',
        }}
      />
    </div>
  );
};

export default ThankYouForm;
