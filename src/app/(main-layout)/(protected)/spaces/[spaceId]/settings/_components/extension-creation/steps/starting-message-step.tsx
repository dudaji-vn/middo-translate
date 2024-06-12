'use client';

import { FormLabel } from '@/components/ui/form';
import React from 'react';
import { Input, RadioGroup, RadioGroupItem } from '@/components/data-entry';
import { RadioGroupProps } from '@radix-ui/react-radio-group';
import { Label } from '@/components/data-display';
import { Check } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/utils/cn';
import { DEFAULT_FIRST_MESSAGE } from '../sections/options';
import ScriptsSelection from './scripts-selection';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';

export type StartingMessageStepProps = {};
type TRadioOptions = 'default' | 'custom' | 'script';

const StartingMessageStep = ({
  ...props
}: StartingMessageStepProps & RadioGroupProps) => {
  const { setValue, watch } = useFormContext();
  const startingMessageType = watch('startingMessageType') || 'default';

  return (
    <div className="flex flex-col gap-3 p-4">
      <FormLabel className="mb-1 inline-block text-[1rem] font-semibold text-neutral-900 dark:text-neutral-50">
        Starting message
      </FormLabel>
      <RadioGroup
        {...props}
        className="flex w-full flex-col gap-4"
        onValueChange={(value) => {
          switch (value) {
            case 'default':
              setValue('custom.firstMessage', DEFAULT_FIRST_MESSAGE.content);
              break;
            case 'custom':
              setValue('custom.firstMessage', '');
              break;
            case 'script':
              setValue('custom.firstMessage', watch('currentScript'));
              break;
          }
          setValue('startingMessageType', value);
        }}
        value={startingMessageType}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="default"
            id="r1"
            iconProps={{ className: 'h-full w-full' }}
            className="border-neutral-200 ring-neutral-200 dark:border-neutral-800 dark:ring-neutral-900"
          >
            <Check
              className="absolute left-[1px] top-[1px] h-[14px] w-3"
              stroke="white"
            />
          </RadioGroupItem>
          <Label htmlFor="r1" className="dark:text-neutral-50">Default</Label>
        </div>
        <Input
          name="custom.firstMessage"
          disabled={startingMessageType !== 'default'}
          readOnly
          wrapperProps={{
            className: cn({
              hidden: startingMessageType !== 'default',
            }),
          }}
          value={DEFAULT_FIRST_MESSAGE.content}
        />
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="custom"
            id="r2"
            iconProps={{ className: 'h-full w-full' }}
            className="border-neutral-200 ring-neutral-200 dark:border-neutral-800 dark:ring-neutral-900"
          >
            <Check
              className="absolute left-[1px] top-[1px] h-[14px] w-3"
              stroke="white"
            />
          </RadioGroupItem>
          <Label htmlFor="r2" className="dark:text-neutral-50">Custom</Label>
        </div>
        <RHFInputField
          formItemProps={{
            className: cn({
              hidden: startingMessageType !== 'custom',
            }),
          }}
          name={'custom.firstMessage'}
          inputProps={{
            hidden: startingMessageType !== 'custom',
            placeholder: 'Type your custom first message',
            disabled: startingMessageType !== 'custom',
            className:
              startingMessageType === 'custom'
                ? 'border-primary ring-primary px-2'
                : 'opacity-50 border-neutral-200 ring-neutral-200',
          }}
        />
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="script"
            id="r1"
            iconProps={{ className: 'h-full w-full' }}
            className="border-neutral-200 ring-neutral-200 dark:border-neutral-800 dark:ring-neutral-900"
          >
            <Check
              className="absolute left-[1px] top-[1px] h-[14px] w-3"
              stroke="white"
            />
          </RadioGroupItem>
          <Label htmlFor="r1" className="dark:text-neutral-50">Scripted Conversation</Label>
        </div>
        <div
          className={cn(
            'w-full origin-top overflow-x-auto transition-all duration-200',
            {
              'hidden': startingMessageType !== 'script',
            },
          )}
        >
          <ScriptsSelection />
        </div>
      </RadioGroup>
    </div>
  );
};

export default StartingMessageStep;
