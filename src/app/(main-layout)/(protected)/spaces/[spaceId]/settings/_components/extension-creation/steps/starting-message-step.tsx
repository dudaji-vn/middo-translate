'use client';

import { FormLabel } from '@/components/ui/form';
import React, { useEffect } from 'react';
import CustomFirstMessageOptions from '../sections/custom-first-message-options';
import { useFormContext } from 'react-hook-form';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/navigation';
import NestedFlow, { FlowNode } from './script-chat-flow/nested-flow';
import { Edge } from 'reactflow';
import {
  translateText,
  translateWithDetection,
} from '@/services/languages.service';

const StartingMessageStep = () => {
  return (
    <div className="flex flex-col gap-3 p-3">
      <FormLabel className="mb-1 inline-block text-[1rem] font-semibold text-neutral-900">
        Starting message
      </FormLabel>
      <CustomFirstMessageOptions />
    </div>
  );
};

export default StartingMessageStep;
