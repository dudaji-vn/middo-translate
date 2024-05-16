'use client';

import { FormLabel } from '@/components/ui/form';
import React, { useEffect, useState } from 'react';
import { Input, RadioGroup, RadioGroupItem } from '@/components/data-entry';
import { RadioGroupProps } from '@radix-ui/react-radio-group';
import { Label } from '@/components/data-display';
import { Check } from 'lucide-react';
import { RHFTextAreaField } from '@/components/form/RHF/RHFInputFields';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/utils/cn';
import { isEmpty } from 'lodash';
import { DEFAULT_FIRST_MESSAGE } from '../sections/options';
import ScriptsList from '../../../../scripts/_components/scripts-list/scripts-list';
import { ChatScript } from '../../../../scripts/_components/column-def/scripts-columns';

export type StartingMessageStepProps = {
  scripts: ChatScript[];
};
type TRadioOptions = 'default' | 'custom' | 'script';

const StartingMessageStep = ({
  scripts,
  ...props
}: StartingMessageStepProps & RadioGroupProps) => {
  const { setValue, watch } = useFormContext();
  const startingMessageType = watch('startingMessageType') || 'default';
  const rowSelection = watch('currentScript')
    ? {
        [watch('currentScript')]: true,
      }
    : {};

  const handleSelectScript = (updater: any) => {
    const updated = updater();
    if (!isEmpty(updated)) {
      setValue('currentScript', Object.keys(updated)[0]);
      setValue('custom.firstMessage', watch('currentScript'));
    }
  };
  const [search, setSearch] = useState('');
  const onSearchChange = (search: string) => {
    setSearch(search);
  };
  const displayScript = scripts.filter((script) =>
    script.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="flex flex-col gap-3 p-4">
      <FormLabel className="mb-1 inline-block text-[1rem] font-semibold text-neutral-900">
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
            className="border-neutral-200 ring-neutral-200"
          >
            <Check
              className="absolute left-[1px] top-[1px] h-[14px] w-3"
              stroke="white"
            />
          </RadioGroupItem>
          <Label htmlFor="r1">Default</Label>
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
            className="border-neutral-200 ring-neutral-200"
          >
            <Check
              className="absolute left-[1px] top-[1px] h-[14px] w-3"
              stroke="white"
            />
          </RadioGroupItem>
          <Label htmlFor="r2">Custom</Label>
        </div>
        <RHFTextAreaField
          formItemProps={{
            className: cn({
              hidden: startingMessageType !== 'custom',
            }),
          }}
          name={'custom.firstMessage'}
          textareaProps={{
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
            className="border-neutral-200 ring-neutral-200"
          >
            <Check
              className="absolute left-[1px] top-[1px] h-[14px] w-3"
              stroke="white"
            />
          </RadioGroupItem>
          <Label htmlFor="r1">Scripted Conversation</Label>
        </div>
        <div
          className={cn('w-full overflow-x-auto', {
            hidden: startingMessageType !== 'script',
          })}
        >
          <ScriptsList
            titleProps={{
              className: 'hidden',
            }}
            tableProps={{
              tableInitialParams: {
                onRowSelectionChange: handleSelectScript,
                state: {
                  rowSelection,
                },
                enableMultiRowSelection: false,
                getRowId: (row) => row._id,
              },
            }}
            enableSelectAll={false}
            scripts={displayScript}
            search={search}
            onSearchChange={onSearchChange}
            isLoading={false}
          />
        </div>
      </RadioGroup>
    </div>
  );
};

export default StartingMessageStep;
