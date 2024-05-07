'use client';

import { FormLabel } from '@/components/ui/form';
import React from 'react';
import CustomFirstMessageOptions from '../sections/custom-first-message-options';

const StartingMessageStep = () => {
  return (
    <div className="flex flex-col gap-3 p-4">
      <FormLabel className="mb-1 inline-block text-[1rem] font-semibold text-neutral-900">
        Starting message
      </FormLabel>
      <CustomFirstMessageOptions />
    </div>
  );
};

export default StartingMessageStep;
