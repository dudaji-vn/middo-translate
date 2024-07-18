import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { Switch } from '@/components/data-entry';

import React from 'react';
import { useFormContext } from 'react-hook-form';

const CustomizeForm = () => {
  const { setValue, watch } = useFormContext();

  return (
    <div className="flex h-full w-full flex-col  gap-8">
      <div className="flex h-fit w-full flex-col items-start justify-start gap-3">
        <Typography className="font-bold text-neutral-800">Layout</Typography>
        <div className="flex w-full flex-row items-center gap-3">
          <Typography className="text-neutral-600">
            Show progress bar
          </Typography>
          <Switch
            checked={watch('layout.showProgressBar')}
            onCheckedChange={(value) =>
              setValue('layout.showProgressBar', value)
            }
          />
        </div>
      </div>
      <div className="flex h-fit w-full flex-col items-start justify-start gap-3"></div>
      <div className="flex h-fit w-full flex-col items-start justify-start gap-3"></div>
    </div>
  );
};

export default CustomizeForm;
